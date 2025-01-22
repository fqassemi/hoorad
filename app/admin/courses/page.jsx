'use client';

import { useState, useEffect } from 'react';
import ConfirmModal from "@/components/templates/confirm-modal";
import { FiEdit, FiX, FiPlus } from 'react-icons/fi';
import { postCourse, getCourses, updateCourse, deleteCourse } from '@/hooks/api/courseApi'; // Import the API functions

const Courses = () => {
  const [showForm, setShowForm] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    isFree: false,
    sessions: [],
    previewImage: null,
    issuedDate: dateTime,
  });
  const [courses, setCourses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: '',
    course: null,
    sessionIndex: null,
  });



  const handleSessionTitleChange = (index, e) => {
    const updatedSessions = [...formData.sessions];
    updatedSessions[index].title = e.target.value;
    setFormData({ ...formData, sessions: updatedSessions });
  };

  const handleSessionVideoChange = (index, e) => {
    const updatedSessions = [...formData.sessions];
    updatedSessions[index].videoFile = e.target.files[0];
    setFormData({ ...formData, sessions: updatedSessions });
  };

  const handleSessionCodeChange = (index, e) => {
    const updatedSessions = [...formData.sessions];
    updatedSessions[index].codeFile = e.target.files[0];
    setFormData({ ...formData, sessions: updatedSessions });
  };


  const addSession = () => {
    setFormData({
      ...formData,
      sessions: [...formData.sessions, { title: '', videoFile: null, codeFile: null }],
    });
  };

  const handleRemoveSession = (index) => {
    const updatedSessions = formData.sessions.filter((_, i) => i !== index);
    setFormData({ ...formData, sessions: updatedSessions });
  };


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();

    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(now);
      setDateTime(formattedDateTime);
    };

    updateDateTime();
  }, []);

  useEffect(() => {
    if (dateTime) {
      setFormData((prevState) => ({
        ...prevState,
        issuedDate: dateTime,
      }));
    }
  }, [dateTime]);

  // useEffect(() => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     sessions: sessions,
  //   }));
  // }, [sessions]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'isFree') {
      setFormData({
        ...formData,
        isFree: checked,
        price: checked ? '' : formData.price,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      previewImage: file,
    });
  };

  const openConfirmModal = (action, course, sessionIndex = null) => {
    setModalState({
      isOpen: true,
      action,
      course,
      sessionIndex,
    });
  };

  const handleModalConfirm = async () => {
    const { action, course, sessionIndex } = modalState;

    try {
      if (action === 'removeSession' && sessionIndex !== null) {
        handleRemoveSession(sessionIndex);
      } else {
        let response;
        if (action === 'add') {
          response = await postCourse(course);
        } else if (action === 'edit') {
          response = await updateCourse(course.id, course);
        }

        if (response) {
          if (action === 'add') {
            setCourses([...courses, response]);
          } else if (action === 'edit') {
            const updatedCourses = [...courses];
            updatedCourses[editIndex] = response;
            setCourses(updatedCourses);
          }


          setShowForm(false);
          setFormData({
            title: '',
            description: '',
            price: '',
            isFree: false,
            files: null,
            previewImage: null,
            issuedDate: dateTime,
          });
        }
      }
    } catch (error) {
      console.error('Error handling action:', error);
      alert('Failed to complete the action.');
    } finally {
      setModalState({ isOpen: false, action: '', course: null, sessionIndex: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCourse = {
      ...formData,
      // sessions,
      issuedDate: dateTime,
    };


    const action = editIndex !== null ? 'edit' : 'add';

    try {
      if (action === 'add') {
        const response = await postCourse(newCourse);
        setCourses((prev) => [...prev, response]);
      } else {
        const response = await updateCourse(courses[editIndex].id, newCourse);
        const updatedCourses = [...courses];
        updatedCourses[editIndex] = response;
        setCourses(updatedCourses);
      }


      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        price: '',
        isFree: false,
        sessions: [],
        previewImage: null,
        issuedDate: dateTime,
      });
      // setSessions([]);
      setEditIndex(null);
    } catch (error) {
      console.error('Failed to submit form:', error.message);
      alert('خطا در ثبت یا به‌روزرسانی دوره');
    }
  };


  const handleEdit = (index) => {
    const courseToEdit = courses[index];
    setFormData({
      ...courseToEdit,
      sessions: courseToEdit.sessions || [],
    });
    setEditIndex(index);
    setShowForm(true);
  };


  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((course) => course.id !== courseId)); // Update the local state
    } catch (error) {
      console.error('Error deleting course:', error.message);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت درس ها</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        {showForm ? 'بستن فرم' : 'ایجاد دوره جدید'}
      </button>


      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-[#f9f9f9] dark:bg-gray-800 p-6 rounded shadow-md">
          <div className='relative w-full'>
            <label htmlFor='courseTitle'
              className={`absolute text-sm font-semibold transition-all duration-200 
                ${formData.title ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}>عنوان دوره</label>
            <input
              id='courseTitle'
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              required
            />
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
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isFree"
              checked={formData.isFree}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label>دوره رایگان است</label>
          </div>
          <div>

            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">عکس پیش نمایش:</label>
            <input type="file" accept="image/*" id='pic_input' onChange={handleImageChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />

            {formData.previewImage && (
              <div className="mt-3">
                <p>پیش نمایش:</p>
                <img src={URL.createObjectURL(formData.previewImage)} alt="preview" className="w-32 h-32 rounded object-cover" />
              </div>
            )}
          </div>
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

          {formData.sessions.map((session, index) => (
            <div key={index} className="mt-4 p-4 border rounded space-y-3">
              <button
                type="button"
                onClick={() => openConfirmModal('removeSession', null, index)}
                className="mt-2 text-white p-1.5 rounded bg-red-500 hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
              <div className='relative w-full'>
                <label htmlFor='courseSession'
                  className={`absolute text-sm font-semibold transition-all duration-200 
                ${session.title ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}>عنوان جلسه {index + 1}</label>
                <input
                  id='courseSession'
                  type="text"
                  value={session.title}
                  onChange={(e) => handleSessionTitleChange(index, e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">فایل ویدیو</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleSessionVideoChange(index, e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">فایل کد</label>
                <input
                  type="file"
                  accept=".zip,.rar,.tar,.tar.gz"
                  onChange={(e) => handleSessionCodeChange(index, e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

            </div>
          ))}

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editIndex !== null ? 'به‌روزرسانی دوره' : 'ثبت درس'}
          </button>
        </form>
      )}

      <div className="mt-6 bg-[#f9f9f9] dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold">دوره های اضافه شده</h2>
        <div className="mt-4 space-y-4">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <div key={index} className="p-4 border rounded flex justify-between items-center shadow-md">
                <div className='flex'>
                  {course.previewImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(course.previewImage)}
                        alt="preview"
                        className="w-32 h-32 rounded object-cover"
                      />
                    </div>
                  )}
                  <div className='mx-3 mt-3'>
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className='text-sm text-gray-400'>{course.description.split(' ').length > 20
                      ? course.description.split(' ').slice(0, 20).join(' ') + '...'
                      : course.description}</p>
                    <p className="mt-2 text-sm text-gray-400">قیمت: {course.isFree ? 'رایگان' : `${course.price} تومان`}</p>
                    <p className="mt-2 text-xs text-gray-500">تاریخ ایجاد: {course.issuedDate}</p>
                  </div>
                </div>

                <div>
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

