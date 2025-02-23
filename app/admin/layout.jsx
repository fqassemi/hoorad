'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

//components
import AdminSidebar from '@/components/layout/admin-sidebar';
import AdminHeader from '@/components/layout/admin-header';
import ConnectionStatus from '@/components/ui/connectionStatus';
import CircularLoader from '@/components/ui/circular-loader';

//Api
import useGetAdmin from '@/hooks/api/isAdmin';


const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const { data, isLoading } = useGetAdmin();

  useEffect(() => {
    if (data === false) {
      router.push('/login');
    }
  }, [data, router]);

  if (isLoading || data === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader className='text-orange-500' />
      </div>
    );
  }

  if (data === true) {
    return (
      <div className="flex">
        <ConnectionStatus />
        <AdminSidebar isOpen={isOpen} setOpen={setOpen} />
        <div className="flex-1">
          <AdminHeader isOpen={isOpen} setOpen={setOpen} />
          <main className="p-2 m-0 sm:mr-52 sm:p-4 bg-[#ff9f9]">{children}</main>
        </div>
      </div>
    );
  }
  return null;
};

export default AdminLayout;