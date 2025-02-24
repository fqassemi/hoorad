'use client';
import { useState, useEffect } from 'react';
//Icons
import { FiEdit, FiX, FiPlus } from 'react-icons/fi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
//APIs
import useGetCourses from '@/hooks/api/course/useGetCourse';
import usePostCourse from '@/hooks/api/course/usePostCourse';
import usePatchCourse from '@/hooks/api/course/usePatchCourse';
import useDeleteCourse from '@/hooks/api/course/useDeleteCourse';
import usePostImage from '@/hooks/api/image/usePostImg';

//Components Accordin & Loader
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import CircularLoader from '@/components/ui/circular-loader';
import ConfirmModal from "@/components/templates/confirm-modal";
import { motion } from 'framer-motion';


const Courses = () => {
  const { data, isLoading, mutate } = useGetCourses();
  const { trigger: createCourseTrigger, isLoading: isCreating } = usePostCourse();
  const { trigger: updateCourseTrigger, isLoading: isUpdating } = usePatchCourse();
  const { trigger: deleteCourseTrigger, isLoading: isDeleting } = useDeleteCourse();
  const { trigger: postImageTrigger, isMutating: uploading } = usePostImage();

  const [showForm, setShowForm] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    description: '',
    price: '',
    sessions: [],
    is_enrolled: false,
    issuedDate: dateTime,
    previewImage: null,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: '',
    course: null,
    sessionIndex: null,
  });

  const addSession = () => {
    const sessionNumber = formData.sessions.length + 1;
    const newSession = {
      title: `جلسه ${sessionNumber}`,
      resources: [{ id: '', title: '' }],
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      sessions: [...prevFormData.sessions, newSession],
    }));
  };

  const handleResourceTitleChange = (sessionIndex, resourceIndex, e) => {
    const updatedSessions = [...formData.sessions];
    updatedSessions[sessionIndex].resources[resourceIndex].title = e.target.value;
    setFormData({ ...formData, sessions: updatedSessions });
  };

  const handleSessionVideoChange = (sessionIndex, e) => {
    const updatedSessions = [...formData.sessions];
    updatedSessions[sessionIndex].videoFile = e.target.files[0];
    setFormData({ ...formData, sessions: updatedSessions });
  };

  const handleSessionCodeChange = (sessionIndex, e) => {
    const updatedSessions = [...formData.sessions];
    updatedSessions[sessionIndex].codeFile = e.target.files[0];
    setFormData({ ...formData, sessions: updatedSessions });
  };

  useEffect(() => {
    if (dateTime) {
      setFormData((prevState) => ({
        ...prevState,
        issuedDate: dateTime,
      }));
    }
  }, [dateTime]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'price') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prevState) => ({
        ...prevState,
        [name]: numericValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleImageUpload = async () => {
    if (!formData.previewImage || typeof formData.previewImage === 'string') {
      return;
    }

    try {
      const formDataImage = new FormData();
      formDataImage.append('image', formData.previewImage);
      const imageResponse = await postImageTrigger({
        imageId: `course-preview-${formData.id}`,
        newImage: formDataImage,
      });

      if (imageResponse && imageResponse.url) {
        setFormData((prevData) => ({
          ...prevData,
          previewImage: imageResponse.url,
        }));
        alert('عکس با موفقیت آپلود شد.');
      } else {
        throw new Error('Image upload failed: No URL returned');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAction = async (action, course = null, sessionIndex = null) => {
    setModalState({ isOpen: true, action, course, sessionIndex });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      id: '',
      description: '',
      price: '',
      sessions: [],
      is_enrolled: false,
      issuedDate: dateTime,
      previewImage: null,
    });
    setEditIndex(null);
    setShowForm(false);
  };

  const handleModalConfirm = async () => {
    if (modalState.action === 'removeSession' && modalState.sessionIndex !== null) {
      const updatedSessions = formData.sessions.filter((_, i) => i !== modalState.sessionIndex);
      setFormData({ ...formData, sessions: updatedSessions });
    }
    else if (modalState.action === 'deleteCourse' && modalState.course) {
      try {
        await deleteCourseTrigger({ id: modalState.course.id });
        await mutate();
      } catch (error) {
        console.error('Error deleting course:', error.message);
      }
    }
    else if (modalState.action === 'edit' || modalState.action === 'add') {
      try {
        let response;
        if (modalState.action === 'add') {
          response = await createCourseTrigger({ courseId: modalState.course.id, newCourse: modalState.course });
        } else {
          response = await updateCourseTrigger({ courseId: modalState.course.id, updatedCourse: modalState.course });
        }
        await mutate();
        resetForm();
      } catch (error) {
        console.error(`Error handling ${modalState.action}:`, error);
      }
    }
    setModalState({ isOpen: false, action: '', course: null, sessionIndex: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionType = editIndex !== null ? 'edit' : 'add';
    const { issuedDate, ...courseData } = formData;
    await handleAction(actionType, courseData);
    resetForm();
  };

  const handleEdit = (index) => {
    const courseToEdit = data[index];
    setFormData({
      name: courseToEdit.name || '',
      id: courseToEdit.id || '',
      description: courseToEdit.description || '',
      price: courseToEdit.price || '',
      sessions: courseToEdit.sessions || [],
      issuedDate: courseToEdit.issuedDate || dateTime,
      is_enrolled: courseToEdit.is_enrolled || false,
      previewImage: courseToEdit.previewImage || null,
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (courseId) => {
    setModalState({
      isOpen: true,
      action: 'deleteCourse',
      course: { id: courseId },
      sessionIndex: null,
    });
  };

  const UploadingSpinner = () => (
    <div className="flex items-center justify-center">
      <FaSpinner className="animate-spin h-5 w-5 text-orange-500" />
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">در حال آپلود...</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader className='text-orange-500' />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت درس ها</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-orange-500 text-white sm:px-4 px-3 text-sm py-2 rounded hover:bg-orange-600"
      >
        {showForm ? 'بستن فرم' : 'ایجاد دوره جدید'}
      </button>

      {showForm && (
        <div className='mt-6 bg-[#f9f9f9] dark:bg-neutral-800 p-6 rounded shadow-md'>
          <h2 className='text-xl font-bold mb-4'>درس جدید</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Accordion type="single" collapsible className="w-full space-y-3" defaultValue="course-details">
              <AccordionItem value="course-details">
                <AccordionTrigger className="w-full [&[data-state=open]_#container]:rounded-b-none [&[data-state=open]_#container]:bg-customOrange [&[data-state=open]_#container]:text-white">
                  <div className="flex items-center justify-between gap-x-1 rounded-lg bg-white dark:bg-gray-800 px-3 py-4 transition-all duration-150 hover:bg-orange-100 max-sm:text-sm" id="container">
                    <p>جزییات درس جدید</p>
                    <MdOutlineKeyboardArrowDown
                      className="size-5 transition-all duration-200"
                      id="arrowSvg"
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="rounded-b-lg bg-white dark:bg-gray-800 py-4 px-2 lg:px-8">
                  <div className="space-y-4">
                    <div className='flex justify-between gap-2 flex-col lg:flex-row'>
                      <div className='relative w-full'>
                        <label htmlFor='courseTitle'
                          className={`absolute text-sm font-semibold transition-all duration-200  ${formData.name ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}>عنوان دوره</label>
                        <input
                          id='courseTitle'
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
                          required
                        />
                      </div>
                      <div className='flex gap-2 w-full'>
                        <div className='relative w-full'>
                          <label htmlFor='courseID'
                            className={`absolute text-sm font-semibold transition-all duration-200  ${formData.id ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}>آیدی دوره</label>
                          <input
                            id='courseID'
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
                            required
                          />
                        </div>
                        <div className='relative w-full'>
                          <label htmlFor='coursePrice'
                            className={`absolute text-sm font-semibold transition-all duration-200 
            ${formData.price ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}>قیمت دوره (تومان)</label>
                          <input
                            id='coursePrice'
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            disabled={formData.isFree}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className='relative w-full'>
                      <label htmlFor='courseDescription'
                        className={`absolute text-sm font-semibold transition-all duration-200 
            ${formData.description ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/4 right-4 translate-y-[-50%] text-gray-400 text-base'}`}>توضیحات دوره</label>
                      <textarea
                        id='courseDescription'
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                        عکس پیش نمایش
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, previewImage: e.target.files[0] })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        {uploading ? <UploadingSpinner /> : 'آپلود عکس'}
                      </button>
                      {formData.previewImage && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">پیش نمایش:</p>
                          <img
                            src={
                              typeof formData.previewImage === 'string'
                                ? formData.previewImage 
                                : formData.previewImage instanceof File || formData.previewImage instanceof Blob
                                  ? URL.createObjectURL(formData.previewImage) 
                                  : null 
                            }
                            alt="preview"
                            className="w-32 h-32 rounded-lg shadow-lg object-cover border border-gray-200 dark:border-gray-600"
                            onError={(e) => {
                              e.target.src = ''; 
                            }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div>
              <button
                type="button"
                onClick={addSession}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                <FiPlus className="w-4 h-4" />
                <span>افزودن جلسه جدید</span>
              </button>
            </div>
            <div className='px-16'>
              {formData.sessions.map((session, sessionIndex) => (
                <div key={sessionIndex} className="my-2">
                  <div className="flex items-center justify-between">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`session-${sessionIndex}`}>
                        <AccordionTrigger className="w-full [&[data-state=open]_#container]:rounded-b-none [&[data-state=open]_#container]:bg-customOrange [&[data-state=open]_#container]:text-white">
                          <div className="flex items-center justify-between gap-x-1 rounded-lg bg-white dark:bg-gray-800 px-3 py-4 transition-all duration-150 hover:bg-orange-100 max-sm:text-sm" id="container">
                            <p>جلسه {sessionIndex + 1}</p>
                            <MdOutlineKeyboardArrowDown
                              className="size-5 transition-all duration-200"
                              id="arrowSvg"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white py-4 px-8 dark:bg-gray-800">
                            {session.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className='relative w-full'>
                                <label htmlFor='resourceTitle'
                                  className={`absolute text-sm font-semibold transition-all duration-200 
                    ${resource.title ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}>عنوان منبع</label>
                                <input
                                  id='resourceTitle'
                                  type="text"
                                  value={resource.title}
                                  onChange={(e) => handleResourceTitleChange(sessionIndex, resourceIndex, e)}
                                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                  required
                                />
                              </div>
                            ))}
                            <div className='flex justify-between gap-4'>
                              <div>
                                <label className="block text-sm font-bold mb-1">فایل ویدیو</label>
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleSessionVideoChange(sessionIndex, e)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold mb-1">فایل کد</label>
                                <input
                                  type="file"
                                  accept=".zip,.rar,.tar,.tar.gz"
                                  onChange={(e) => handleSessionCodeChange(sessionIndex, e)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <button
                      type="button"
                      onClick={() => handleAction('removeSession', null, sessionIndex)}
                      className="ml-4 text-white p-1.5 rounded bg-red-500 hover:bg-red-600 mx-2"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {editIndex !== null ? 'به‌روزرسانی دوره' : 'ثبت درس'}
            </button>
          </form>

        </div>
      )}
      <div className="mt-6 bg-[#f9f9f9] dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold">دوره های اضافه شده</h2>
        <div className="mt-4 space-y-4">
          {data?.length > 0 ? (
            data.map((course, index) => (
              <div key={index} className="p-4 border rounded shadow-md">
                <div className='flex items-center justify-between flex-col md:flex-row'>
                  {course.previewImage && (
                    <div className="mt-2 w-full h-64 md:h-30 md:w-30">
                      <img
                        src={course.previewImage}
                        alt="preview"
                        className="rounded w-full h-full"
                      />
                    </div>
                  )}
                  <div className='mt-3 mx-3 w-full'>
                    <h3 className="text-lg font-semibold">{course.name}</h3>
                    <p className='text-sm text-gray-400 text-wrap '>{course.description.split(' ').length > 20
                      ? course.description.split(' ').slice(0, 20).join(' ') + '...'
                      : course.description}</p>
                    <p className="mt-2 text-sm text-gray-400">قیمت: {course.isFree ? 'رایگان' : `${course.price} تومان`}</p>
                    <p className="mt-2 text-xs text-gray-500">تاریخ ایجاد: {course.issuedDate}</p>
                  </div>
                  <div className='flex'>
                    <button
                      onClick={() => handleEdit(index)}
                      className="mt-2 text-white py-1.5 px-2 mx-1 rounded bg-orange-400 hover:bg-orange-500"
                    >
                      <FiEdit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="mt-2 text-white p-1.5 rounded bg-red-500 hover:bg-red-600"
                    >
                      <FiX className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className='text-center dark:text-gray-200'>هیچ دوره‌ای اضافه نشده است.</p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, action: '', course: null, sessionIndex: null })}
        title={
          modalState.action === 'removeSession'
            ? 'آیا مطمئن هستید که می‌خواهید این جلسه را حذف کنید؟'
            : modalState.action === 'deleteCourse'
              ? 'آیا مطمئن هستید که می‌خواهید این دوره را حذف کنید؟'
              : modalState.action === 'edit'
                ? 'آیا مطمئن هستید که می‌خواهید این دوره را ویرایش کنید؟'
                : 'آیا مطمئن هستید که می‌خواهید این دوره را اضافه کنید؟'
        }
        onConfirmClick={handleModalConfirm}
      />
    </div>
  );
};

export default Courses;