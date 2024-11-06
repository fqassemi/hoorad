// Components
import CourseCard from '@/components/ui/course-card';

export default function Home() {
   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
         <p className="text-xl font-bold sm:text-3xl">همه ی دوره ها</p>

         <div className="mt-10 grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
         </div>
      </section>
   );
}
