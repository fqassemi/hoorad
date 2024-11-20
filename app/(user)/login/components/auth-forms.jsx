'use client';

// React
import { useEffect, useState } from 'react';

// Next
import { useRouter, useSearchParams } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import LoginForm from './login-form';
import RegisterForm from './register-form';

function AuthForms() {
   const [formType, setFormType] = useState('login');

   const { push } = useRouter();
   const searchParams = useSearchParams();
   const gottenFormType = searchParams.get('type');

   const changeFormTypeHandler = type => {
      if (type === 'login') {
         setFormType('login');
         push('/login');
      } else if (type === 'register') {
         setFormType('register');
         push('/login?type=register');
      }
   };

   useEffect(() => {
      if (!gottenFormType) {
         setFormType('login');
      } else if (gottenFormType === 'register') {
         setFormType('register');
      }
   }, [searchParams]);

   return (
      <div className="mx-auto max-w-[500px] rounded-[20px] border border-[#EAEAEA] p-5 sm:p-7.5">
         <div className="flex items-center rounded bg-gray-100 p-1.5 lg:p-3">
            <Button
               className={`h-9 flex-1 max-lg:text-sm lg:h-12 ${formType === 'login' ? 'bg-customOrange text-white' : 'hover:bg-orange-50'}`}
               onClick={() => changeFormTypeHandler('login')}
            >
               ورود
            </Button>
            <Button
               className={`h-9 flex-1 max-lg:text-sm lg:h-12 ${formType === 'register' ? 'bg-customOrange text-white' : 'hover:bg-orange-50'}`}
               onClick={() => changeFormTypeHandler('register')}
            >
               ثبت نام
            </Button>
         </div>

         {formType === 'register' || gottenFormType === 'register' ? (
            <RegisterForm />
         ) : formType === 'login' ? (
            <LoginForm />
         ) : null}
      </div>
   );
}

export default AuthForms;
