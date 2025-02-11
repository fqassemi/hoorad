'use client';
import { useState, useEffect } from 'react';
import { FiWifiOff } from 'react-icons/fi';

const ConnectionStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`fixed z-50 top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-transform duration-500 ${
        isOffline ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      }`}
    >
      <FiWifiOff className="w-5 h-5" />
      <span>شما آفلاین هستید</span>
    </div>
  );
};

export default ConnectionStatus;
