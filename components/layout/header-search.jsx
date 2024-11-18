'use client';

// Next
import { useRouter } from 'next/navigation';

// React-hook-form
import { useForm } from 'react-hook-form';

// Icons
import { RiSearch2Line } from 'react-icons/ri';

// Components
import { Button } from '../ui/button';

function HeaderSearch() {
   const { push } = useRouter();

   const { register, handleSubmit } = useForm({
      defaultValues: {
         searchInput: '',
      },
      mode: 'onSubmit',
   });

   const formSubmit = data => {
      push(`/search?query=${data?.searchInput}`);
   };

   return (
      <form className="flex h-8 items-center border-b border-[#9D9D9D] pb-1" onSubmit={handleSubmit(formSubmit)}>
         <Button className="text-[#555555]" type="submit">
            <RiSearch2Line className="text-xl" />
         </Button>
         <input
            type="text"
            className="h-full bg-transparent px-2 text-sm outline-none sm:w-[200px]"
            placeholder="جستجو"
            {...register('searchInput', {
               required: {
                  value: true,
               },
            })}
         />
      </form>
   );
}

export default HeaderSearch;
