// Next
import Image from 'next/image';
import Link from 'next/link';

// Icons
import { PiCurrencyDollarBold } from 'react-icons/pi';

// Components
import CourseCardEnrollButton from './course-card-enroll-button';
import CourseCardUnEnrollButton from './course-card-unEnroll-button';

function CourseCard({ detail, isUserCard = false }) {
   console.log(detail);
   const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    <div className="group h-full rounded-2xl border border-[#EAEAEA] transition-all duration-150 hover:shadow-md">
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
        <Link href={`/course-detail/${detail?.id}`}>
          <Image
            src={baseURL+detail?.imageId}
            alt={detail?.name || "Course image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="flex h-[calc(100%-180px)] flex-col p-4 transition-all duration-150 group-hover:bg-[#fafafa] sm:p-5">
        {/* Title */}
        <Link
          href={`/course-detail/${detail?.id}`}
          className="line-clamp-2 mb-3 h-14 text-lg font-bold leading-snug transition-all duration-150 hover:text-customOrange"
          title={detail?.name}
        >
          {detail?.name}
        </Link>

        {/* Description */}
        {!isUserCard && (
          <p className="line-clamp-4 mb-4 min-h-[80px] text-sm font-light leading-relaxed text-gray-600">
            {detail?.description}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto">
          <p className="flex items-center gap-1 text-sm">
            <PiCurrencyDollarBold className="text-xl text-customOrange" />
            قیمت : {detail?.price}
          </p>

          <div className="my-3 h-px w-full bg-[#EAEAEA] sm:my-4" />

          {/* Buttons */}
          <div className="flex items-center justify-between">
            {/* ... keep button logic ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default CourseCard;

{/*
function CourseCard({ detail, isUserCard = false }) {
   console.log(detail);
   
   const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
   return (
      <div className="group rounded-2xl border border-[#EAEAEA] transition-all duration-150 hover:shadow-md">
         <Link
            href={`/course-detail/${detail?.id}`}
            className="relative block aspect-[1.8/1] w-full sm:aspect-[1.64/1]"
         >

          <img
               fill
               src={baseURL+detail?.imageId}
               alt="course"
               className="rounded-t-2xl object-cover max-sm:object-top"
               priority
               sizes="408px"
            />

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
*/}

