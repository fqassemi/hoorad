import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

// Context
import { useAuth } from '@/context/AuthContext';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetUserInfo = userData => {
   const { setUserInfo } = useAuth();

   return useSWR(userData ? `user` : null, fetcher, {
      onSuccess: data => setUserInfo(data?.user_info),
   });
};

export default useGetUserInfo;
