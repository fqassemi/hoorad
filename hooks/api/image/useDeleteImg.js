import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/axiosInstance';

const deleteImage = async (url, { arg }) => {
  const { id } = arg;

  console.log(url, {id});
  const cleanedId = id.replace('/images/', '');

  console.log('Cleaned ID:', cleanedId)
  
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
