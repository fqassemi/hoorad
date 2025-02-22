'use client'
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

const Sidebar = ({ titles, ids }) => {
    const router = useRouter(); 

    return (
        <div
            className='py-6 bg-gray-50 shadow-lg h-screen left-0 z-50'>
            <ul>
                {titles.map((title, index) => {
                    const isActive = router.asPath === `/${ids[index]}`; 
                    return (
                        <li key={ids[index]}>
                            <Link
                                href={`${ids[index]}`}
                                className={`block px-4 py-2.5 text-base font-medium transition-all duration-200
                  ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                    }
                  rounded-lg mx-2`}
                            >
                                <div className='flex gap-1 items-center'>
                                    <span className='text-sm text-gray-400'>{index}</span> <div className='w-[1px] h-5 bg-orange-300'></div> <span className='text-gray-700'>{title}</span>
                                </div>
                            </Link>
                            <div className='w-full bg-gray-200 h-[0.5px] my-1.5 px-2'></div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Sidebar;