// React-hook-form
import { useForm } from 'react-hook-form';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function RegisterForm() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      defaultValues: {
         phoneNumber: '',
         firstName: '',
         lastName: '',
      },
      mode: 'onSubmit',
   });

   const formSubmit = data => {
      console.log(data);
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
            />
            <Input
               wrapperClassName="mt-5"
               inputClassName="h-12 rounded-lg border focus:border-2 border-[#9D9D9D] px-4 focus:border-customOrange placeholder:text-[13px] placeholder:sm:text-sm"
               placeholder="نام خود را وارد کنید"
               {...register('firstName', {
                  required: { value: true, message: 'این فیلد اجباری است' },
               })}
               errorMessage={errors?.firstName?.message}
               error={!!errors?.firstName}
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
            />

            <Button className="mt-7 h-12 rounded-3xl" color="orange" variant="main" type="submit">
               ثبت نام
            </Button>
         </form>
      </div>
   );
}

export default RegisterForm;
