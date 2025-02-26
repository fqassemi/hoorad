'use client';

import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useGetNews from "@/hooks/api/news/useGetNews";
import CircularLoader from "@/components/ui/circular-loader";
import Sidebar from "@/components/layout/news-sidebar";


export default function Page() {
  const { data, isLoading, err } = useGetNews();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [latestNewsItem, setLatestNewsItem] = useState(null);
  const [titles, setTitles] = useState([]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (data) {
      const titlesFromData = data.map(item => item.title);
      setTitles(titlesFromData);
      const latestItem = data[0];      
      setLatestNewsItem(latestItem);
    }
  }, [data]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader className='text-orange-500' />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <div
        className={`fixed h-screen overflow-y-auto bg-white shadow-lg left-0 transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0 w-full' : '-translate-x-full w-64'
        } sm:translate-x-0 sm:w-64`}
      >
        <Sidebar titles={titles} ids={data.map(item => `news/${item.id}`)} date={data.map(item => item.issuedDate )} />
      </div>

      <div className="flex-1 sm:ml-64 ml-0 w-full">
        
        <button
          onClick={toggleMenu}
          className="fixed left-4 p-2 bg-white z-20 rounded-lg shadow-md sm:hidden top-20 text-orange-500"
        >
          {isMenuOpen ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
        </button>
        
        <main>
          <div className="bg-white rounded-lg shadow-sm max-w-3xl mx-auto mt-4 px-6 py-8">
            <div className="px-6">
              <img
                src={latestNewsItem?.previewImage}
                alt="News Image"
                width={800}
                height={400}
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>


            <h1 className="text-3xl font-bold mt-8 text-gray-900">
              {latestNewsItem?.title}
            </h1>


            {latestNewsItem && (
              <div
                dangerouslySetInnerHTML={{ __html: latestNewsItem.html }}
                className="custom-html-content mt-6 text-gray-700 leading-relaxed"
              />
            )}

            <div className="w-full h-[1px] bg-neutral-300 mt-6 mb-3"></div>
            <div className="text-sm text-gray-600">
              <p>تاریخ انتشار: {latestNewsItem?.issuedDate}</p>
              <p>نویسنده: {latestNewsItem?.author}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}