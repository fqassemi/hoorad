"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Blog({ blogsDetail }) {
  const [blogs, setBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState(7);

  useEffect(() => {
    if (blogsDetail) {
      console.log(blogsDetail);
      
      const reversedBlogs = [...blogsDetail].reverse(); // Reverse the blogs array
      setBlogs(reversedBlogs);
    }
  }, [blogsDetail]);

  const loadMoreBlogs = () => {
    setVisibleBlogs(blogs.length); // Show all blogs
  };

  // If blogsDetail is not provided, show a loading state or a message
  if (!blogsDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className='mt-8'>
        <h2 className="text-3xl font-bold mb-4">بلاگ ها</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.length > 0 ? (
            blogs?.slice(0, visibleBlogs).map((blog) => {
              const isTitleLong = (blog.title.split(' ').slice(0, 10)) > 6;
              const wordLimit = isTitleLong ? 15 : 20;

              return (
                <Link href={`blogs/${blog.id}`} key={blog.id}>
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
            <p className="text-gray-500">No blogs available.</p>
          )}
        </div>

        {blogs?.length > visibleBlogs && (
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