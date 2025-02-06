import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const postBlog = async (url, { arg }) => {
  const { blogId, newBlog } = arg; 
  try {
    const response = await axiosInstance.post(`${url}/${blogId}`, newBlog); 
    return response.data;
  } catch (error) {
    console.error("Error posting blog:", error);
    throw error;
  }
};

const usePostBlog = () => {
  return useSWRMutation("blogs", postBlog); 
};

export default usePostBlog;

// ok