import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const postImage = async (url, { arg }) => {
  const { imageId, newImage } = arg; 
  try {
    const response = await axiosInstance.post(`${url}/${imageId}`, newImage); 
    return response.data;
  } catch (error) {
    console.error("Error posting Image:", error);
    throw error;
  }
};

const usePostImage = () => {
  return useSWRMutation("images", postImage); 
};

export default usePostImage;