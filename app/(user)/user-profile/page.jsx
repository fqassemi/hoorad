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
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
         <p className="text-xl font-bold sm:text-3xl">ویرایش اطلاعات</p>

         {userDataIsLoading ? (
            <CircularLoader className="mt-14 !text-customOrange lg:mt-20" />
         ) : (
            <form
               className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7.5"
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
   );
}

export default UserProfile;
