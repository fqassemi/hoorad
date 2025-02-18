// React
import { Suspense } from 'react';

// Components
import AuthForms from './components/auth-forms';

function Login() {
   return (
      <div className='mb-20 mt-10 sm:mb-30 sm:mt-15'>
         <section className="mx-auto mt-10 max-w-1440 px-4 lg:px-[78px]">
            <Suspense>
               <AuthForms />
            </Suspense>
         </section>
      </div>
   );
}

export default Login;
