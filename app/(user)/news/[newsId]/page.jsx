'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import useGetNews from "@/hooks/api/news/useGetNews";
import CircularLoader from "@/components/ui/circular-loader";
import Link from "next/link";

export default function Event() {
    const params = useParams();
    const { newsId } = params;

    const { data, isLoading, err } = useGetNews();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [newsItem, setNewsItem] = useState(null);
    const [currentTitle, setCurrentTitle] = useState('');
    const [titles, setTitles] = useState([]); // State to store titles from data
    const [isHeaderFixed, setIsHeaderFixed] = useState(false); // State to control fixed header

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleTitleClick = (title) => {
        setCurrentTitle(title);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        if (data) {
            // Extract titles from the data
            const titlesFromData = data.map(item => item.title);
            setTitles(titlesFromData);

            // Find the current news item if newsId is available
            if (newsId) {
                const filteredNews = data.find(item => item.id === newsId);
                setNewsItem(filteredNews);
                if (filteredNews) {
                    setCurrentTitle(filteredNews.title);
                }
            }
        }
    }, [data, newsId]);

    useEffect(() => {
        const handleScroll = () => {
            // Check if the user has scrolled more than 20 pixels
            if (window.scrollY > 20) {
                setIsHeaderFixed(true);
            } else {
                setIsHeaderFixed(false);
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularLoader className='text-orange-500' />
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <header
                className={`bg-orange-400 shadow-md p-4 w-full transition-all duration-1000 ${isHeaderFixed ? 'fixed top-16' : 'relative'}`}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <p className="text-xl font-semibold text-white">{currentTitle}</p>
                    <button
                        onClick={toggleMenu}
                        className="p-2 text-white hover:text-black focus:outline-none"
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
                <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${isMenuOpen ? "max-h-96" : "max-h-0"
                        }`}
                >
                    <ul className="space-y-2 p-4 bg-orange-400 border-t border-orange-300">
                        {data?.map((item) => (
                            <li
                                key={item.id}
                                className="cursor-pointer text-white hover:text-black"
                            >
                                <Link href={`/news/${item.id}`}>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>
            <main className={`pt-${isHeaderFixed ? '20' : '0'}`}>
                <div className="bg-white rounded max-w-3xl mx-auto mt-4 px-10">
                    <div className="px-10">
                        <img src="/images/coursePic.jpg" alt="" className="rounded pt-6" />
                    </div>
                    <h1 className="text-2xl font-bold mt-8">{newsItem ? newsItem.title : currentTitle}</h1>
                    {newsItem && (
                        <div dangerouslySetInnerHTML={{ __html: newsItem.html }} className="custom-html-content" />
                    )}
                    <div className="w-full h-[1px] bg-neutral-300 mt-6 mb-3"></div>
                    <div className="">
                        <p className="text-gray-700 text-sm">تاریخ انتشار: {newsItem?.issuedDate}</p>
                        <p className="text-gray-700 text-sm"> نویسنده: {newsItem?.author}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}