'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmModal from '../templates/confirm-modal';
import { FaSignOutAlt } from 'react-icons/fa';
import { FiMenu, FiX } from "react-icons/fi";



const AdminHeader = ({ isOpen, setOpen }) => {
    const [dateTime, setDateTime] = useState('');
    const [modalState, setModalState] = useState(false);

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDateTime = new Intl.DateTimeFormat('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hourCycle: 'h23',
            }).format(now);

            setDateTime(formattedDateTime);
        };

        updateDateTime();

        const interval = setInterval(updateDateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    const exitHandler = () => {
        setModalState(true);
    };

    const handleModalConfirm = () => {
        setModalState(false);
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <>
            <div className="flex justify-between bg-white dark:bg-[#4e4d4d] dark:shadow-[#646464] shadow-md p-4 m-0 sm:mr-52">
                <h1 className="text-xl font-bold ">داشبورد</h1>
                <div className="flex items-center">
                    <p className="text-gray-700 text-xs mx-3 dark:text-gray-200">{dateTime}</p>
                    <Button
                        className="text-sm py-1 px-2.5 rounded border border-gray-300 hover:border-red-600 text-gray-400 hover:text-red-600"
                        variant="main"
                        type="submit"
                        onClick={() => exitHandler()}
                    >
                        <FaSignOutAlt className="w-4 h-4 hover:text-red-600" />
                    </Button>
                    <Button
                        className="text-sm py-1 px-2.5 mx-1 z-50 rounded border border-gray-300 hover:border-red-600 text-gray-400 hover:text-red-600 sm:hidden block"
                        variant="main"
                        type="submit"
                        onClick={() => setOpen(!isOpen)}
                    >
                        {isOpen ? <FiX /> : <FiMenu />}
                    </Button>
                </div>
            </div>
            <ConfirmModal
                open={modalState}
                onClose={() => setModalState(false)}
                title={'آیا مطمئن هستید که می‌خواهید خارج شوید؟'}
                onConfirmClick={handleModalConfirm}
            />
        </>
    );
};

export default AdminHeader;

