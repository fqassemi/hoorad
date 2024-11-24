import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = (url, data) => axiosInstance.patch(url, data.arg).then(res => res.data);

const useEditInfo = () => useSWRMutation('user_edit', fetcher);

export default useEditInfo;
