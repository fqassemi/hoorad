'use client';

import React, { useState } from 'react';
import CircularLoader from '@/components/ui/circular-loader';
import ConfirmModal from '@/components/templates/confirm-modal';

import useGetUsers from '@/hooks/api/users/useGetUsers';
import useEditInfo from '@/hooks/api/edit-user/useEditInfo';
import useDeleteUser from '@/hooks/api/users/useDeleteUser';
// import useRegister from '@/hooks/api/login/useRegister';

import { getCookie } from 'cookies-next';

import { FiX, FiEdit, FiUserPlus, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';



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
    <div className="min-h-screen p-6 bg-[#f9f9f9] dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          مدیریت کاربران
        </h1>
        <h3 className="text-gray-600 dark:text-gray-300 mb-6">
          تعداد کاربران: <span className="font-semibold">{userCount}</span>
        </h3>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 flex items-center gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          <FiUserPlus className="w-5 h-5" />
          {showForm ? 'بستن فرم' : 'اضافه کاربر جدید'}
        </button>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="نام کاربر جدید"
                value={newUser.first_name}
                onChange={handleNewUserChange}
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="last_name"
                placeholder="نام خانوادگی کاربر جدید"
                value={newUser.last_name}
                onChange={handleNewUserChange}
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="phone_number"
                placeholder="شماره تلفن کاربر جدید"
                value={newUser.phone_number}
                onChange={handleNewUserChange}
                maxLength={11}
                minLength={11}
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
              onClick={handleAddUser}
            >
              ایجاد کاربر جدید
            </button>
            {formError && (
              <p className="mt-2 text-sm text-red-500">{formError}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEdit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-gray-600 dark:text-gray-300">
                  نام فعلی: {selectedUser.first_name}
                </span>
                <span className="text-gray-600 dark:text-gray-300 ml-4">
                  نام خانوادگی فعلی: {selectedUser.last_name}
                </span>
              </div>
              <button
                className="text-red-500 hover:text-red-700 transition-all duration-300"
                onClick={() => setShowEdit(false)}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="نام جدید کاربر"
                value={editUser.first_name}
                onChange={handleEditChange}
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="last_name"
                placeholder="نام خانوادگی جدید کاربر"
                value={editUser.last_name}
                onChange={handleEditChange}
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
              onClick={handleUpdateUser}
            >
              ویرایش اطلاعات
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            لیست کاربران
          </h2>
          <button
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-all duration-300"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="w-5 h-5" />
            {showFilters ? 'بستن فیلتر' : 'فیلتر'}
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="نام"
              value={filters.first_name}
              onChange={(e) => setFilters({ ...filters, first_name: e.target.value })}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="نام خانوادگی"
              value={filters.last_name}
              onChange={(e) => setFilters({ ...filters, last_name: e.target.value })}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="شماره تلفن"
              value={filters.phone_number}
              onChange={(e) => setFilters({ ...filters, phone_number: e.target.value })}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </motion.div>
        )}
      </div>
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-3 text-center text-gray-800 dark:text-white text-sm sm:text-base ">ID</th>
              <th className="p-3 text-center text-gray-800 dark:text-white text-sm sm:text-base ">نام</th>
              <th className="p-3 text-center text-gray-800 dark:text-white text-sm sm:text-base ">نام خانوادگی</th>
              <th className="p-3 text-center text-gray-800 dark:text-white text-sm sm:text-base ">شماره تلفن</th>
              <th className="p-3 text-center text-gray-800 dark:text-white text-sm sm:text-base ">مدیریت کاربر</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <td className="p-3 text-gray-800 text-center dark:text-white sm:text-base text-sm">{index + 1}</td>
                  <td className="p-3 text-gray-800 text-center dark:text-white sm:text-base text-sm">{user.first_name}</td>
                  <td className="p-3 text-gray-800 text-center dark:text-white sm:text-base text-sm">{user.last_name}</td>
                  <td className="p-3 text-gray-800 text-center dark:text-white sm:text-base text-sm">{user.phone_number}</td>
                  <td className="p-3 flex items-center justify-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-all duration-300"
                      onClick={() => handleEditUser(user)}
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-all duration-300"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-800 dark:text-white">
                  کاربری یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}