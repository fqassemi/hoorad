// Next
import Link from 'next/link';

// Icons
import { GiBlackBook } from 'react-icons/gi';
import { LuUserCircle2 } from 'react-icons/lu';
import { RiSearch2Line } from 'react-icons/ri';

// Components
import { Button } from '../ui/button';

function Header() {
   return (
      <header className="sticky top-0 z-10 w-full bg-[#F5F5F5] max-sm:pb-6 max-sm:pt-8 sm:h-[72px]">
         <div className="mx-auto flex h-full max-w-1440 items-start justify-between px-4 sm:items-center lg:px-[78px]">
            <div className="flex gap-7 max-sm:max-w-[250px] max-sm:grow max-sm:flex-col sm:items-center sm:gap-52">
               <Link href="/" className="flex items-center gap-1 font-bold italic">
                  <p className="pt-1">Courses</p>
                  <GiBlackBook className="-scale-x-100 text-2xl text-customOrange" />
               </Link>

               <form className="flex h-8 items-center border-b border-[#9D9D9D] pb-1">
                  <Button className="text-[#555555]">
                     <RiSearch2Line className="text-xl" />
                  </Button>
                  <input
                     type="text"
                     className="h-full bg-transparent px-2 text-sm outline-none sm:w-[200px]"
                     placeholder="جستجو"
                  />
               </form>
            </div>
            <Link href="/login" className="flex items-center gap-1 transition-all duration-150 hover:text-customOrange">
               <LuUserCircle2 className="-scale-x-100 text-2xl text-customOrange" />
               ورود
            </Link>
         </div>
      </header>
   );
}

export default Header;
