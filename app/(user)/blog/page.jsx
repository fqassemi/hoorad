"use client"
// import { getBlogs } from '@/hooks/api/blogApi';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import CircularLoader from '@/components/ui/circular-loader';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogData = await getBlogs();
        const reversedBlogs = blogData.reverse();
        setBlogs(reversedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const loadMoreBlogs = () => {
    setVisibleBlogs(blogs.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader className='text-orange-500' />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop={true}
      >
        {blogs.slice(0, 3).map((blog) => (
          <SwiperSlide key={blog.id}>
            <div className="latest-blog">
              <div className="bg-white rounded-lg flex flex-col lg:flex-row justify-between">
                <div className="flex flex-col justify-center flex-grow p-6 lg:ml-6 lg:p-0">
                  <Link href={`/blog/${blog.id}`}>
                    <h1 className="font-semibold text-2xl lg:text-4xl mb-3 text-center lg:text-right leading-tight lg:leading-snug">
                      <span className='hover:border-b-2 hover:border-orange-500 cursor-pointer'>
                        {blog.title}
                      </span>
                    </h1>
                  </Link>
                  <p className="text-gray-700 mt-2 text-justify leading-7">
                    {blog.plainText.split(' ').length > 20
                      ? blog.plainText.split(' ').slice(0, 30).join(' ') + '...'
                      : blog.plainText}
                  </p>
                  <p className="text-sm text-gray-500 mt-4 text-center lg:text-right">
                    <strong>نویسنده:</strong> {blog.author} • <strong>تاریخ انتشار:</strong> {blog.issuedDate}
                  </p>
                </div>
                <div className="w-full lg:w-[450px] flex-shrink-0 mt-6 lg:mt-0">
                  <img
                    src={blog.previewImage}
                    alt="preview"
                    className="w-full h-auto lg:h-full object-cover rounded"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='mt-8'>
        <h2 className="text-2xl font-bold mb-4">بلاگ های بیشتر</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length > 1 ? (
            blogs.slice(1, visibleBlogs).map((blog) => {
              
              const isTitleLong = (blog.title.split(' ').slice(0, 10)) > 6;
              const wordLimit = isTitleLong ? 15 : 20;

              return (
                <Link href={`blog/${blog.id}`} key={blog.id}>
                  <div className="blog-card bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-150">
                    <img src={blog.previewImage} alt={blog.title} className='rounded' />
                    <h3 className="text-lg font-semibold my-4 truncate">
                      <span className='hover:border-b-2 hover:border-orange-500'>{blog.title}</span>
                    </h3>
                    <p className="text-gray-700 text-justify">
                      {blog.plainText.split(' ').length > wordLimit
                        ? blog.plainText.split(' ').slice(0, wordLimit).join(' ') + '...'
                        : blog.plainText}
                    </p>
                    <p className="text-xs text-gray-500 mt-4">
                      {blog.author} • {blog.issuedDate}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-gray-500">No other blogs available.</p>
          )}
        </div>

        {blogs.length > visibleBlogs && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMoreBlogs}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-150"
            >
              بلاگ بیشتر
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
