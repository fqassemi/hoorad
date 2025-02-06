import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetUsers = () => useSWR(`users`, fetcher);

export default useGetUsers;
