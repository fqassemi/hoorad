'use client';

import { useEffect, useState } from 'react';
import ConfirmModal from "@/components/templates/confirm-modal";
import { FiEdit, FiX } from 'react-icons/fi';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '@/hooks/api/blogApi';

import DraftEditor from './draft';

export default function Blogs() {
  const [showForm, setShowForm] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    plainText: '',
    html: '',
    previewImage: null,
    issuedDate: dateTime,
  });
  const [blogs, setBlogs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: '',
    blog: null,
  });

  useEffect(() => {
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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchBlogs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'includeConclusion') {
      setFormData({
        ...formData,
        includeConclusion: checked,
        conclusion: checked ? formData.conclusion : '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  // const handleSubtitleChange = (index, key, value) => {
  //   const updatedSubtitles = [...formData.subtitles];
  //   updatedSubtitles[index] = {
  //     ...updatedSubtitles[index],
  //     [key]: value,
  //   };
  //   setFormData({ ...formData, subtitles: updatedSubtitles });
  // };

  // const handleAddSubtitle = () => {
  //   setFormData({
  //     ...formData,
  //     subtitles: [...formData.subtitles, { subtitle: '', explanation: '' }],
  //   });
  // };

  // const handleRemoveSubtitle = (index) => {
  //   const updatedSubtitles = [...formData.subtitles];
  //   updatedSubtitles.splice(index, 1);
  //   setFormData({ ...formData, subtitles: updatedSubtitles });
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      previewImage: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBlog = { ...formData, issuedDate: dateTime };

    const action = editIndex !== null ? 'edit' : 'add';

    openConfirmModal(action, newBlog);
  };

  const openConfirmModal = (action, blog) => {
    setModalState({
      isOpen: true,
      action,
      blog,
    });
  };

  const handleModalConfirm = async () => {
    const { action, blog } = modalState;
  
    try {
      if (action === 'edit') {
        const updatedBlog = await updateBlog(blog.id, blog);
        setBlogs((prev) =>
          prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
        );
      } else if (action === 'add') {
        const createdBlog = await createBlog(blog);
        setBlogs((prev) => [...prev, createdBlog]);
      } else if (action === 'delete') {
        await deleteBlog(blog.id); 
        setBlogs((prev) => prev.filter((b) => b.id !== blog.id)); 
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setModalState({ isOpen: false, action: '', blog: null });
    setShowForm(false);
    setFormData({
      id: '',
      title: '',
      plainText: '',
      html: '',
      previewImage: null,
      issuedDate: '',
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const blogToEdit = blogs[index];

    setFormData({
      ...blogToEdit,
      previewImage: null,
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (blogId) => {
    openConfirmModal('delete', { id: blogId });
  };


  return (
    <div>
      <div className="p-6 bg-[#f9f9f9] dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors duration-300 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 tracking-wide">مدیریت مقالات و بلاگ</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:bg-orange-600"
        >
          {showForm ? 'بستن فرم' : 'ایجاد بلاگ جدید'}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-900 transition-all duration-300 p-8 rounded-xl shadow-xl animate-fade-in"
          >
            <div className='flex gap-3 w-full'>
              <div className="relative w-2/3">
                <label
                  htmlFor="blogTitle"
                  className={`absolute text-sm font-semibold transition-all duration-200 
                ${formData.title ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}
                >
                  عنوان اصلی بلاگ
                </label>
                <input
                  id='blogTitle'
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-3 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
              <div className="relative w-1/3">
                <label
                  htmlFor="blogId"
                  className={`absolute text-sm font-semibold transition-all duration-200 
                ${formData.id ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}
                >
                  آیدی بلاگ
                </label>
                <input
                  id='blogId'
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-3 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
            </div>

            <div className="relative w-full">

              <DraftEditor
                onContentChange={(htmlContent, plainText) =>
                  setFormData({ ...formData, html: htmlContent, plainText: plainText })
                }
                initialHtml={formData.html}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">عکس پیش نمایش</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {formData.previewImage && (
                <div className="mt-4">
                  <p className="text-gray-700 dark:text-gray-200">پیش نمایش:</p>
                  <img
                    src={URL.createObjectURL(formData.previewImage)}
                    alt="preview"
                    className="w-32 h-32 rounded-lg shadow-lg object-cover"
                  />
                </div>
              )}
            </div>

            {/* <div>
              <h3 className="text-md font-bold mb-2 text-gray-700 dark:text-gray-200">زیرعنوان‌ها</h3>
              {formData.subtitles.map((subtitle, index) => (
                <div key={index} className="mb-6">
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
                    زیرعنوان {index + 1}
                  </label>
                  <input
                    type="text"
                    value={subtitle.subtitle}
                    onChange={(e) => handleSubtitleChange(index, 'subtitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                  <textarea
                    value={subtitle.explanation}
                    onChange={(e) => handleSubtitleChange(index, 'explanation', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="توضیحات"
                    required
                  ></textarea>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtitle(index)}
                    className="mt-2 text-red-500 text-sm transition-opacity duration-200 hover:opacity-80"
                  >
                    حذف زیرعنوان
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSubtitle}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:bg-orange-600"
              >
                افزودن زیرعنوان جدید
              </button>
            </div> */}

            {/* <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">آیا نتیجه‌گیری داشته باشد؟</label>
              <input
                type="checkbox"
                name="includeConclusion"
                checked={formData.includeConclusion}
                onChange={handleInputChange}
                className="ml-2"
              />
            </div>
            {formData.includeConclusion && (
              <div className='relative w-full'>
                <label
                  htmlFor='blogConclusion'
                  className={`absolute text-sm font-semibold transition-all duration-200 
                ${formData.conclusion ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/4 right-4 translate-y-[-50%] text-gray-400 text-base'}`}>نتیجه‌گیری</label>
                <textarea
                  id='blogConclusion'
                  name="conclusion"
                  value={formData.conclusion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
                ></textarea>
              </div>
            )} */}
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:bg-orange-600"
            >
              {editIndex !== null ? 'ویرایش بلاگ' : 'ایجاد بلاگ'}
            </button>
          </form>
        )}
      </div>


      <div className="bg-[#f9f9f9] dark:bg-gray-800 rounded-md p-6 mt-6">
        <h2 className="text-xl font-bold">بلاگ های اضافه شده</h2>
        <div className="mt-4 space-y-4">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <div key={blog.id} className="bg-white dark:bg-gray-800 p-4 border dark:border-white rounded flex justify-between items-center shadow-md dark:shadow-gray-700">
                <div className="flex flex-1 flex-col md:flex-row justify-between items-center">
                  {blog.previewImage && <img src={blog.previewImage} alt="preview" className='rounded mb-5 md:mb-0 w-full md:w-30 h-64 md:h-30' />}
                  <div className='mx-3'>
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <p className='text-sm text-gray-400'>{blog.plainText}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{blog.issuedDate}</p>
                  </div>
                  <div className='flex'>
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-orange-500 hover:text-orange-600 mx-1"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500 ring-1 ring-red-600 rounded hover:text-red-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[#0e0e0e] dark:text-gray-200">هیچ بلاگی اضافه نشده است.</p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, action: '', blog: null })}
        title={
          modalState.action === 'edit'
            ? 'آیا مطمئن هستید که می‌خواهید این بلاگ را ویرایش کنید؟'
            : modalState.action === 'add'
              ? 'آیا مطمئن هستید که می‌خواهید این بلاگ را اضافه کنید؟'
              : 'آیا مطمئن هستید که می‌خواهید این بلاگ را حذف کنید؟'
        }
        onConfirmClick={handleModalConfirm}
      />
    </div>
  );
}