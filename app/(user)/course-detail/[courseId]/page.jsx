// Next
import Image from 'next/image';
import Link from 'next/link';

// Icons
import { IoTime } from 'react-icons/io5';
import { RiCheckboxMultipleBlankFill } from 'react-icons/ri';
import { MdOutlineSubject, MdOutlineKeyboardArrowDown } from 'react-icons/md';

// Components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Data
import courses from '@/data/courses';

function CourseDetail() {
   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
         <div className="flex gap-5 rounded-3xl bg-[#F5F5F5] p-5 max-lg:flex-col lg:gap-6 lg:p-7.5">
            <div className="relative aspect-video shrink-0 lg:h-60 xl:h-72">
               <Image src="/images/courseSamplePic.png" fill alt="course" className="rounded-xl" sizes="531px" />
            </div>
            <div>
               <p className="text-xl font-bold lg:text-3xl">آموزش پایتون</p>
               <p className="mt-5 text-sm font-light leading-[26px] lg:mt-10 lg:text-[15px] lg:leading-8">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها
                  و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و
                  کاربردهای متنوع لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
                  گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی
                  تکنولوژی مورد نیاز، و کاربردهای متنوع
               </p>

               <div className="mt-4 space-y-5 text-xs lg:text-sm">
                  <p className="flex items-center gap-1">
                     <RiCheckboxMultipleBlankFill className="text-lg text-customOrange lg:text-xl" />
                     <span className="font-vazirDigit">20</span>
                     جلسه
                  </p>
                  <p className="flex items-center gap-1">
                     <IoTime className="text-lg text-customOrange lg:text-xl" />
                     <span className="font-vazirDigit">12</span>
                     دقیقه
                  </p>
               </div>
            </div>
         </div>

         <div className="mt-5 rounded-3xl bg-[#F5F5F5] p-5 lg:p-7.5">
            <p className="mb-5 flex items-center gap-2 text-lg font-bold lg:text-2xl">
               <MdOutlineSubject className="text-2xl text-customOrange lg:text-3xl" />
               توضیحات
            </p>
            <p className="text-sm font-light leading-[26px] lg:text-base lg:leading-8">
               لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و
               متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و
               کاربردهای متنوع لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک
               است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد
               نیاز، و کاربردهای متنوع لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
               گرافیک است، چاپگرها و متون چنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع لورم
               ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون
               بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای
               متنوع لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است،
               چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
               و کاربردهای متنوع لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
               گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی
               تکنولوژی مورد نیاز، و کاربردهای متنوع لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
               استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای
               شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت
               چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم
               است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع لورم ایپسوم متن ساختگی با تولید سادگی
               نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و
               سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع لورم ایپسوم متن ساختگی با
               تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
               ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع لورم ایپسوم متن
               ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه
               و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع لورم
               ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون
               بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای
               متنوع
            </p>
         </div>

         <div className="mt-5 rounded-3xl bg-[#F5F5F5] p-5 lg:p-7.5">
            <p className="mb-5 flex items-center gap-2 text-lg font-bold lg:text-2xl">
               <RiCheckboxMultipleBlankFill className="text-2xl text-customOrange lg:text-3xl" />
               جلسات
            </p>

            <div className="max-w-[600px] space-y-3">
               {courses?.map(item => (
                  <Accordion type="multiple" className="w-full" key={item?.id}>
                     <AccordionItem value="item-1">
                        <AccordionTrigger className="w-full [&[data-state=open]_#container]:rounded-b-none [&[data-state=open]_#container]:bg-customOrange [&[data-state=open]_#container]:text-white">
                           <div
                              className="flex items-center justify-between gap-x-1 rounded-lg bg-white px-3 py-4 transition-all duration-150 hover:bg-orange-100 max-sm:text-sm"
                              id="container"
                           >
                              <p className="">{item?.title}</p>
                              <MdOutlineKeyboardArrowDown
                                 className="size-5 transition-all duration-200"
                                 id="arrowSvg"
                              />
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="rounded-b-lg bg-white">
                           <div className="flex flex-col">
                              {item?.body?.map((innerItem, innerIndex) => (
                                 <Link
                                    href="/course-session/3"
                                    className={`flex items-center justify-between p-5 text-xs transition-all duration-150 hover:bg-orange-100 sm:text-sm ${
                                       innerIndex + 1 === item?.body?.length ? '' : 'border-b border-gray-300'
                                    }`}
                                    key={innerItem?.id}
                                 >
                                    <div className="flex items-center gap-1">
                                       <p className="font-vazirDigit">{innerIndex + 1}.</p>
                                       {innerItem?.title}
                                    </div>
                                    <p className="font-vazirDigit font-light">{innerItem?.time}</p>
                                 </Link>
                              ))}
                           </div>
                        </AccordionContent>
                     </AccordionItem>
                  </Accordion>
               ))}
            </div>
         </div>
      </section>
   );
}

export default CourseDetail;
