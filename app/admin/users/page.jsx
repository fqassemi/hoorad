'use client';

'use client';

import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', family: '', phone__number: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users'); // Replace with your actual API URL
        const data = await response.json();
        setUsers(data); // Store fetched users in state
        console.log(data);
        
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Filter users based on filters
  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase().includes(filters.name.toLowerCase()) || !filters.name) &&
      (user.family?.toLowerCase().includes(filters.family.toLowerCase()) || !filters.family) &&
      (user.phone__number?.includes(filters.phone__number) || !filters.phone__number)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="p-6 bg-[#f9f9f9] dark:bg-gray-800 rounded-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-wide dark:text-gray-200">
          مدیریت کاربران
        </h1>
        <h3 className='dark:text-gray-200'>تعداد کاربران : {users.length}</h3>
      </div>

      <div className="bg-[#f9f9f9] dark:bg-gray-800 p-4 rounded-lg mt-6">
        <div className="flex justify-between my-5">
          <h2>لیست کاربران</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="py-1 px-2 rounded ring-1 ring-blue-500 text-sm flex items-center"
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
                className="py-3 px-2 rounded rounded-l-none ring-1 ring-blue-500 outline-none text-sm dark:bg-gray-800"
              />
              <input
                type="text"
                placeholder="نام خانوادگی"
                value={filters.family}
                onChange={(e) => setFilters({ ...filters, family: e.target.value })}
                className="py-3 px-2 rounded rounded-s-none rounded-l-none ring-1 ring-blue-500 outline-none text-sm dark:bg-gray-800"
              />
              <input
                type="text"
                placeholder="شماره تلفن"
                value={filters.phone__number}
                onChange={(e) => setFilters({ ...filters, phone__number: e.target.value })}
                className="py-3 px-2 rounded rounded-s-none ring-1 ring-blue-500 outline-none text-sm dark:bg-gray-800"
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
            <tr className='bg-white  dark:text-gray-200 dark:bg-[#494748]'>
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
                className={`text-gray-800 dark:text-white ${index%2===0? 'bg-white':'bg-blue-200'} dark:${index%2===0? 'bg-gray-800':'bg-gray-500'}`}
              >
                <td style={{ border: '1px solid #ddd', padding: '8px' }} className='text-xs sm:text-base'>{user.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }} className='text-xs sm:text-base'>{user.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }} className='text-xs sm:text-base'>{user.username}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }} className='text-xs sm:text-base'>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

