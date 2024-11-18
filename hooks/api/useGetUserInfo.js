import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetUserInfo = userData => useSWR(userData ? `user` : null, fetcher);

export default useGetUserInfo;
