// Next
import { useRouter } from 'next/navigation';

// React
import { useState } from 'react';

// Cookies
import { setCookie } from 'cookies-next';

// React-hook-form
import { Controller, useForm } from 'react-hook-form';

// Context
import { useAuth } from '@/context/AuthContext';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// Libs
import revalidatePathHandler from '@/lib/revalidateHandler';

// Apis
import useVerificationCode from '@/hooks/api/login/useVerificationCode';
import useLogin from '@/hooks/api/login/useLogin';

const otpCounts = [1, 2, 3, 4, 5];

function LoginForm() {
   const [loginStep, setLoginStep] = useState(1);

   const { push } = useRouter();
   const { setIsLogin } = useAuth();

   const { trigger: verificationCodeTrigger, isMutating: verificationCodeIsMutating } = useVerificationCode();
   const { trigger: loginTrigger, isMutating: loginIsMutating } = useLogin();

   const {
      register,
      handleSubmit,
      control,
      formState: { errors },
   } = useForm({
      defaultValues: {
         phoneNumber: '',
         code: '',
      },
      mode: 'onSubmit',
   });

   const formSubmit = data => {
      if (loginStep === 1) {
         verificationCodeTrigger(
            { phone_number: data?.phoneNumber },
            {
               onSuccess: () => {
                  setLoginStep(2);
               },
            }
         );
      } else if (loginStep === 2) {
         const newData = {
            phone_number: data?.phoneNumber,
            verification_code: data?.code,
         };

         loginTrigger(newData, {
            onSuccess: async loginData => {
               revalidatePathHandler('/', 'layout');
               setCookie('phoneNumber', newData?.phone_number, { maxAge: 60 * 60 * 24 * 365 }); 
               setCookie('courses_accessToken', loginData?.tokens?.access_token, { maxAge: 60 * 60 * 24 * 365 });
               setCookie('courses_refreshToken', loginData?.tokens?.refresh_token, { maxAge: 60 * 60 * 24 * 365 });
               setCookie('courses_isLogin', true, { maxAge: 60 * 60 * 24 * 365 });
               setIsLogin(true);
               push('/');
            },
         });
      }
   };

   return (
      <div className="mt-7 lg:mt-10">
         <p className="text-2xl font-bold sm:text-3xl">ورود</p>
         <form className="flex flex-col" onSubmit={handleSubmit(formSubmit)}>
            <Input
               type="number"
               wrapperClassName="mt-7.5"
               inputClassName="h-12 rounded-lg font-vazirDigit border focus:border-2 border-[#9D9D9D] px-4 focus:border-customOrange
                placeholder:text-[13px] placeholder:sm:text-sm"
               placeholder="شماره تماس خود را وارد کنید"
               {...register('phoneNumber', {
                  required: { value: true, message: 'این فیلد اجباری است' },
                  pattern: {
                     value: /^09\d{9}$/g,
                     message: 'لطفا یک شماره تلفن ۱۱ رقمی که با ۰۹ شروع میشود را وارد کنید',
                  },
               })}
               errorMessage={errors?.phoneNumber?.message}
               error={!!errors?.phoneNumber}
               disabled={loginStep === 2 || verificationCodeIsMutating}
            />
            {loginStep === 2 && (
               <div className="mt-8 space-y-3">
                  <p className="text-sm">کد ارسال شده را وارد کنید</p>
                  <div dir="ltr">
                     <Controller
                        control={control}
                        name="code"
                        rules={{
                           required: 'این فیلد اجباری است',
                           minLength: { value: 5, message: 'لفطا کد را کامل وارد کنید' },
                        }}
                        render={({ field: { onChange, value } }) => (
                           <InputOTP
                              maxLength={5}
                              containerClassName="gap-5 font-vazirDigit justify-center"
                              pattern="^[0-9]*$"
                              value={value}
                              onChange={newValue => onChange(newValue)}
                              disabled={loginIsMutating}
                              errorMessage={errors?.code?.message}
                           >
                              {otpCounts?.map((item, index) => (
                                 <InputOTPGroup key={item}>
                                    <InputOTPSlot
                                       index={index}
                                       className="size-12 border-[#9D9D9D] ring-customOrange"
                                       error={!!errors?.code}
                                    />
                                 </InputOTPGroup>
                              ))}
                           </InputOTP>
                        )}
                     />
                  </div>
               </div>
            )}
            <Button
               className="mt-7 h-12 rounded-3xl"
               color="orange"
               variant="main"
               type="submit"
               loading={verificationCodeIsMutating || loginIsMutating}
            >
               ورود
            </Button>
         </form>
      </div>
   );
}

export default LoginForm;
