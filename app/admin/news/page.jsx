'use client';
import { useEffect, useState } from 'react';
//Icons
import { FiEdit, FiX } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
//Apis
import useGetNews from '@/hooks/api/news/useGetNews';
import usePostNews from '@/hooks/api/news/usePostNews';
import usePatchNews from '@/hooks/api/news/usePatchNews';
import useDeleteNews from '@/hooks/api/news/useDeleteNews';
import usePostImage from '@/hooks/api/image/usePostImg';
import useGetImage from '@/hooks/api/image/useGetImg';
import useDeleteImage from '@/hooks/api/image/useDeleteImg';
//components
import CircularLoader from '@/components/ui/circular-loader';
import ConfirmModal from "@/components/templates/confirm-modal";
import DraftEditor from './draft';

import { motion, AnimatePresence } from 'framer-motion';


export default function News() {
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

  const { data, error, isLoading, mutate } = useGetNews();

  const { trigger: createNewsTrigger, isLoading: isCreating } = usePostNews();
  const { trigger: updateNewsTrigger, isLoading: isUpdating } = usePatchNews();
  const { trigger: deleteNewsTrigger, isLoading: isDeleting } = useDeleteNews();
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
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageUpload = async () => {
    if (!formData.previewImage || typeof formData.previewImage === 'string') {
      return;
    }

    try {
      const formDataImage = new FormData();
      formDataImage.append('image', formData.previewImage);
      const imageResponse = await postImageTrigger({
        imageId: `news-preview-${formData.id}`,
        newImage: formDataImage,
      });

      if (imageResponse && imageResponse.image_url) {
        setFormData((prevData) => ({
          ...prevData,
          previewImage: baseURL + imageResponse.image_url.replace(/^\//, ''),
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
    const newNews = {
      ...formData,
      issuedDate: dateTime,
      createdAt: new Date().toISOString(), 
    };
    const action = editIndex !== null ? 'edit' : 'add';
    openConfirmModal(action, newNews);
  };

  const openConfirmModal = (action, news) => {
    setModalState({
      isOpen: true,
      action,
      news: { ...news },
    });
  };

  const handleModalConfirm = async () => {
    const { action, news } = modalState;

    try {
      if (action === 'edit') {
        await updateNewsTrigger({ id: news.id, updatedNews: news });
        const updatedNews = data.map((n) => (n.id === news.id ? news : n));
        mutate(updatedNews, false);
      } else if (action === 'add') {
        await createNewsTrigger({ id: news.id, newNews: news });
        const updatedNews = [...data, news];
        mutate(updatedNews, false);
      } else if (action === 'delete') {
        await deleteNewsTrigger({ id: news.id });
        const updatedNews = data.filter((n) => n.id !== news.id);
        mutate(updatedNews, false);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setModalState({ isOpen: false, action: '', news: null });
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
    const newsToEdit = data[index];
    setFormData({
      ...newsToEdit,
      previewImage: newsToEdit.previewImage,
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (newsId) => {
    openConfirmModal('delete', { id: newsId });
  };

  
  const handleDeleteImage = async (image) => {
    if (!image) return;

    try {
      
      if (typeof image === 'string') {
        const imageId = image.split('/').pop(); 
        console.log(imageId);
        
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

  if (error) {
    return (
      <div className='text-red-500'>
        something went wrong...
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader className='text-orange-500' />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-gray-900 text-gray-700 dark:text-gray-200 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">مدیریت اخبار</h1>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showForm ? 'بستن فرم' : 'ایجاد خبر جدید'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="relative">
                <label
                  htmlFor="newsTitle"
                  className={`absolute text-sm font-semibold transition-all duration-200 
                    ${formData.title ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}
                >
                  عنوان اصلی خبر
                </label>
                <input
                  id="newsTitle"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="newsId"
                  className={`absolute text-sm font-semibold transition-all duration-200 
      ${formData.id ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}
                >
                  آیدی خبر
                </label>
                <input
                  id="newsId"
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="newsAuthor"
                  className={`absolute text-sm font-semibold transition-all duration-200 
                    ${formData.author ? 'top-0 right-4 text-orange-400 text-xs' : 'top-1/2 right-4 translate-y-[-50%] text-gray-400 text-base'}`}
                >
                  نویسنده
                </label>
                <input
                  id="newsAuthor"
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <DraftEditor
                onContentChange={(htmlContent, plainText) =>
                  setFormData({ ...formData, html: htmlContent, plainText: plainText })
                }
                initialHtml={formData.html}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">عکس پیش نمایش</label>
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
              type="submit"
              className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {editIndex !== null ? 'ویرایش خبر' : 'ایجاد خبر'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>


      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">اخبار اضافه شده</h2>
        <div className="space-y-4">
          {data?.length > 0 ? (
            data?.map((news, index) => (
              <motion.div
                key={news.title}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="flex flex-col md:flex-row items-start space-x-4 gap-x-2">
                    {news.previewImage && (
                      <img
                        src={news.previewImage}
                        alt="preview"
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{news.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {news.plainText.split(' ').slice(0, 20).join(' ')}...
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-300 mt-2">
                        تاریخ انتشار: {news.issuedDate} | نویسنده: {news.author}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <motion.button
                      onClick={() => handleEdit(index)}
                      className="text-orange-500 hover:text-orange-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiEdit size={20} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(news.id)}
                      className="text-red-500 hover:text-red-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiX size={28} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">هیچ خبری اضافه نشده است.</p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, action: '', news: null })}
        title={
          modalState.action === 'edit'
            ? 'آیا مطمئن هستید که می‌خواهید این خبر را ویرایش کنید؟'
            : modalState.action === 'add'
              ? 'آیا مطمئن هستید که می‌خواهید این خبر را اضافه کنید؟'
              : 'آیا مطمئن هستید که می‌خواهید این خبر را حذف کنید؟'
        }
        onConfirmClick={handleModalConfirm}
      />
    </div>
  );
}