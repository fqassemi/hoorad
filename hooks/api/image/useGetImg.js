import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetcher = (url) => axiosInstance.get(url, { responseType: 'blob' }).then(res => res.data);

const useGetImage = (id) => {
  return useSWR(id ? `${baseURL}images/${id}` : null, fetcher);
}

export default useGetImage;