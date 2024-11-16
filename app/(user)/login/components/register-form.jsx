// Next
import { useRouter } from 'next/navigation';

// React
import { useState } from 'react';

// React-hook-form
import { Controller, useForm } from 'react-hook-form';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// Apis
import useRegister from '@/hooks/api/login/useRegister';
import useVerificationCode from '@/hooks/api/login/useVerificationCode';

const otpCounts = [1, 2, 3, 4, 5];

function RegisterForm() {
   const [loginStep, setLoginStep] = useState(1);

   const { trigger: verificationCodeTrigger, isMutating: verificationCodeIsMutating } = useVerificationCode();
   const { trigger: registerTrigger, isMutating: registerIsMutating } = useRegister();

   const { push } = useRouter();

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
   } = useForm({
      defaultValues: {
         phoneNumber: '',
         code: '',
         firstName: '',
         lastName: '',
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
         const newUser = {
            phone_number: data?.phoneNumber,
            verification_code: data?.code,
            first_name: data?.firstName,
            last_name: data?.lastName,
         };

         registerTrigger(newUser, {
            onSuccess: () => {
               push('/login');
               reset();
            },
         });
      }
   };

   return (
      <div className="mt-7 lg:mt-10">
         <p className="text-2xl font-bold sm:text-3xl">ثبت نام</p>
         <form className="flex flex-col" onSubmit={handleSubmit(formSubmit)}>
            <Input
               type="number"
               wrapperClassName="mt-7.5"
               inputClassName="h-12 rounded-lg font-vazirDigit border focus:border-2 border-[#9D9D9D] px-4 focus:border-customOrange placeholder:text-[13px] placeholder:sm:text-sm"
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
               <>
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
                                 disabled={registerIsMutating}
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

                  <Input
                     wrapperClassName="mt-5"
                     inputClassName="h-12 rounded-lg border focus:border-2 border-[#9D9D9D] px-4 focus:border-customOrange placeholder:text-[13px] placeholder:sm:text-sm"
                     placeholder="نام خود را وارد کنید"
                     {...register('firstName', {
                        required: { value: true, message: 'این فیلد اجباری است' },
                     })}
                     errorMessage={errors?.firstName?.message}
                     error={!!errors?.firstName}
                     disabled={registerIsMutating}
                  />
                  <Input
                     wrapperClassName="mt-5"
                     inputClassName="h-12 rounded-lg border focus:border-2 border-[#9D9D9D] px-4 focus:border-customOrange placeholder:text-[13px] placeholder:sm:text-sm"
                     placeholder="نام خانوادگی خود را وارد کنید"
                     {...register('lastName', {
                        required: { value: true, message: 'این فیلد اجباری است' },
                     })}
                     errorMessage={errors?.lastName?.message}
                     error={!!errors?.lastName}
                     disabled={registerIsMutating}
                  />
               </>
            )}

            <Button
               className="mt-7 h-12 rounded-3xl"
               color="orange"
               variant="main"
               type="submit"
               loading={registerIsMutating || verificationCodeIsMutating}
            >
               ثبت نام
            </Button>
         </form>
      </div>
   );
}

export default RegisterForm;
