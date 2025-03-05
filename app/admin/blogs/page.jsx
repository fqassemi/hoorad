'use client';
import { useEffect, useState } from 'react';
//Icons
import { FiEdit, FiX } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
//Apis
import useGetBlogs from '@/hooks/api/blog/useGetBlog';
import usePostBlog from '@/hooks/api/blog/usePostBlog';
import usePatchBlog from '@/hooks/api/blog/usePatchBlog';
import useDeleteBlog from '@/hooks/api/blog/useDeleteBlog';
import usePostImage from '@/hooks/api/image/usePostImg';
import useGetImage from '@/hooks/api/image/useGetImg';
import useDeleteImage from '@/hooks/api/image/useDeleteImg';
//components
import CircularLoader from '@/components/ui/circular-loader';
import ConfirmModal from "@/components/templates/confirm-modal";
import DraftEditor from '../news/draft';
import { motion } from 'framer-motion';

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
  const [imageId, setImageId] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: '',
    blog: null,
  });

  const { data, isLoading, mutate } = useGetBlogs();

  const { trigger: createBlogTrigger } = usePostBlog();
  const { trigger: updateBlogTrigger } = usePatchBlog();
  const { trigger: deleteBlogTrigger } = useDeleteBlog();
  const { trigger: postImageTrigger, isMutating: uploading } = usePostImage();
  const { data: img } = useGetImage(imageId);
  const { trigger: deleteImageTrigger } = useDeleteImage();

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

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


  const handleImageUpload = async () => {
    if (!formData.previewImage || typeof formData.previewImage === 'string') {
      return;
    }

    try {
      const formDataImage = new FormData();
      formDataImage.append('image', formData.previewImage);
      const imageResponse = await postImageTrigger({
        imageId: `blog-preview-${formData.id}`,
        newImage: formDataImage,
      });

      if (imageResponse && imageResponse.image_url) {
        setFormData((prevData) => ({
          ...prevData,
          previewImage: baseURL + imageResponse.image_url,
        }));
        setImageId(imageResponse.image_id);
      } else {
        throw new Error('Image upload failed: No URL returned');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
      previewImage: formData.previewImage,
      issuedDate: '',
      author: '',
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const blogToEdit = data[index];
    setFormData({
      ...blogToEdit,
      previewImage: blogToEdit.previewImage,
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (blogId) => {
    openConfirmModal('delete', { id: blogId });
  };

  const handleDeleteImage = async (image) => {
    if (!image) return;

    try {
      
      if (typeof image === 'string') {
        const imageId = image.split('/').pop();         
        await deleteImageTrigger({ id: imageId });
      }
      setFormData((prevData) => ({
        ...prevData,
        previewImage: null,
      }));

    } catch (error) {
      console.error('Error deleting image:', error);
    }
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
    <div>
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 transition-colors duration-300 rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 tracking-wide text-gray-800 dark:text-gray-100">مدیریت مقالات و بلاگ</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          {showForm ? 'بستن فرم' : 'ایجاد بلاگ جدید'}
        </button>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-200 transition-all duration-300 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <label
                  htmlFor="blogTitle"
                  className={`absolute text-sm font-semibold transition-all duration-200 
            ${formData.title ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}
                >
                  عنوان اصلی بلاگ
                </label>
                <input
                  id="blogTitle"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-3 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="blogId"
                  className={`absolute text-sm font-semibold transition-all duration-200 
            ${formData.id ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}
                >
                  آیدی بلاگ
                </label>
                <input
                  id="blogId"
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-3 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="blogAuthor"
                  className={`absolute text-sm font-semibold transition-all duration-200 
            ${formData.author ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}
                >
                  نویسنده
                </label>
                <input
                  id="blogAuthor"
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-3 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
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
              <button
                type="button"
                onClick={() => handleDeleteImage(formData.previewImage)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                حذف عکس
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg"
            >
              {editIndex !== null ? 'ویرایش بلاگ' : 'ایجاد بلاگ'}
            </motion.button>
          </motion.form>
        )}
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-md p-6 mt-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">بلاگ های اضافه شده</h2>
        <div className="mt-4 space-y-4">
          {data?.length > 0 ? (
            data?.map((blog, index) => {
              return (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 border rounded-lg flex justify-between items-center shadow-md dark:shadow-gray-700"
                >
                  <div className="flex flex-1 flex-col md:flex-row items-center justify-between">
                    <div className='flex items-center'>
                      {blog.previewImage && (
                        <motion.img
                          src={blog.previewImage}
                          alt="preview"
                          className='rounded mb-5 md:mb-0 w-full md:w-30 h-64 md:h-30'
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
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
                        className="mt-2 text-white py-1.5 px-2 mx-1 rounded bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
                      >
                        <FiEdit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="mt-2 text-white p-1.5 rounded bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      >
                        <FiX className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-200">هیچ بلاگی اضافه نشده است.</p>
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