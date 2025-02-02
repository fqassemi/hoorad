'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/admin-sidebar';
import AdminHeader from '@/components/layout/admin-header';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AdminLayout = ({ children }) => {
  const [isOpen, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const phoneNumber = Cookies.get('phoneNumber');
    const adminPhoneNumbers = ['09394540361', '09123456789', '09128093638'];

    if (!phoneNumber) {
      router.push('/login');
      return;
    }

    if (!adminPhoneNumbers.includes(phoneNumber)) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="flex">
      <AdminSidebar isOpen={isOpen} />
      <div className="flex-1">
        <AdminHeader isOpen={isOpen} setOpen={setOpen} />
        <main className="p-2 m-0 sm:mr-52 sm:p-4 bg-[#ff9f9]">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
