// Next
import Image from 'next/image';
import Link from 'next/link';

// Icons
import { PiCurrencyDollarBold } from 'react-icons/pi';
import { RiCheckboxMultipleBlankFill } from 'react-icons/ri';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

// Components
import CourseCardEnrollButton from '@/components/templates/course-card-enroll-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Libs
import fetchDataHandler from '@/lib/fetchDataHandler';

export const revalidate = 60;

async function CourseDetail({ params }) {
   const { courseId } = params;
   let courseData;
   try {
      courseData = await fetchDataHandler(`courses/${courseId}`, {}, true);
   } catch (error) {
      console.error("Failed to fetch course data:", error);
      courseData = null; // or set a fallback object
   }
   const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px] mb-20 mt-10 sm:mb-30 sm:mt-15">
         <div className="flex gap-5 rounded-3xl bg-[#F5F5F5] p-5 max-lg:flex-col lg:gap-6 lg:p-7.5">
            <div className="relative aspect-video shrink-0 lg:h-60 xl:h-72 overflow-hidden rounded-xl">
              <Image 
                src={baseURL+courseData?.imageId}
                fill
                alt="course"
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {/* <div className="relative aspect-video shrink-0 lg:h-60 xl:h-72">
               <img src={baseURL+courseData?.imageId} fill alt="course" className="rounded-xl" sizes="531px" />
            </div>
           */}
            <div>
               <p className="text-xl font-bold lg:text-3xl">{courseData?.name}</p>
               <p className="mt-5 text-sm font-light leading-[26px] lg:mt-10 lg:text-[15px] lg:leading-8">
                  {courseData?.description}
               </p>

               <p className="mt-12 flex items-center gap-1 text-xs lg:text-sm">
                  <PiCurrencyDollarBold className="text-xl text-customOrange" />
                  قیمت : {courseData?.price}
               </p>

               <div className="mt-7">
                  {courseData?.is_enrolled ? (
                     <p className="h-7 text-sm text-stone-400">دانشجوی دوره هستید</p>
                  ) : (
                     <CourseCardEnrollButton courseId={courseId} />
                  )}
               </div>
            </div>
         </div>

         <div className="mt-5 rounded-3xl bg-[#F5F5F5] p-5 lg:p-7.5">
            <p className="mb-5 flex items-center gap-2 text-lg font-bold lg:text-2xl">
               <RiCheckboxMultipleBlankFill className="text-2xl text-customOrange lg:text-3xl" />
               جلسات
            </p>

            <div className="max-w-[600px]">
               <Accordion type="multiple" className="w-full space-y-3">
                  {courseData?.sessions?.map((item, index) => (
                     <AccordionItem value={`item-${index + 1}`} key={item?.title}>
                        <AccordionTrigger
                           className="w-full [&[data-state=open]_#container]:rounded-b-none
                         [&[data-state=open]_#container]:bg-customOrange [&[data-state=open]_#container]:text-white"
                        >
                           <div
                              className="flex items-center justify-between gap-x-1 rounded-lg bg-white px-3 py-4
                               transition-all duration-150 hover:bg-orange-100 max-sm:text-sm"
                              id="container"
                           >
                              <p>{item?.title}</p>
                              <MdOutlineKeyboardArrowDown
                                 className="size-5 transition-all duration-200"
                                 id="arrowSvg"
                              />
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="rounded-b-lg bg-white">
                           <div className="flex flex-col">
                              {item?.resources?.map((innerItem, innerIndex) => (
                                 <div
                                    // href={`/course-session/${innerItem?.id}`}
                                    className={`flex items-center justify-between p-5 text-xs transition-all duration-150 hover:bg-orange-100 sm:text-sm ${
                                       innerIndex + 1 === item?.resources?.length ? '' : 'border-b border-gray-300'
                                    }`}
                                    key={innerItem?.id}
                                 >
                                    <div className="flex items-center gap-1">
                                       <p className="font-vazirDigit">{innerIndex + 1}.</p>
                                       {innerItem?.title}
                                    </div>
                                    <p className="font-vazirDigit font-light">{/* {innerItem?.time} */}</p>
                                 </div>
                              ))}
                           </div>
                        </AccordionContent>
                     </AccordionItem>
                  ))}
               </Accordion>
            </div>
         </div>
      </section>
   );
}

export default CourseDetail;
