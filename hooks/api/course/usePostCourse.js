import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const postCourse = async (url, { arg }) => {
  const { courseId, newCourse } = arg; 
  try {
    const response = await axiosInstance.post(`${url}/${courseId}`, newCourse); 
    return response.data;
  } catch (error) {
    console.error("Error posting course:", error);
    throw error;
  }
};

const usePostCourse = () => {
  return useSWRMutation("courses", postCourse); 
};

export default usePostCourse;

