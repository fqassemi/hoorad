import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = (url, data) => axiosInstance.patch(url, data.arg).then(res => res.data);

const useUnEnrollUser = () => useSWRMutation('user_edit', fetcher);

export default useUnEnrollUser;
