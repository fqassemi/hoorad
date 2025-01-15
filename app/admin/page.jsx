"use client";

import { useEffect, useState } from 'react';


const Dashboard = () => {

    const [entryTime, setEntryTime] = useState('');
    useEffect(() => {
        const storedLoginTime = localStorage.getItem("loginTime");


        if (storedLoginTime) {
            setEntryTime(storedLoginTime);
        } else {

            const currentTime = new Intl.DateTimeFormat('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hourCycle: 'h23',
            }).format(new Date());

            localStorage.setItem("loginTime", currentTime);
            setEntryTime(currentTime);
        }
    }, []);


    return (
        <div className='flex-1'>
            <h2 className="text-2xl font-bold">خوش آمدید</h2>
            <p className='text-gray-400 text-sm'>شما می توانید محتوای سایت را مدیریت و ویرایش کنید.</p>
            <p className='text-gray-400 text-sm'>ساعت ورود شما:{entryTime}</p>
        </div>
    );
};

export default Dashboard;

