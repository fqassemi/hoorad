import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = (url, data) => axiosInstance.delete(url, data.arg).then(res => res.data);

const useDeleteCourse = () => useSWRMutation('courses', fetcher);

export default useDeleteCourse;