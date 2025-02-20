import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const deleteNews = async (url, { arg }) => {
  const { id } = arg; 
  try {
    const response = await axiosInstance.delete(`${url}/${id}`); 
    return response.data;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};

const useDeleteNews = () => {
  return useSWRMutation("news", deleteNews);
};

export default useDeleteNews;