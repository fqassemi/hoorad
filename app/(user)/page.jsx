// Components
import CourseCard from '@/components/templates/course-card';

import Blog from '@/components/templates/blogs';

// Libs
import fetchDataHandler from '@/lib/fetchDataHandler';

export const revalidate = 60;

export default async function Home() {
   const coursesData = await fetchDataHandler('courses', {}, true);
   const blogsData = await fetchDataHandler('blogs', {}, true);

   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px]">
         <div className="mb-20 mt-10 sm:mb-30 sm:mt-15">
            <p className="text-xl font-bold sm:text-3xl">همه ی دوره ها</p>
            <div className="mt-10 grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
               {coursesData?.map(item => (
                  <CourseCard key={item?.id} detail={item} />
               ))}
            </div>
            <div>
               <Blog blogsDetail={blogsData} />
            </div>
         </div>
      </section>
   );
}
