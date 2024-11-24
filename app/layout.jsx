// Components
import ToastComponent from '@/components/layout/toast-component';
import LoadingProgressBar from '@/components/layout/loading-progress-bar';

// Styles
import './globals.css';

// context
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
   title: 'courses',
   description: 'courses',
   // icons: {
   //    icon: '/icon.png',
   // },
};

export default function RootLayout({ children }) {
   return (
      <html lang="fa" dir="rtl">
         <body>
            <AuthProvider>
               <ToastComponent />
               <LoadingProgressBar />
               <main>{children}</main>
            </AuthProvider>
         </body>
      </html>
   );
}
