'use client';

import { useState, useEffect } from 'react';
import ConfirmModal from "@/components/templates/confirm-modal";
import { FiEdit } from 'react-icons/fi';
import { postCourse, getCourses } from '@/hooks/api/courseApi'; // Import the API functions

const Courses = () => {
  const [showForm, setShowForm] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    isFree: false,
    files: null,
    previewImage: null,
    issuedDate: dateTime,
  });
  const [courses, setCourses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: '',
    course: null,
  });

  useEffect(() => {
    // Fetch courses when the component mounts
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
        month: 'long',
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

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: e.target.files,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      previewImage: file,
    });
  };

  const openConfirmModal = (action, course) => {
    setModalState({
      isOpen: true,
      action,
      course,
    });
  };

  const handleModalConfirm = async () => {
    const { action, course } = modalState;

    try {
      // Send course data to the API
      const response = await postCourse(course);

      if (response) {
        alert('Course successfully added/updated');
        // You can add course to the state if the API response includes the updated list or new course
        if (action === 'add') {
          setCourses([...courses, response]);
        } else if (action === 'edit') {
          const updatedCourses = [...courses];
          updatedCourses[editIndex] = response;
          setCourses(updatedCourses);
        }
      }

      setModalState({ isOpen: false, action: '', course: null });
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
    } catch (error) {
      console.error('Failed to add/update course:', error);
      alert('Failed to add/update course');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCourse = { ...formData, issuedDate: dateTime }; // Ensure the date is included
    const action = editIndex !== null ? 'edit' : 'add';

    // Open confirmation modal
    openConfirmModal(action, newCourse);
  };

  const handleEdit = (index) => {
    const courseToEdit = courses[index];
    setFormData(courseToEdit); 
    setEditIndex(index); 
    setShowForm(true); 
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت درس ها</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showForm ? 'بستن فرم' : 'ایجاد دوره جدید'}
      </button>

      {/* Form to add or edit a course */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-[#f9f9f9] dark:bg-gray-800 p-6 rounded shadow-md">
          {/* Form fields */}
          <div>
            <label className="block text-sm font-bold mb-1">عنوان دوره</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">توضیحات دوره</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">قیمت دوره (تومان)</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <label className="block text-sm font-bold mb-1">عکس پیش نمایش:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border rounded" />
            {formData.previewImage && (
              <div className="mt-3">
                <p>پیش نمایش:</p>
                <img src={URL.createObjectURL(formData.previewImage)} alt="preview" className="w-32 h-32 rounded object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">فایل‌های دوره</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

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

                <button
                  onClick={() => handleEdit(index)}
                  className="mt-2 text-white py-1.5 px-2.5 rounded bg-orange-400 hover:bg-orange-500"
                >
                  <FiEdit className='w-4 h-4'/>
                </button>
              </div>
            ))
          ) : (
            <p className='text-center dark:text-gray-200'>هیچ دوره‌ای اضافه نشده است.</p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, action: '', course: null })}
        title={modalState.action === 'edit' ? 'آیا مطمئن هستید که می‌خواهید این دوره را ویرایش کنید؟' : 'آیا مطمئن هستید که می‌خواهید این دوره را اضافه کنید؟'}
        onConfirmClick={handleModalConfirm}
      />
    </div>
  );
};

export default Courses;

