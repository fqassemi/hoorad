import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const patchAbout = async (url, { arg }) => {
  const { updatedInfo } = arg;

  try {
    const response = await axiosInstance.patch(url, updatedInfo);
    return response.data;
  } catch (error) {
    console.error("Error patching about-me:", error);
    throw error;
  }
};

const usePatchAbout = () => {
  return useSWRMutation("about-me", patchAbout);
};

export default usePatchAbout;