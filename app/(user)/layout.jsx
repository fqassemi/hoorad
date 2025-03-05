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
      userData = await fetchDataHandler('user', { cache: 'no-store' }, true);
   }
   let isAdmin = await fetchDataHandler('isAdmin', { cache: 'no-store' }, true);
   
   return (
      <div>
         <Suspense>
            <Header userData={userData} isAdmin={isAdmin} />
         </Suspense>

         <div className="mt-0 mb-0">{children}</div>
      </div>
   );
}

export default layout;
