// Components
import CourseCard from '@/components/templates/course-card';

// Libs
import fetchDataHandler from '@/lib/fetchDataHandler';

async function UserCourses() {
   const coursesData = await fetchDataHandler('user', {}, true);

   console.log(coursesData);

   const result = Object.keys(coursesData?.user_info?.courses).map(key => ({ id: key }));
   console.log(result);

   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
         <p className="text-xl font-bold sm:text-3xl">دوره های من</p>

         <div className="mt-10 grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
            {result?.map(item => (
               <CourseCard key={item?.id} detail={item} isUserCard />
            ))}
            {/* {coursesData?.user_info?.courses?.map(item => (
               <CourseCard />
            ))} */}
         </div>
      </section>
   );
}

export default UserCourses;
