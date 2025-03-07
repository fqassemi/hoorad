"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useGetBlogs from '@/hooks/api/blog/useGetBlog';
import CircularLoader from "@/components/ui/circular-loader";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Link from 'next/link';

export default function BlogPost() {
    const { blogId } = useParams();
    const router = useRouter();
    const { data: blogs, loading } = useGetBlogs();
    const [blog, setBlog] = useState(null);
    const [randomBlogs, setRandomBlogs] = useState([]);

    useEffect(() => {
        if (blogs && blogs.length > 0) {
            const currentBlog = blogs?.find((b) => b.id === blogId);
            setBlog(currentBlog);

            const randomBlogs = getRandomBlogs(blogs, 3);
            setRandomBlogs(randomBlogs);
        }
    }, [blogs, blogId]);

    const getRandomBlogs = (blogsArray, num) => {
        const filteredBlogs = blogsArray.filter((b) => b.id !== blogId); // Exclude current blog
        const shuffled = [...filteredBlogs].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, num);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularLoader className='text-orange-500' />
            </div>
        );
    }

    const currentIndex = blogs?.findIndex((b) => b.id === blogId);

    const prevBlogId = currentIndex > 0 ? blogs[currentIndex - 1].id : null;
    const nextBlogId = currentIndex < blogs?.length - 1 ? blogs[currentIndex + 1].id : null;

    const goToPrevBlog = () => prevBlogId && router.push(`/blogs/${prevBlogId}`);
    const goToNextBlog = () => nextBlogId && router.push(`/blogs/${nextBlogId}`);

    const decodeHtml = decodeURIComponent(blog?.html || "");

    return (
        <div>
            <div className="max-w-2xl mx-auto mt-8">
                <div className="flex items-center mb-6">
                    <button
                        onClick={goToNextBlog}
                        disabled={!nextBlogId}
                        className={`flex items-center p-1 border rounded-lg transition ${nextBlogId ? "hover:bg-orange-100" : "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        <FiChevronRight size={20} className="text-orange-500" />
                    </button>
                    <button
                        onClick={goToPrevBlog}
                        disabled={!prevBlogId}
                        className={`flex items-center mx-2 p-1 border rounded-lg transition ${prevBlogId ? "hover:bg-orange-100" : "opacity-50 cursor-not-allowed"}`}
                    >
                        <FiChevronLeft size={20} className="text-orange-500" />
                    </button>
                </div>

                <h1 className="text-2xl font-bold">{blog?.title}</h1>
                <img src={blog?.previewImage} alt="" className="rounded my-4 w-full h-64 object-contain" />
                
                <div dangerouslySetInnerHTML={{ __html: decodeHtml }} className="custom-html-content" />
                <div className="w-full h-[1px] bg-neutral-300 mt-6 mb-3"></div>
                <div className="">
                    <p className="text-gray-700 text-sm">تاریخ انتشار: {blog?.issuedDate}</p>
                    <p className="text-gray-700 text-sm"> نویسنده: {blog?.author}</p>
                </div>
            </div>
            <div className=" mx-16 lg:mx-36 mt-12">
                <h2 className="text-2xl font-bold mb-4">بلاگ های بیشتر</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
                    {randomBlogs?.map((randomBlog) => (
                        <Link href={`/blogs/${randomBlog.id}`} key={randomBlog.id}>
                            <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col h-full">
                                <img
                                    src={randomBlog.previewImage}
                                    alt={randomBlog.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4 flex flex-col flex-grow">
                                    <h2 className="text-lg font-semibold truncate hover:text-orange-500">{randomBlog.title}</h2>
                                    <p className="mt-4 mb-6 text-sm text-gray-600 flex-grow leading-6 text-justify">{randomBlog.plainText.slice(0, 100)}...</p>
                                    <button className="text-orange-500 hover:underline text-sm">
                                        بیشتر بخوانید
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
