"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
#import { Line } from 'react-chartjs-2';
const LineChart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {ssr: false,});
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [entryTime, setEntryTime] = useState('');

  useEffect(() => {

  })

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


  const chartData = {
    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'], // برچسب‌های محور X
    datasets: [
      {
        label: 'بازدید روزانه',
        data: [12, 19, 3, 5, 2, 3], // داده‌ها
        borderColor: 'darkorange', // رنگ خط
        backgroundColor: 'orange', // رنگ پس‌زمینه
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'نمودار بازدید روزانه',
      },
    },
  };

  return (
    <div className="flex-1 mt-4">
      <h2 className="text-2xl font-bold">خوش آمدید</h2>
      <p className="text-gray-400 text-sm">شما می توانید محتوای سایت را مدیریت و ویرایش کنید.</p>
      <p className="text-gray-400 text-sm">ساعت ورود شما: {entryTime}</p>


      <div className="w-full sm:w-3/4 h-full dark:bg-gray-700 rounded mt-6">
        <LineChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
