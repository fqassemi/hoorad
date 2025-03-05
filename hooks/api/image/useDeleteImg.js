import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/axiosInstance';

const deleteImage = async (url, { arg }) => {
  const { id } = arg;

  const cleanedId = id.replace('/images/', '');
  
  try {
    const response = await axiosInstance.delete(`${url}/${cleanedId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

const useDeleteImage = () => {
  return useSWRMutation('images', deleteImage);
};

export default useDeleteImage;
