import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetAbout = () => useSWR('images', fetcher);

export default useGetAbout;