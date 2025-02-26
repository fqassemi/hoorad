'use client'
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";

const Sidebar = ({ titles = [], ids = [], date = [] }) => {
    const pathname = usePathname(); 
    const [isReversed, setIsReversed] = useState(false);

    const orderedTitles = isReversed ? [...titles].reverse() : titles;
    const orderedIDs = isReversed ? [...ids].reverse() : ids;
    const orderedDates = isReversed ? [...date].reverse() : date;

    const toggleSortOrder = () => {
        setIsReversed(!isReversed);
    };

    return (
        <div className='py-4 bg-gray-50 shadow-lg h-screen left-0 z-10'>
            <button
                onClick={toggleSortOrder}
                className='flex px-4 py-1.5 text-sm hover:text-orange-500 font-medium text-gray-700 hover:bg-gray-200 rounded-lg mx-2'
            >
                {isReversed ? <FaSortAmountUp size={20} /> : <FaSortAmountDown size={20} />} 
            </button>
            <ul>
                {orderedTitles.map((title, index) => {
                    const id = orderedIDs[index];
                    if (!id) return null;
                    const currentId = pathname.split('/').pop() || '';
                    const isActive = currentId === id; 

                    return (
                        <li key={id}>
                            <Link
                                href={`${id}`} 
                                className={`block px-4 py-2.5 text-base font-medium transition-all duration-200
                                    ${isActive
                                        ? ''
                                        : 'text-gray-700 hover:bg-gray-200'
                                    }
                                    rounded-lg mx-2`}
                            >
                                <div className='flex gap-1 flex-col'>
                                    <p className={`${isActive ? 'text-orange-500' : 'text-gray-700'}`}>{title}</p>
                                    <span className={'text-gray-400 text-xs'}>
                                        {orderedDates[index]}
                                    </span>
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