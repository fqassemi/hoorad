'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdHome } from 'react-icons/md';
import { FiBookOpen, FiUsers, FiFileText, FiGrid } from "react-icons/fi";
import { FaMoon, FaSun } from 'react-icons/fa'
import { useState, useEffect } from 'react';

export default function AdminSidebar({ isOpen }) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const isActive = (path) => {
    if (pathname === '/') return path === '/admin'; // Default to '/admin' if the path is root
    return pathname === path;
  };

  return (
    <div
      className={`h-screen w-full fixed bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-xl rounded-s-none sm:w-52 transition-all duration-1000  ${isOpen ? 'left-0' : 'left-full'
        } sm:right-0`}
    >
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FiGrid className="h-6 w-6 mx-1 text-orange-500" />
        پنل ادمین
      </h2>
      <ul>
        <li>
          <Link href="/admin">
            <div
              className={`block p-2 rounded transition-all ease-in-out ${isActive('/admin') ? 'text-orange-500 font-semibold' : 'hover:text-orange-600'
                }`}
            >
              <div className="flex items-center">
                <MdHome className="h-6 w-6" />
                <span className="text-base mx-1">صفحه اصلی</span>
              </div>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/admin/courses">
            <div
              className={`block p-2 rounded transition-all ease-in-out ${isActive('/admin/courses') ? 'text-orange-500 font-semibold' : 'hover:text-orange-600'
                }`}
            >
              <div className="flex items-center">
                <FiBookOpen className="h-5 w-5" />
                <span className="text-base mx-1">مدیریت دوره‌ها</span>
              </div>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/admin/users">
            <div
              className={`block p-2 rounded transition-all ease-in-out ${isActive('/admin/users') ? 'text-orange-500 font-semibold' : 'hover:text-orange-600'
                }`}
            >
              <div className="flex items-center">
                <FiUsers className="h-5 w-5" />
                <span className="text-base mx-1">مدیریت کاربران</span>
              </div>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/admin/blogs">
            <div
              className={`block p-2 rounded transition-all ease-in-out ${isActive('/admin/blogs') ? 'text-orange-500 font-semibold' : 'hover:text-orange-600'
                }`}
            >
              <div className="flex items-center">
                <FiFileText className="h-6 w-6" />
                <span className="text-base mx-1">مقالات و وبلاگ</span>
              </div>
            </div>
          </Link>
        </li>
      </ul>
      <div className="mt-4">
        <button
          onClick={toggleDarkMode}
          className="w-full p-2 text-sm font-medium bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-all"
        >
          {darkMode ? (
            <span>
              <FaMoon className="inline-block mr-2" /> حالت تاریک
            </span>
          ) : (
            <span>
              <FaSun className="inline-block mr-2 text-orange-400" /> حالت روشن
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
