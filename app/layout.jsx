// Components
import ToastComponent from '@/components/layout/toast-component';
import LoadingProgressBar from '@/components/layout/loading-progress-bar';

// Styles
import './globals.css';

// context
import { AuthProvider } from '@/context/AuthContext';

// Next.js Script
import Script from "next/script";

export const metadata = {
   title: 'HOORAD',
   description: 'AI Academy',
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
            
            {/* Chatbot script */}
            <Script
               id="nuway-chatbot-script-js"
               strategy="afterInteractive"
               dangerouslySetInnerHTML={{
                  __html: `
                     (function(){
                        var s = document.createElement("script");
                        s.src = "https://staging.nuway.co/js/chatbot-loader.js";
                        s.defer = true;
                        s.id = "nuway-chatbot-script-js";
                        s.setAttribute("nuway-company-id", "5668737373962240");
                        s.setAttribute("nuway-url", "https://staging.nuway.co");
                        document.body.appendChild(s);
                     })();
                  `,
               }}
            />
         </body>
      </html>
   );
}
