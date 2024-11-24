// Next
import { cookies } from 'next/headers';

// React
import { Suspense } from 'react';

// Components
import Header from '@/components/layout/header';

// Libs
import fetchDataHandler from '@/lib/fetchDataHandler';

async function layout({ children }) {
   const cookieStore = await cookies();
   const accessToken = cookieStore.get('courses_accessToken')?.value;

   let userData = null;
   if (accessToken) {
      userData = await fetchDataHandler('user', {}, true);
   }

   return (
      <div>
         <Suspense>
            <Header userData={userData} />
         </Suspense>

         <div className="mb-20 mt-10 sm:mb-30 sm:mt-15">{children}</div>
      </div>
   );
}

export default layout;
