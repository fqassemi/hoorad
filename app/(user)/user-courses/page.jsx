// Components
import CourseCard from '@/components/templates/course-card';

// Libs
import fetchDataHandler from '@/lib/fetchDataHandler';

async function UserCourses() {
   const coursesData = await fetchDataHandler('user', {}, true);

   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
         <p className="text-xl font-bold sm:text-3xl">دوره های من</p>

         <div className="mt-10 grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
            {coursesData?.user_info?.courses?.length === 0 ? (
               <p>دوره ای ثبت نام نشده است.</p>
            ) : (
               coursesData?.user_info?.courses?.map(item => <CourseCard key={item?.id} detail={item} isUserCard />)
            )}
         </div>
      </section>
   );
}

export default UserCourses;
