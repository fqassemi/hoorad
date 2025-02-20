// Components
import CourseCard from '@/components/templates/course-card';

async function Search({ searchParams }) {
   const { query } = await searchParams;

   return (
      <section className="mx-auto max-w-1440 px-4 lg:px-[78px] mb-20 mt-10 sm:mb-30 sm:mt-15">
         <p className="text-xl font-bold sm:text-3xl">نتیجه ی جستجو برای {query}</p>

         <div className="mt-10 grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
            <CourseCard />
            <CourseCard />
         </div>
      </section>
   );
}

export default Search;
