import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const patchCourse = async (url, { arg }) => {
  const { courseId, updatedCourse } = arg; 
  console.log(updatedCourse);
  
  try {
    const response = await axiosInstance.patch(`${url}/${courseId}`, updatedCourse); 
    return response.data;
  } catch (error) {
    console.error("Error patching course:", error);
    throw error;
  }
};

const usePatchCourse = () => {
  return useSWRMutation("courses", patchCourse); 
};

export default usePatchCourse;