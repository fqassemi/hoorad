'use client';

// Toast
import toast, { ToastBar, Toaster } from 'react-hot-toast';

// Icons
import { IoClose } from 'react-icons/io5';

// Components
import { Button } from '../ui/button';

function ToastComponent() {
   return (
      <Toaster position="top-left" toastOptions={{ duration: 5000 }}>
         {t => (
            <ToastBar toast={t}>
               {({ icon, message }) => (
                  <div className="flex items-center">
                     {icon}
                     <div className="text-sm lg:text-base">{message}</div>
                     {t.type !== 'loading' && (
                        <Button
                           onClick={() => toast.dismiss(t.id)}
                           className="transition-all duration-150 hover:text-red-500"
                        >
                           <IoClose className="lg:text-xl" />
                        </Button>
                     )}
                  </div>
               )}
            </ToastBar>
         )}
      </Toaster>
   );
}

export default ToastComponent;
