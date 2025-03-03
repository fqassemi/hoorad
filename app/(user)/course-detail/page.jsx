// Components
import CourseCard from '@/components/templates/course-card';

// Libs
import fetchDataHandler from '@/lib/fetchDataHandler';

export const revalidate = 60;

export default async function Home() {
   const coursesData = await fetchDataHandler('courses', {}, true);

   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
         <div className="mb-20 mt-10 sm:mb-30 sm:mt-15">
            <p className="text-xl font-bold sm:text-3xl">همه ی دوره ها</p>
            <div className="mt-10 grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
              {coursesData?.map(item => (
                <div key={item?.id} className="h-[400px]"> {/* Add fixed height container */}
                  <CourseCard detail={item} />
                </div>
              ))}
            </div>
         </div>
      </section>
   );
}
