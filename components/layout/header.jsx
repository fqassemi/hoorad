'use client';

// Next
import Link from 'next/link';

// React
import { useEffect, useState } from 'react';

// Icons
import { GiBlackBook } from 'react-icons/gi';
import { LuUserCircle2 } from 'react-icons/lu';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

// Hooks
import useUpdateQueryParams from '@/hooks/useUpdateQueryParams';

// Context
import { useAuth } from '@/context/AuthContext';

// Components
import HeaderSearch from './header-search';
import ConfirmModal from '../ui/confirm-modal';
import { Button } from '../ui/button';

// libs
import logoutHandler from '@/lib/logoutHandler';

// Apis
import useGetUserInfo from '@/hooks/api/useGetUserInfo';

function Header() {
   const [isUserLogin, setIsUserLogin] = useState(false);
   const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);

   const { isLoading: userDataIsLoading } = useGetUserInfo(isUserLogin);
   const { isLogin, userInfo, setUserInfo, setIsLogin } = useAuth();

   useEffect(() => {
      setIsUserLogin(isLogin);
   }, [isLogin]);

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
      logoutHandler(() => {
         setIsUserLogin(false);
         setUserInfo({});
         setIsLogin(false);
         closeLogoutModalHandler();
      });
   };

   return (
      <header className="sticky top-0 z-10 w-full bg-[#F5F5F5] shadow-md max-sm:pb-6 max-sm:pt-8 sm:h-[72px]">
         <div className="mx-auto flex h-full max-w-1440 items-start justify-between px-4 sm:items-center lg:px-[78px]">
            <div className="flex gap-7 max-sm:max-w-[250px] max-sm:grow max-sm:flex-col sm:items-center sm:gap-52">
               <Link href="/" className="flex items-center gap-1 font-bold italic">
                  <p className="pt-1">Courses</p>
                  <GiBlackBook className="-scale-x-100 text-2xl text-customOrange" />
               </Link>

               <ConfirmModal
                  open={logoutModalIsOpen}
                  onClose={closeLogoutModalHandler}
                  title="آیا از خروج از حساب کاربری خود مطمئن هستید؟"
                  onConfirmClick={logoutFunction}
               />

               <HeaderSearch />
            </div>
            {isUserLogin ? (
               userDataIsLoading ? (
                  <div className="h-7 w-32 animate-pulse rounded-md bg-gray-300" />
               ) : (
                  <div className="group relative">
                     <div
                        className="flex cursor-pointer items-center gap-1 rounded-md bg-customOrange p-1 text-white 
                        transition-all duration-200 hover:bg-orange-400 lg:gap-2 lg:px-3"
                     >
                        <p className="font-vazirDigit">
                           {userInfo?.first_name && userInfo?.last_name
                              ? `${userInfo?.first_name} ${userInfo?.last_name}`
                              : userInfo?.phone_number}
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
               )
            ) : (
               <Link
                  href="/login"
                  className="flex items-center gap-1 transition-all duration-150 hover:text-customOrange"
               >
                  <LuUserCircle2 className="-scale-x-100 text-2xl text-customOrange" />
                  ورود / ثبت نام
               </Link>
            )}
         </div>
      </header>
   );
}

export default Header;
