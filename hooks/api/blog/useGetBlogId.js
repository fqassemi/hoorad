import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';


const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetBlog = (blogId) => {
  
  const url = blogId ? `blogs/${blogId}` : null; 
  
  return useSWR(url, fetcher);
};

export default useGetBlog;
