'use client'
import useState from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

const Sidebar = ({ titles, ids }) => {
    const router = useRouter(); 
    const revTitle = [...titles].reverse();
    const revID = [...ids].reverse();
    
    return (
        <div
            className='py-6 bg-gray-50 shadow-lg h-screen left-0 z-10'>
            <ul>
                {revTitle.map((title, index) => {
                    const isActive = router.asPath === `/${revID[index]}`; 
                    return (
                        <li key={revID[index]}>
                            <Link
                                href={`${revID[index]}`}
                                className={`block px-4 py-2.5 text-base font-medium transition-all duration-200
                  ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                    }
                  rounded-lg mx-2`}
                            >
                                <div className='flex gap-1 items-center'>
                                     <span className='text-gray-700'>{title}</span>
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