import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const patchAbout = async (url, { arg }) => {
  const { info, updatedInfo } = arg; 
  
  try {
    const response = await axiosInstance.patch(`url`, updatedInfo); 
    return response.data;
  } catch (error) {
    console.error("Error patching course:", error);
    throw error;
  }
};

const usePatchAbout = () => {
  return useSWRMutation("about-me", patchAbout); 
};

export default usePatchAbout;