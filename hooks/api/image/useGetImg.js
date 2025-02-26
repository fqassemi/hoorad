import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = (url) => axiosInstance.get(url, { responseType: 'blob' }).then(res => res.data);

const useGetImage = (id) => {
  return useSWR(id ? `images/${id}` : null, fetcher);
}

export default useGetImage;