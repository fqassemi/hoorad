// Components
import Header from '@/components/layout/header';

function layout({ children }) {
   return (
      <div>
         <Header />
         <div className="mb-20 mt-10 sm:mb-30 sm:mt-15">{children}</div>
      </div>
   );
}

export default layout;
