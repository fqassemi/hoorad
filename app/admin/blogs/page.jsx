'use client';
import { useEffect, useState } from 'react';
//Icons
import { FiEdit, FiX } from 'react-icons/fi';
//Apis
import useGetBlogs from '@/hooks/api/blog/useGetBlog';
import usePostBlog from '@/hooks/api/blog/usePostBlog';
import usePatchBlog from '@/hooks/api/blog/usePatchBlog';
import useDeleteBlog from '@/hooks/api/blog/useDeleteBlog';
//components
import CircularLoader from '@/components/ui/circular-loader';
import ConfirmModal from "@/components/templates/confirm-modal";
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
    author: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: '',
    blog: null,
  });

  const { data, error, isLoading, mutate } = useGetBlogs();

  const { trigger: createBlogTrigger, isLoading: isCreating } = usePostBlog();
  const { trigger: updateBlogTrigger, isLoading: isUpdating } = usePatchBlog();
  const { trigger: deleteBlogTrigger, isLoading: isDeleting } = useDeleteBlog();

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
      blog: { ...blog }, 
    });
  };

  const handleModalConfirm = async () => {
    const { action, blog } = modalState;
  
    try {
      if (action === 'edit') {
        await updateBlogTrigger({ blogId: blog.id, updatedBlog: blog });
        const updatedBlogs = data.map((b) => (b.id === blog.id ? blog : b));
        mutate(updatedBlogs, false); 
      } else if (action === 'add') {
        await createBlogTrigger({ blogId: blog.id, newBlog: blog });
        const updatedBlogs = [...data, blog];
        mutate(updatedBlogs, false); 
      } else if (action === 'delete') {
        await deleteBlogTrigger({ id: blog.id });
        const updatedBlogs = data.filter((b) => b.id !== blog.id);
        mutate(updatedBlogs, false);
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
      author: '',
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const blogToEdit = data[index];
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


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader className='text-orange-500' />
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 bg-[#f9f9f9] dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors duration-300 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 tracking-wide">مدیریت مقالات و بلاگ</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white text-sm sm:text-base px-3 sm:px-6 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:bg-orange-600"
        >
          {showForm ? 'بستن فرم' : 'ایجاد بلاگ جدید'}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-900 transition-all duration-300 p-8 rounded-xl shadow-xl animate-fade-in"
          >
            <div className='flex gap-3 w-full flex-col sm:flex-row'>
              <div className="relative sm:w-2/3 w-full">
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
              <div className="relative sm:w-1/3 w-full">
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
              <div className="relative sm:w-1/3 w-full">
                <label
                  htmlFor="blogAuthor"
                  className={`absolute text-sm font-semibold transition-all duration-200 
                ${formData.author ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}
                >
                  نویسنده
                </label>
                <input
                  id='blogAuthor'
                  type="text"
                  name="author"
                  value={formData.author}
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
          {data?.length > 0 ? (
            data?.map((blog, index) => {
              return (<div key={blog.id} className="bg-white dark:bg-gray-800 p-4 border  rounded flex justify-between items-center shadow-md dark:shadow-gray-700">
                <div className="flex flex-1 flex-col md:flex-row items-center justify-between">
                  <div className='flex items-center'>
                    {blog.previewImage && <img src={blog.previewImage} alt="preview" className='rounded mb-5 md:mb-0 w-full md:w-30 h-64 md:h-30' />}
                    <div className='mx-3'>
                      <h3 className="text-lg font-semibold my-1">{blog.title}</h3>
                      <p className='text-sm text-gray-400'>
                        {blog?.plainText.split(' ').length > 20
                          ? blog?.plainText.split(' ').slice(0, 20).join(' ') + '...'
                          : blog.plainText}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">تاریخ انتشار:{blog.issuedDate} | نویسنده: {blog.author}</p>
                    </div>
                  </div>
                  <div className='flex mt-3 sm:mt-0'>
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-orange-500 hover:text-orange-600 mx-1"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500 ring-1 ring-red-600 rounded hover:text-red-600 hover:bg-red-200"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>)
            })
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