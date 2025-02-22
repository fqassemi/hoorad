'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useGetNews from "@/hooks/api/news/useGetNews";
import CircularLoader from "@/components/ui/circular-loader";
import Sidebar from "@/components/layout/news-sidebar";

export default function Event() {
    const params = useParams();
    const router = useRouter();
    const { newsId } = params;

    const { data, isLoading, err } = useGetNews();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [newsItem, setNewsItem] = useState(null);
    const [currentTitle, setCurrentTitle] = useState('');
    const [titles, setTitles] = useState([]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (data) {
            const titlesFromData = data.map(item => item.title);
            setTitles(titlesFromData);

            if (newsId) {
                const filteredNews = data.find(item => item.id === newsId);
                setNewsItem(filteredNews);
                if (filteredNews) {
                    setCurrentTitle(filteredNews.title);
                }
            }
        }
    }, [data, newsId]);

    const handleNext = () => {
        if (data && newsId) {
            const currentIndex = data.findIndex(item => item.id === newsId);
            if (currentIndex < data.length - 1) {
                const nextNewsId = data[currentIndex + 1].id;
                router.push(`/news/${nextNewsId}`);
            }
        }
    };

    const handlePrev = () => {
        if (data && newsId) {
            const currentIndex = data.findIndex(item => item.id === newsId);
            if (currentIndex > 0) {
                const prevNewsId = data[currentIndex - 1].id;
                router.push(`/news/${prevNewsId}`);
            }
        }
    };

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
                className={`fixed h-screen overflow-y-auto bg-white shadow-lg z-20 left-0 transition-transform duration-300 ${
                    isMenuOpen ? 'translate-x-0 w-full' : '-translate-x-full w-64'
                } sm:translate-x-0 sm:w-64`}
            >
                <Sidebar titles={titles} ids={data.map(item => item.id)} />
            </div>

           
            <div className="flex-1 sm:ml-64 ml-0 w-full">
                
                <button
                    onClick={toggleMenu}
                    className="fixed left-4 z-[10] p-2 bg-white text-orange-500 rounded-lg shadow-md sm:hidden top-20"
                >
                    {isMenuOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
                </button>

                    <div className="bg-white rounded-lg shadow-sm max-w-3xl mx-auto mt-4 px-6 py-8">
                        <div className="px-6">
                            <img src="/images/coursePic.jpg" alt="" className="rounded-lg w-full h-64 object-cover" />
                        </div>
                        <h1 className="text-3xl font-bold mt-8 text-gray-900">{newsItem ? newsItem.title : currentTitle}</h1>
                        {newsItem && (
                            <div
                                dangerouslySetInnerHTML={{ __html: newsItem.html }}
                                className="custom-html-content mt-6 text-gray-700 leading-relaxed"
                            />
                        )}
                        <div className="w-full h-[1px] bg-neutral-300 mt-6 mb-3"></div>
                        <div className="text-sm text-gray-600">
                            <p>تاریخ انتشار: {newsItem?.issuedDate}</p>
                            <p>نویسنده: {newsItem?.author}</p>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={handlePrev}
                                disabled={!data || data.findIndex(item => item.id === newsId) === 0}
                                className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiChevronLeft size={20} />
                                <span className="ml-2">قبلی</span>
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!data || data.findIndex(item => item.id === newsId) === data.length - 1}
                                className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300  disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="mr-2">بعدی</span>
                                <FiChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
