// Components
import CourseCard from '@/components/ui/course-card';

// Libs
import fetchDataHandler from '@/lib/fetchDataHandler';

export const revalidate = 60;

export default async function Home() {
   const [coursesData] = await Promise.all([fetchDataHandler('courses')]);

   console.log(coursesData);

   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
         <p className="text-xl font-bold sm:text-3xl">همه ی دوره ها</p>

         <div className="mt-10 grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
            {coursesData?.map(item => (
               <CourseCard key={item} detail={item} />
            ))}
         </div>
      </section>
   );
}
