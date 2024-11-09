// Components
import CourseCard from '@/components/ui/course-card';

function UserCourses() {
   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
         <p className="text-xl font-bold sm:text-3xl">دوره های من</p>

         <div className="mt-10 grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
            <CourseCard />
            <CourseCard />
         </div>
      </section>
   );
}

export default UserCourses;
