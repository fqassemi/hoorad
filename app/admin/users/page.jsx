'use client';

import React, { useState } from 'react';
import CircularLoader from '@/components/ui/circular-loader';
import ConfirmModal from '@/components/templates/confirm-modal';

import useGetUsers from '@/hooks/api/users/useGetUsers';
import useEditInfo from '@/hooks/api/edit-user/useEditInfo';
import useDeleteUser from '@/hooks/api/users/useDeleteUser';
// import useRegister from '@/hooks/api/login/useRegister';

import { getCookie } from 'cookies-next';

import { FiX, FiEdit } from 'react-icons/fi';



export default function Users() {
  const { data, error, isLoading } = useGetUsers();
  const { trigger: editTrigger, isMutating: editIsMutating } = useEditInfo();
  const { trigger: deleteTrigger, isMutating: deleteIsMutating } = useDeleteUser();
  // const { trigger, isMutating } = useRegister();

  const [filters, setFilters] = useState({ first_name: '', last_name: '', phone_number: '' });

  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: '',
    userToDelete: null,
  });

  const [formError, setFormError] = useState('');
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    courses: []
  });
  const [editUser, setEditUser] = useState({
    first_name: '',
    last_name: '',
  });

  const userInfo = data?.users;
  const userCount = data?.users?.length || 0;

  const matchesFilter = (user) => {
    return (
      (user.first_name?.toLowerCase().includes(filters.first_name.toLowerCase()) || !filters.first_name) &&
      (user.last_name?.toLowerCase().includes(filters.last_name.toLowerCase()) || !filters.last_name) &&
      (user.phone_number?.includes(filters.phone_number) || !filters.phone_number)
    );
  };

  const filteredUsers = userInfo ? userInfo.filter(matchesFilter) : [];

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const validateForm = () => {
    const { first_name, last_name, phone_number } = newUser;

    if (!first_name || !last_name || !phone_number) {
      setFormError('تمام فیلدها الزامی هستند.');
      return false;
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
      setFormError('شماره تلفن باید 11 رقم و با 09 شروع شود.');
      return false;
    }

    setFormError('');
    return true;
  };

  //Add new user as admin (May needed in future)
  const handleAddUser = async () => {
    if (!validateForm()) return;

    try {
      const userPayload = { ...newUser, courses: newUser.courses || [] };

      const response = await trigger(userPayload);

      if (response) {
        setNewUser({ first_name: '', last_name: '', phone_number: '', courses: [] });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to add user:', error.response?.data || error.message);
      setFormError(error.response?.data?.message || 'خطا در افزودن کاربر');
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEdit(true);
  };

  const handleUpdateUser = async () => {
    const accessToken = getCookie('courses_accessToken');
    await editTrigger({ first_name: editUser.first_name, last_name: editUser.last_name, access_token: accessToken });
    setShowEdit(false);
  };

  const handleDeleteUser = (user) => {
    setModalState({
      isOpen: true,
      action: 'delete',
      userToDelete: user,
    });
  };

  const handleModalConfirm = async () => {
    if (modalState.action === 'delete' && modalState.userToDelete) {
      const phoneNumber = modalState.userToDelete.phone_number;
      const accessToken = getCookie('courses_accessToken');
      if (!phoneNumber || !accessToken) return;

      try {
        await deleteTrigger({
          phoneNumber,
          accessToken,
        });
        setModalState({ isOpen: false, action: '', userToDelete: null });
      } catch (error) {
        console.error('Failed to delete user:', error.response?.data || error.message);
        setModalState({ isOpen: false, action: '', userToDelete: null });
      }
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load user data</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader className="text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <div className="p-6 bg-[#f9f9f9] dark:bg-gray-800 rounded-lg z-10">
          <h1 className="sm:text-3xl text-2xl font-extrabold mb-6 text-gray-800 tracking-wide dark:text-gray-200">
            مدیریت کاربران
          </h1>
          <h3 className="dark:text-gray-200 mb-4 sm:text-base text-sm">تعداد کاربران : {userCount}</h3>
          <button
            className="bg-orange-500 py-2 sm:px-4 px-3 rounded hover:scale-90 transition-transform duration-200 hover:bg-orange-600 text-white sm:text-base text-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <span>بستن فرم</span> : <span>اضافه کاربر جدید</span>}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-1000 ${showForm ? 'max-h-96' : 'max-h-0'}`}>
          <div className="p-6 bg-[#f9f9f9] dark:bg-gray-800 rounded-lg mt-4 flex flex-col gap-4">
            <div className="flex justify-between items-center flex-col sm:flex-row">
              <div className="flex lg:flex-row flex-col">
                <input
                  type="text"
                  name="first_name"
                  placeholder=" نام کاربر جدید"
                  value={newUser.first_name}
                  onChange={handleNewUserChange}
                  required
                  className="py-3 px-2 rounded-e-none rounded ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder=" نام خانوادگی کاربر جدید"
                  value={newUser.last_name}
                  onChange={handleNewUserChange}
                  required
                  className="py-3 px-2 rounded-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
                />
                <input
                  type="text"
                  name="phone_number"
                  placeholder="شماره تلفن کاربر جدید"
                  value={newUser.phone_number}
                  onChange={handleNewUserChange}
                  required
                  maxLength={11}
                  minLength={11}
                  className=" py-3 px-2 rounded rounded-s-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
                />
              </div>
              <div>
                <button
                  className="bg-orange-500 py-2 px-4 rounded hover:scale-90 transition-transform duration-200 hover:bg-orange-600 text-white mt-4 sm:mt-0"
                  onClick={handleAddUser}
                >
                  ایجاد کاربر جدید
                </button>
              </div>
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-1000 ${showEdit ? 'max-h-96' : 'max-h-0'}`}>
          <div className="p-6 bg-[#f9f9f9] dark:bg-gray-800 rounded-lg mt-4 flex flex-col gap-4">
            <div className='flex justify-between items-center'>
              <div>
                <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  نام فعلی: {selectedUser.first_name}
                </span>
                <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mr-4">
                  نام خانوادگی فعلی: {selectedUser.last_name}
                </span>
              </div>
              <div>
                <button className="text-red-500 ring-1 ring-red-500 hover:bg-red-200 hover:text-red-700 text-sm px-2 py-1 rounded" onClick={() => setShowEdit(false)}><FiX className='w-4 h-4' /></button>
              </div>
            </div>
            <div className="flex justify-between items-center flex-col sm:flex-row">
              <div className="flex lg:flex-row flex-col">
                <input
                  type="text"
                  name="first_name"
                  placeholder=" نام جدید کاربر "
                  value={editUser.first_name}
                  onChange={handleEditChange}
                  required
                  className="py-3 px-2 rounded-e-none rounded ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder=" نام خانوادگی جدید کاربر"
                  value={editUser.last_name}
                  onChange={handleEditChange}
                  required
                  className="py-3 px-2 rounded-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
                />
                <input
                  type="text"
                  name="phone_number"
                  placeholder="شماره تلفن جدید کاربر"
                  value={selectedUser.phone_number}
                  disabled
                  maxLength={11}
                  minLength={11}
                  className="py-3 px-2 rounded rounded-s-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
                />
              </div>
              <div>
                <button
                  className="bg-orange-500 py-2 px-4 rounded hover:scale-90 transition-transform duration-200 hover:bg-orange-600 text-white mt-4 sm:mt-0"
                  onClick={handleUpdateUser}
                >
                  ویرایش اطلاعات
                </button>
              </div>
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
          </div>
        </div>
      </div>

      <div className="bg-[#f9f9f9] dark:bg-gray-800 p-4 rounded-lg mt-6">
        <div className="flex justify-between my-5">
          <h2>لیست کاربران</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="py-1 px-2 rounded ring-1 ring-orange-500 text-sm flex items-center"
          >
            <span className="mr-1">{showFilters ? ' بستن فیلتر' : 'فیلتر'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h8.25m-8.25 6h5.25m-5.25 6h2.25M4.5 6h.008v.008H4.5V6zm0 6h.008v.008H4.5v-.008zm0 6h.008v.008H4.5v-.008z"
              />
            </svg>
          </button>
        </div>

        {showFilters && (
          <div>
            <div className="grid grid-cols-3 mb-4 bg-white dark:bg-[#4e4d4d] p-5 rounded-lg">
              <input
                type="text"
                placeholder="نام"
                value={filters.first_name}
                onChange={(e) => setFilters({ ...filters, first_name: e.target.value })}
                className="py-3 px-2 rounded rounded-l-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
              />
              <input
                type="text"
                placeholder="نام خانوادگی"
                value={filters.last_name}
                onChange={(e) => setFilters({ ...filters, last_name: e.target.value })}
                className="py-3 px-2 rounded rounded-s-none rounded-l-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
              />
              <input
                type="text"
                placeholder="شماره تلفن"
                value={filters.phone_number}
                onChange={(e) => setFilters({ ...filters, phone_number: e.target.value })}
                className="py-3 px-2 rounded rounded-s-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
              />
            </div>
            <p className="text-sm">
              {filteredUsers?.length > 0
                ? `${filteredUsers?.length} کاربر یافت شد.`
                : 'کاربری یافت نشد.'}
            </p>
          </div>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse' }} className="mt-6">
          <thead>
            <tr className="bg-white dark:text-gray-200 dark:bg-[#494748]">
              <th style={{ border: '1px solid #ddd', padding: '8px' }} className='text-xs sm:text-base' >ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }} className='text-xs sm:text-base' >نام</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }} className='text-xs sm:text-base' >نام خانوادگی</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }} className='text-xs sm:text-base' >شماره تلفن</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }} className='text-xs sm:text-base' > مدیریت کاربر</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  className={`text-gray-800 dark:text-white ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-300 dark:bg-zinc-600'
                    }`}
                >
                  <td style={{ padding: '8px' }} className="text-xs sm:text-base">{index + 1}</td>
                  <td style={{ padding: '8px' }} className="text-xs sm:text-base">
                    {user.first_name}
                  </td>
                  <td style={{ padding: '8px' }} className="text-xs sm:text-base">
                    {user.last_name}
                  </td>
                  <td style={{ padding: '8px' }} className="text-xs sm:text-base">
                    {user.phone_number}
                  </td>
                  <td className='flex justify-center items-center mt-1'>
                    <button className="text-blue-500 ring-1 ring-blue-500 hover:bg-blue-200 hover:text-blue-700 text-sm px-2 py-1 rounded ml-2" onClick={() => handleEditUser(user)}><FiEdit className='w-3 h-3 sm:w-4 sm:h-4' /></button>
                    <button className="text-red-500 ring-1 ring-red-500 hover:bg-red-200 hover:text-red-700 text-sm px-2 py-1 rounded" onClick={() => handleDeleteUser(user)}><FiX className='w-3 h-3 sm:w-4 sm:h-4' /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">کاربری یافت نشد.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <ConfirmModal
        open={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, action: '', userToDelete: null })}
        title={            
            'آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟'
        }
        onConfirmClick={handleModalConfirm}
      />
    </div>
  );
}