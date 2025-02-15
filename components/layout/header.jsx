'use client';

// Next
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// React
import { useState } from 'react';

// Icons
import { GiBlackBook } from 'react-icons/gi';
import { LuUserCircle2 } from 'react-icons/lu';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

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

function Header({ userData }) {
   const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);
   const [isLogingOut, setIsLogingOut] = useState(false);
   const { setIsLogin } = useAuth();

   const pathname = usePathname();
   const isBlogPage = pathname.includes('blogs');
   const isCoursePage = pathname.includes('course-detail');

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

   let headerText;
   if (isCoursePage) {
      headerText = 'دروس';
   } else if (isBlogPage) {
      headerText = 'بلاگ';
   } else {
      headerText = 'دروس بلاگ';
   }

   return (
      <header className="sticky top-0 z-10 w-full bg-[#F5F5F5] shadow-md max-sm:pb-6 max-sm:pt-8 sm:h-[72px]">
         <div className="mx-auto flex h-full max-w-1440 items-start justify-between px-4 sm:items-center lg:px-[78px]">
            <div className="flex gap-7 max-sm:max-w-[250px] max-sm:grow max-sm:flex-col sm:items-center sm:gap-52">
               <Link href="/" className="flex items-center font-bold italic">
                  <p className="pt-1">{headerText}</p>
                  <GiBlackBook className="-scale-x-100 text-2xl text-customOrange" />
               </Link>

               <ConfirmModal
                  open={logoutModalIsOpen}
                  onClose={closeLogoutModalHandler}
                  title="آیا از خروج از حساب کاربری خود مطمئن هستید؟"
                  onConfirmClick={logoutFunction}
                  confirmIsLoading={isLogingOut}
               />

               <HeaderSearch />
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
                     duration-400 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                  >
                     <div
                        className="flex flex-col rounded-sm border border-customOrange bg-white text-[13px] child:px-1
                           child:py-1.5 child:transition-all child:duration-200 child-hover:bg-orange-200 lg:text-sm child:lg:px-3"
                     >
                        <Link href="/user-profile">پروفایل من</Link>
                        <Link href="/user-courses">دوره های من</Link>
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
