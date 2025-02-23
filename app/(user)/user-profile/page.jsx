'use client';

// React
import { useEffect } from 'react';

// React-hook-form
import { useForm } from 'react-hook-form';

// Cookies
import { getCookie } from 'cookies-next';

// Components
import CircularLoader from '@/components/ui/circular-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Libs
import revalidatePathHandler from '@/lib/revalidateHandler';

// Apis
import useGetUserInfo from '@/hooks/api/useGetUserInfo';
import useEditInfo from '@/hooks/api/edit-user/useEditInfo';

function UserProfile() {
   const { data: userData, isLoading: userDataIsLoading } = useGetUserInfo();

   const { trigger: editTrigger, isMutating: editIsMutating } = useEditInfo();

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
   } = useForm({
      defaultValues: {
         firstName: '',
         lastName: '',
      },
      mode: 'onSubmit',
   });

   useEffect(() => {
      if (userData) {
         setValue('firstName', userData?.user_info?.first_name);
         setValue('lastName', userData?.user_info?.last_name);
         setValue('phoneNumber', userData?.user_info?.phone_number);
      }
   }, [userData]);

   const formSubmit = data => {
      const accessToken = getCookie('courses_accessToken');

      const newData = {
         first_name: data?.firstName,
         last_name: data?.lastName,
         access_token: accessToken,
      };

      editTrigger(newData, {
         onSuccess: () => {
            revalidatePathHandler('/(user)', 'layout');
         },
      });
   };

   return (
      <div className='mb-20 mt-10 sm:mb-30 sm:mt-15'>
         <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
            <p className="text-xl font-bold sm:text-3xl">ویرایش اطلاعات</p>

            {userDataIsLoading ? (
               <CircularLoader className="mt-14 !text-customOrange lg:mt-20" />
            ) : (
               <form
                  className="mt-10 grid grid-cols-1 px-8 gap-5 lg:px-72 sm:px-52 lg:gap-7.5"
                  onSubmit={handleSubmit(formSubmit)}
               >
                  <Input
                     inputClassName="h-12 rounded-lg border focus:border-2 border-[#9D9D9D] px-4 focus:border-customOrange placeholder:text-[13px] placeholder:sm:text-sm"
                     placeholder="نام خود را وارد کنید"
                     {...register('firstName', {
                        required: { value: true, message: 'این فیلد اجباری است' },
                     })}
                     labelText="نام"
                     labelClassName="mb-2 font-bold"
                     errorMessage={errors?.firstName?.message}
                     error={!!errors?.firstName}
                     disabled={editIsMutating}
                  />
                  <Input
                     inputClassName="h-12 rounded-lg border focus:border-2 border-[#9D9D9D] px-4 focus:border-customOrange placeholder:text-[13px] placeholder:sm:text-sm"
                     placeholder="نام خانوادگی خود را وارد کنید"
                     {...register('lastName', {
                        required: { value: true, message: 'این فیلد اجباری است' },
                     })}
                     labelText="نام خانوادگی"
                     labelClassName="mb-2 font-bold"
                     errorMessage={errors?.lastName?.message}
                     error={!!errors?.lastName}
                     disabled={editIsMutating}
                  />
                  <Input
                     inputClassName="h-12 rounded-lg border focus:border-2 border-[#9D9D9D] px-4 focus:border-customOrange placeholder:text-[13px] placeholder:sm:text-sm"
                     placeholder="شماره تلفن خود را وارد کنید"
                     {...register('phoneNumber', {
                        required: { value: true, message: 'این فیلد اجباری است' },
                     })}
                     labelText="شماره تلفن"
                     labelClassName="mb-2 font-bold"
                     errorMessage={errors?.lastName?.message}
                     error={!!errors?.lastName}
                     disabled
                  />

                  <div className="sm:hidden lg:block" />

                  <Button
                     className="h-12 rounded-3xl"
                     color="orange"
                     variant="main"
                     type="submit"
                     loading={editIsMutating}
                  >
                     ویرایش
                  </Button>
               </form>
            )}
         </section>
      </div>
   );
}

export default UserProfile;
