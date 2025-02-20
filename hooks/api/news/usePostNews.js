import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const postNews = async (url, { arg }) => {
  const { id,newNews } = arg;
  console.log(id);
  
  try {
    const response = await axiosInstance.post(`${url}/${id}`, newNews); 
    return response.data;
  } catch (error) {
    console.error("Error posting news:", error);
    throw error;
  }
};

const usePostNews = () => {
  return useSWRMutation("news", postNews);
};

export default usePostNews;