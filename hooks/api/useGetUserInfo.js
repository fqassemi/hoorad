import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetUserInfo = () => useSWR(`user`, fetcher);

export default useGetUserInfo;
