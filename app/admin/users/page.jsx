'use client';

import React, { useState, useEffect } from 'react';
import CircularLoader from '@/components/ui/circular-loader';
import { fetchUsers, addUser } from '@/hooks/api/userManageApi';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', family: '', phone__number: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(''); // State for form validation errors

  const [newUser, setNewUser] = useState({
    name: '',
    family: '',
    phone__number: '',
  });

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase().includes(filters.name.toLowerCase()) || !filters.name) &&
      (user.family?.toLowerCase().includes(filters.family.toLowerCase()) || !filters.family) &&
      (user.phone__number?.includes(filters.phone__number) || !filters.phone__number)
  );

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getNextId = () => {
    if (users.length === 0) return 1;
    const maxId = Math.max(...users.map((user) => user.id));
    return maxId + 1;
  };

  const validateForm = () => {
    const { name, family, phone__number } = newUser;

    // Check if all fields are filled
    if (!name || !family || !phone__number) {
      setFormError('تمام فیلدها الزامی هستند.');
      return false;
    }

    // Check if phone number is 11 digits and starts with 09
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone__number)) {
      setFormError('شماره تلفن باید 11 رقم و با 09 شروع شود.');
      return false;
    }

    setFormError(''); // Clear any previous errors
    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) return; // Stop if validation fails

    const nextId = getNextId();
    const userToAdd = { ...newUser, id: nextId };

    try {
      const data = await addUser(userToAdd);
      setUsers((prevUsers) => [...prevUsers, data]);
      setNewUser({ name: '', family: '', phone__number: '' });
      setShowForm(false);
    } catch (err) {
      setError('Failed to add user');
      console.error('Error adding user:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="relative">
        <div className="p-6 bg-[#f9f9f9] dark:bg-gray-800 rounded-lg z-10">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide dark:text-gray-200">
            مدیریت کاربران
          </h1>
          <h3 className="dark:text-gray-200 mb-4">تعداد کاربران : {users.length}</h3>
          <button
            className="bg-orange-500 py-2 px-4 rounded hover:scale-90 transition-transform duration-200 hover:bg-orange-600 text-white"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <span>بستن فرم</span> : <span>اضافه کاربر جدید</span>}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-1000 ${showForm ? 'max-h-96' : 'max-h-0'}`}>
          <div className="p-6 bg-[#f9f9f9] dark:bg-gray-800 rounded-lg mt-4 flex flex-col gap-4">
            <div className="flex justify-between items-center flex-col sm:flex-row">
              <div className='flex lg:flex-row flex-col'>
                <input
                  type="text"
                  name="name"
                  placeholder=" نام کاربر جدید"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  required
                  className="py-3 px-2 rounded-e-none rounded ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
                />
                <input
                  type="text"
                  name="family"
                  placeholder=" نام خانوادگی کاربر جدید"
                  value={newUser.family}
                  onChange={handleNewUserChange}
                  required
                  className="py-3  px-2 rounded-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
                />
                <input
                  type="text"
                  name="phone__number"
                  placeholder="شماره تلفن کاربر جدید"
                  value={newUser.phone__number}
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
            {formError && (
              <p className="text-red-500 text-sm">{formError}</p> // Display validation error
            )}
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
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="py-3 px-2 rounded rounded-l-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
              />
              <input
                type="text"
                placeholder="نام خانوادگی"
                value={filters.family}
                onChange={(e) => setFilters({ ...filters, family: e.target.value })}
                className="py-3 px-2 rounded rounded-s-none rounded-l-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
              />
              <input
                type="text"
                placeholder="شماره تلفن"
                value={filters.phone__number}
                onChange={(e) => setFilters({ ...filters, phone__number: e.target.value })}
                className="py-3 px-2 rounded rounded-s-none ring-1 ring-orange-500 outline-none text-sm dark:bg-gray-800"
              />
            </div>
            <p className="text-sm">
              {filteredUsers.length > 0
                ? `${filteredUsers.length} کاربر یافت شد.`
                : 'کاربری یافت نشد.'}
            </p>
          </div>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse' }} className="mt-6">
          <thead>
            <tr className="bg-white dark:text-gray-200 dark:bg-[#494748]">
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>نام</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>نام خانوادگی</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>شماره تلفن</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`text-gray-800 dark:text-white ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-300 dark:bg-orange-500'
                  }`}
              >
                <td style={{ border: '1px solid #ddd', padding: '8px' }} className="text-xs sm:text-base">
                  {user.id}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }} className="text-xs sm:text-base">
                  {user.name}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }} className="text-xs sm:text-base">
                  {user.family}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }} className="text-xs sm:text-base">
                  {user.phone__number}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}