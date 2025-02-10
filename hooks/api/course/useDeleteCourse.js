import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/axiosInstance';

const deleteCourse = async (url, { arg }) => {
  const { id } = arg;
  
  try {
    const response = await axiosInstance.delete(`${url}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

const useDeleteCourse = () => {
  return useSWRMutation('courses', deleteCourse);
};

export default useDeleteCourse;
