import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = (url, data) => axiosInstance.post(url, data.arg).then(res => res.data);

const useVerificationCode = () => useSWRMutation('verify', fetcher);

export default useVerificationCode;
