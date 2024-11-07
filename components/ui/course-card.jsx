// Next
import Image from 'next/image';
import Link from 'next/link';

// Icons
import { IoTime } from 'react-icons/io5';
import { RiCheckboxMultipleBlankFill } from 'react-icons/ri';

function CourseCard() {
   return (
      <Link
         href="/course-detail/2"
         className="group rounded-2xl border border-[#EAEAEA] transition-all duration-150 hover:shadow-md"
      >
         <div className="relative aspect-[1.8/1] w-full sm:aspect-[1.64/1]">
            <Image
               fill
               src="/images/courseSamplePic.png"
               alt="course"
               className="rounded-t-2xl object-cover max-sm:object-top"
               priority
               sizes="408px"
            />
         </div>
         <div className="p-4 transition-all duration-150 group-hover:bg-[#fafafa] sm:p-5">
            <p className="line-clamp-1 h-7 text-lg font-bold sm:text-xl">آموزش پایتون به زبان ساده</p>
            <p className="mt-3 line-clamp-3 h-15 text-sm font-light">
               لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و
               متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و
               کاربردهای متنوع
            </p>
            <div className="mt-4 flex items-center gap-5 text-xs">
               <p className="flex items-center gap-1">
                  <RiCheckboxMultipleBlankFill className="text-xl text-customOrange" />
                  <span className="font-vazirDigit">20</span>
                  جلسه
               </p>
               <p className="flex items-center gap-1">
                  <IoTime className="text-sm text-customOrange" />
                  <span className="font-vazirDigit">12</span>
                  دقیقه
               </p>
            </div>
            <div className="my-3 h-px w-full bg-[#EAEAEA] sm:my-4" />

            <p className="text-end text-sm transition-all duration-150 group-hover:text-customOrange">مشاهده دوره</p>
         </div>
      </Link>
   );
}

export default CourseCard;
