import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetSome = () => useSWR(`visit/history`, fetcher);

export default useGetSome;
