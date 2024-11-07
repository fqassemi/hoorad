'use client';

// React-hook-form
import { useForm } from 'react-hook-form';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function Login() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      defaultValues: {
         phoneNumber: '',
      },
      mode: 'onSubmit',
   });

   const formSubmit = data => {
      console.log(data);
   };

   return (
      <section className="mx-auto mt-10 max-w-1440 px-4 lg:px-[78px]">
         <div className="mx-auto max-w-[500px] rounded-[20px] border border-[#EAEAEA] p-5 sm:p-7.5">
            <p className="text-2xl font-bold sm:text-3xl">ورود</p>
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
               />
               <Button className="mt-7 h-12 rounded-3xl" color="orange" variant="main" type="submit">
                  ورود
               </Button>
            </form>
         </div>
      </section>
   );
}

export default Login;
