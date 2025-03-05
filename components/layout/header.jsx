'use client';

// Next
import Link from 'next/link';

// React
import { useState, useEffect, useRef } from 'react';

// Icons
import { FiBook, FiMenu, FiX, Fix } from 'react-icons/fi';
import { LuUserCircle2 } from 'react-icons/lu';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

// Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Context
import { useAuth } from '@/context/AuthContext';

// Hooks
import useUpdateQueryParams from '@/hooks/useUpdateQueryParams';

// Components
import HeaderSearch from './header-search';
import ConfirmModal from '../templates/confirm-modal';
import { Button } from '../ui/button';

// libs
import logoutHandler from '@/lib/logoutHandler';


function Header({ userData, isAdmin }) {
   const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);
   const [isLogingOut, setIsLogingOut] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const { setIsLogin } = useAuth();

   const updateQueryParams = useUpdateQueryParams(
      'logout-modal',
      () => setLogoutModalIsOpen(true),
      () => setLogoutModalIsOpen(false)
   );

   const openLogoutModalHandler = () => {
      setLogoutModalIsOpen(true);
      updateQueryParams('logout-modal', 'open');
   };

   const closeLogoutModalHandler = () => {
      setLogoutModalIsOpen(false);
      updateQueryParams('logout-modal');
   };

   const logoutFunction = () => {
      setIsLogingOut(true);
      logoutHandler(() => {
         setIsLogin(false);
         setTimeout(() => {
            setIsLogingOut(false);
            closeLogoutModalHandler();
         }, 1500);
      });
   };

   return (
      <header className="sticky top-0 z-10 w-full bg-[#F5F5F5] shadow-md max-sm:pb-6 max-sm:pt-8 sm:h-[72px]">
         <div className="mx-auto flex h-full max-w-1440 items-start justify-between px-4 sm:items-center lg:px-[78px]">
            <div className="flex gap-5 max-sm:max-w-[250px] max-sm:grow max-sm:flex-col sm:items-center sm:gap-16">
               <div className="flex items-center gap-3">

                  <button
                     className="sm:hidden flex flex-col gap-1.5"
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                     aria-label="Toggle menu"
                  >
                     <span>
                        {isMenuOpen ? <FiX className='w-6 h-6 hover:text-orange-500 cursor-pointer transition-all' /> : <FiMenu className='w-6 h-6 hover:text-orange-500 cursor-pointer transition-all' />}
                     </span>
                  </button>

                  <div>
                     <Link href='/'>
                        <div className="text-center flex items-center">
                           <FiBook size={20} className='text-orange-500' />
                           <h3 className='text-2xl font-semibold text-gray-900 tracking-wider leading-tight'>
                              هوراد
                           </h3>
                        </div>

                     </Link>
                  </div>

                  <div className="hidden sm:flex gap-4">
                     <Link href="/course-detail" className="hover:text-orange-500 cursor-pointer">
                        دروس
                     </Link>
                     <Link href="/blogs" className="hover:text-orange-500 cursor-pointer">
                        بلاگ
                     </Link>
                     <Link href="/news" className="hover:text-orange-500 cursor-pointer">
                        رویداد
                     </Link>
                     <Link href="/about-us" className="hover:text-orange-500 cursor-pointer">
                        درباره ما
                     </Link>
                  </div>


                  <AnimatePresence>
                     {isMenuOpen && (
                        <motion.div
                           initial={{ opacity: 0, y: -20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.3 }}
                           className="absolute left-0 top-full w-full bg-[#F5F5F5] shadow-md sm:hidden"
                        >
                           <div className="flex flex-col gap-y-5 p-4">
                              <Link href="/course-detail" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-500 cursor-pointer">
                                 دروس
                              </Link>
                              <Link href="/blogs" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-500 cursor-pointer">
                                 بلاگ
                              </Link>
                              <Link href="/news" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-500">
                                 رویداد
                              </Link>
                              <Link href="/about-us" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-500">
                                 درباره ما
                              </Link>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               <ConfirmModal
                  open={logoutModalIsOpen}
                  onClose={closeLogoutModalHandler}
                  title="آیا از خروج از حساب کاربری خود مطمئن هستید؟"
                  onConfirmClick={logoutFunction}
                  confirmIsLoading={isLogingOut}
               />

               {/* {<HeaderSearch />} */}
            </div>
            {userData ? (
               <div className="group relative">
                  <div
                     className="flex cursor-pointer items-center gap-1 rounded-md bg-customOrange p-1 text-white 
                        transition-all duration-200 hover:bg-orange-400 lg:gap-2 lg:px-3"
                  >
                     <p className="font-vazirDigit">
                        {userData?.user_info?.first_name && userData?.user_info?.last_name
                           ? `${userData?.user_info?.first_name} ${userData?.user_info?.last_name}`
                           : userData?.user_info?.phone_number}
                     </p>
                     <MdOutlineKeyboardArrowDown className="transition-all duration-200 group-hover:rotate-180" />
                  </div>

                  <div
                     className="invisible absolute end-0 top-full w-full min-w-fit -translate-y-2 pt-1 opacity-0 transition-all 
                     duration-400 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50"
                  >
                     <div
                        className="flex flex-col rounded-sm border border-customOrange bg-white text-[13px] child:px-1
                           child:py-1.5 child:transition-all child:duration-200 child-hover:bg-orange-200 lg:text-sm child:lg:px-3"
                     >
                        <Link href="/user-profile">پروفایل من</Link>
                        <Link href="/user-courses">دوره های من</Link>
                        {isAdmin && <Link href="/admin">پنل ادمین</Link>}
                        <Button className="justify-start" onClick={openLogoutModalHandler}>
                           خروج از حساب
                        </Button>
                     </div>
                  </div>
               </div>
            ) : (
               <Link
                  href="/login"
                  className="flex items-center gap-1 transition-all duration-150 hover:text-customOrange max-lg:text-sm"
               >
                  <LuUserCircle2 className="-scale-x-100 text-xl text-customOrange lg:text-2xl" />
                  ورود / ثبت نام
               </Link>
            )}
         </div>
      </header>
   );
}

export default Header;