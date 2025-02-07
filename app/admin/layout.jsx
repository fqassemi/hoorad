'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/layout/admin-sidebar';
import AdminHeader from '@/components/layout/admin-header';

const AdminLayout = ({ children }) => {
  const [isOpen, setOpen] = useState(false);

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