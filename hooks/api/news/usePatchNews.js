import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const patchNews = async (url, { arg }) => {
  const { id, updatedNews } = arg; 
  try {
    const response = await axiosInstance.patch(`${url}/${id}`, updatedNews); 
    return response.data;
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

const usePatchNews = () => {
  return useSWRMutation("news", patchNews);
};

export default usePatchNews;