import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/axiosInstance';

const deleteBlog = async (url, { arg }) => {
    const { id } = arg; 
    console.log(id); 
    try {
      const response = await axiosInstance.delete(`${url}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting Blog:', error);
      throw error;
    }
  };

const useDeleteBlog = () => {
  return useSWRMutation('blogs', deleteBlog);
};

export default useDeleteBlog;
