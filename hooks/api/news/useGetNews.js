import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

const useGetNews = () => {
    const { data, error, isLoading, mutate } = useSWR('news', fetcher);

    const sortedData = data
        ? data.sort((a, b) => {
            const dateComparison = new Date(a.issuedDate) - new Date(b.issuedDate);
            if (dateComparison === 0) {
                return new Date(a.createdAt) - new Date(b.createdAt); 
            }
            return dateComparison;
        })
        : null;

    return {
        data: sortedData,
        error,
        isLoading,
        mutate,
    };
};

export default useGetNews;