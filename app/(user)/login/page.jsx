// React
import { Suspense } from 'react';

// Components
import AuthForms from './components/auth-forms';

function Login() {
   return (
      <section className="mx-auto mt-10 max-w-1440 px-4 lg:px-[78px]">
         <Suspense>
            <AuthForms />
         </Suspense>
      </section>
   );
}

export default Login;
