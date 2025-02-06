import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const patchBlog = async (url, { arg }) => {
  const { blogId, updatedBlog } = arg;
  try {
    const response = await axiosInstance.patch(`${url}/${blogId}`, updatedBlog); 
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

const usePatchBlog = () => {
  return useSWRMutation("blogs", patchBlog); 
};

export default usePatchBlog;