'use client';

// Next
import Link from 'next/link';

// React
import { useEffect, useState } from 'react';

// Icons
import { GiBlackBook } from 'react-icons/gi';
import { LuUserCircle2 } from 'react-icons/lu';

// Context
import { useAuth } from '@/context/AuthContext';

// Components
import HeaderSearch from './header-search';

// Apis
import useGetUserInfo from '@/hooks/api/useGetUserInfo';

function Header() {
   const [isUserLogin, setIsUserLogin] = useState(false);

   const { data: userData, isLoading: userDataIsLoading } = useGetUserInfo(isUserLogin);

   console.log(userData);

   const { isLogin } = useAuth();

   useEffect(() => {
      setIsUserLogin(isLogin);
   }, [isLogin]);

   return (
      <header className="sticky top-0 z-10 w-full bg-[#F5F5F5] shadow-md max-sm:pb-6 max-sm:pt-8 sm:h-[72px]">
         <div className="mx-auto flex h-full max-w-1440 items-start justify-between px-4 sm:items-center lg:px-[78px]">
            <div className="flex gap-7 max-sm:max-w-[250px] max-sm:grow max-sm:flex-col sm:items-center sm:gap-52">
               <Link href="/" className="flex items-center gap-1 font-bold italic">
                  <p className="pt-1">Courses</p>
                  <GiBlackBook className="-scale-x-100 text-2xl text-customOrange" />
               </Link>

               <HeaderSearch />
            </div>
            {isUserLogin ? (
               'لاگینه'
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
