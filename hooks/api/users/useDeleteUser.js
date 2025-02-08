import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/axiosInstance';

const deleteUser = async (url, { arg }) => {
  const { phoneNumber, accessToken } = arg;
  try {
    const response = await axiosInstance.delete(`${url}/${phoneNumber}`, {
      data: { access_token: accessToken },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const useDeleteUser = () => {
  return useSWRMutation('users', deleteUser);
};

export default useDeleteUser;
