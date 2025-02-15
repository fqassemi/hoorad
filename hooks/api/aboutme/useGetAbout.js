import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetAbout = () => useSWR('about-me', fetcher);

export default useGetAbout;