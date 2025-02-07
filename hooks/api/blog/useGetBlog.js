import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetBlogs = () => useSWR('blogs', fetcher);

export default useGetBlogs;