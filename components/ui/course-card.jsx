// Next
import Image from 'next/image';
import Link from 'next/link';

// Icons
import { PiCurrencyDollarBold } from 'react-icons/pi';

function CourseCard({ detail }) {
   return (
      <Link
         href={`/course-detail/${detail?.id}`}
         className="group rounded-2xl border border-[#EAEAEA] transition-all duration-150 hover:shadow-md"
      >
         <div className="relative aspect-[1.8/1] w-full sm:aspect-[1.64/1]">
            <Image
               fill
               src="/images/coursePic.jpg"
               alt="course"
               className="rounded-t-2xl object-cover max-sm:object-top"
               priority
               sizes="408px"
            />
         </div>
         <div className="p-4 transition-all duration-150 group-hover:bg-[#fafafa] sm:p-5">
            <p className="line-clamp-1 h-7 text-lg font-bold" title={detail?.name}>
               {detail?.name}
            </p>
            <p className="mt-3 line-clamp-5 h-[100px] text-sm font-light">{detail?.description}</p>
            <p className="mt-4 flex items-center gap-1 text-xs">
               <PiCurrencyDollarBold className="text-xl text-customOrange" />
               قیمت : {detail?.Price}
            </p>
            <div className="my-3 h-px w-full bg-[#EAEAEA] sm:my-4" />

            <p className="text-end text-sm transition-all duration-150 group-hover:text-customOrange">مشاهده دوره</p>
         </div>
      </Link>
   );
}

export default CourseCard;
