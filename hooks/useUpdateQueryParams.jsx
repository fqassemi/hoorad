// Next
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// React
import { useEffect } from 'react';

const useUpdateQueryParams = (paramKey, openState, closeState) => {
   const { push } = useRouter();
   const pathName = usePathname();
   const searchParams = useSearchParams();

   const updateQueryParams = (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
         params.set(key, value);
      } else {
         params.delete(key);
      }
      push(`${pathName}?${params.toString()}`);
   };

   useEffect(() => {
      if (searchParams.get(paramKey) === 'open') {
         openState();
      } else {
         closeState();
      }
   }, [searchParams]);

   return updateQueryParams;
};

export default useUpdateQueryParams;
