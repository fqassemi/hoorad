// Next
import Image from 'next/image';
import Link from 'next/link';
import ImageComponent from '@/components/templates/image';

// Icons
import { PiCurrencyDollarBold } from 'react-icons/pi';

// Components
import CourseCardEnrollButton from './course-card-enroll-button';
import CourseCardUnEnrollButton from './course-card-unEnroll-button';

function CourseCard({ detail, isUserCard = false }) {
   console.log('imageId:', {detail?.imageId});
   return (
      <div className="group rounded-2xl border border-[#EAEAEA] transition-all duration-150 hover:shadow-md">
         <Link
            href={`/course-detail/${detail?.id}`}
            className="relative block aspect-[1.8/1] w-full sm:aspect-[1.64/1]"
         >
         
         <ImageComponent
          imageId={detail?.imageId}
          className="rounded-t-2xl object-cover max-sm:object-top"
         />
            {/*
          <Image
               fill
               src="/images/coursePic.jpg"
               alt="course"
               className="rounded-t-2xl object-cover max-sm:object-top"
               priority
               sizes="408px"
            />
         */}
         </Link>
         <div className="p-4 transition-all duration-150 group-hover:bg-[#fafafa] sm:p-5">
            <Link
               href={`/course-detail/${detail?.id}`}
               className="line-clamp-1 h-7 text-lg font-bold transition-all duration-150 hover:text-customOrange"
               title={detail?.name}
            >
               {detail?.name}
            </Link>
            {!isUserCard && <p className="mt-3 line-clamp-5 h-[100px] text-sm font-light">{detail?.description}</p>}
            <p className="mt-4 flex items-center gap-1 text-xs">
               <PiCurrencyDollarBold className="text-xl text-customOrange" />
               قیمت : {detail?.price}
            </p>
            <div className="my-3 h-px w-full bg-[#EAEAEA] sm:my-4" />
            <div className="flex items-center justify-between">
               {isUserCard ? (
                  <CourseCardUnEnrollButton courseId={detail?.id} />
               ) : detail?.is_enrolled ? (
                  <p className="h-7 text-sm text-stone-400">دانشجوی دوره هستید</p>
               ) : (
                  <CourseCardEnrollButton courseId={detail?.id} />
               )}
               <Link
                  href={`/course-detail/${detail?.id}`}
                  className="text-sm transition-all duration-150 hover:text-customOrange"
               >
                  مشاهده دوره
               </Link>
            </div>
         </div>
      </div>
   );
}

export default CourseCard;
