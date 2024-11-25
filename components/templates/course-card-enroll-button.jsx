'use client';

// React
import { useState } from 'react';

// Cookies
import { getCookie } from 'cookies-next';

// Toast
import toast from 'react-hot-toast';

// Context
import { useAuth } from '@/context/AuthContext';

// Components
import ConfirmModal from './confirm-modal';
import { Button } from '../ui/button';

// Libs
import revalidatePathHandler from '@/lib/revalidateHandler';

// Hooks
import useUpdateQueryParams from '@/hooks/useUpdateQueryParams';

// Apis
import useEnrollUser from '@/hooks/api/edit-user/useEnrollUser';

function CourseCardEnrollButton({ courseId }) {
   const [showEnrollModal, setShowEnrollModal] = useState(false);
   const { isLogin } = useAuth();

   const { trigger: enrollTrigger, isMutating: enrollIsMutaiting } = useEnrollUser();

   const updateQueryParams = useUpdateQueryParams(
      `enroll-modal${courseId}`,
      () => setShowEnrollModal(true),
      () => setShowEnrollModal(false)
   );

   const showEnrollModalHandler = () => {
      if (isLogin) {
         setShowEnrollModal(true);
         updateQueryParams(`enroll-modal${courseId}`, 'open');
      } else {
         toast.error('لطفا ابتدا وارد حساب کاربری خود شوید');
      }
   };

   const closeEnrollModalHandler = () => {
      setShowEnrollModal(false);
      updateQueryParams(`enroll-modal${courseId}`);
   };

   const enrollHandler = () => {
      const accessToken = getCookie('courses_accessToken');

      const newData = {
         course_id: courseId,
         access_token: accessToken,
      };

      enrollTrigger(newData, {
         onSuccess: () => {
            revalidatePathHandler('/(user)', 'page');
            revalidatePathHandler('/(user)/course-detail/[courseId]', 'page');
            closeEnrollModalHandler();
         },
      });
   };

   return (
      <>
         <Button
            className="bg-customOrange px-3 py-1 text-sm text-white hover:bg-orange-700"
            variant="main"
            onClick={showEnrollModalHandler}
         >
            ثبت نام
         </Button>

         <ConfirmModal
            open={showEnrollModal}
            onClose={closeEnrollModalHandler}
            title="آیا از ثبت نام در این درس مطمئن هستید؟"
            onConfirmClick={enrollHandler}
            confirmIsLoading={enrollIsMutaiting}
         />
      </>
   );
}

export default CourseCardEnrollButton;
