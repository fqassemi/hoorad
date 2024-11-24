'use client';

// React
import { useState } from 'react';

// Cookies
import { getCookie } from 'cookies-next';

// Components
import ConfirmModal from './confirm-modal';
import { Button } from '../ui/button';

// Libs
import revalidatePathHandler from '@/lib/revalidateHandler';

// Hooks
import useUpdateQueryParams from '@/hooks/useUpdateQueryParams';

// Apis
import useUnEnrollUser from '@/hooks/api/edit-user/useUnEnrollUser';

function CourseCardUnEnrollButton({ courseId }) {
   const [showUnEnrollModal, setShowUnEnrollModal] = useState(false);

   const { trigger: unEnrollTrigger, isMutating: unEnrollIsMutaiting } = useUnEnrollUser();

   const updateQueryParams = useUpdateQueryParams(
      'unEnroll-modal',
      () => setShowUnEnrollModal(true),
      () => setShowUnEnrollModal(false)
   );

   const unEnrollHandler = () => {
      const accessToken = getCookie('courses_accessToken');

      const newData = {
         access_token: accessToken,
         course_ids: [courseId],
      };

      unEnrollTrigger(newData, {
         onSuccess: () => {
            revalidatePathHandler('/user-courses', 'page');
            revalidatePathHandler('/(user)', 'page');
            revalidatePathHandler('/(user)/course-detail/[courseId]', 'page');
            setShowUnEnrollModal(false);
         },
      });
   };

   const openEnrollModalHandler = () => {
      setShowUnEnrollModal(true);
      updateQueryParams('unEnroll-modal', 'open');
   };

   const closeEnrollModalHandler = () => {
      setShowUnEnrollModal(false);
      updateQueryParams('unEnroll-modal');
   };

   return (
      <>
         <Button
            className="bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-700"
            variant="main"
            onClick={openEnrollModalHandler}
         >
            لغو اشتراک
         </Button>

         <ConfirmModal
            open={showUnEnrollModal}
            onClose={closeEnrollModalHandler}
            title="آیا از لغو اشتراک از این درس مطمئن هستید؟"
            onConfirmClick={unEnrollHandler}
            confirmIsLoading={unEnrollIsMutaiting}
         />
      </>
   );
}

export default CourseCardUnEnrollButton;
