import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axiosInstance";

const postNews = async (url, { arg }) => {
  const { id, newNews } = arg;
  try {
    const newsWithTimestamp = {
      ...newNews,
      createdAt: new Date().toISOString(), 
    };
    const response = await axiosInstance.post(`${url}/${id}`, newsWithTimestamp);
    const updatedNewsResponse = await axiosInstance.get(url);
    let updatedNews = updatedNewsResponse.data;
    updatedNews.sort((a, b) => {
      const dateComparison = new Date(a.issuedDate) - new Date(b.issuedDate);
      if (dateComparison === 0) {
        return new Date(a.createdAt) - new Date(b.createdAt); 
      }
      return dateComparison;
    });

    return updatedNews;
  } catch (error) {
    console.error("Error posting news:", error);
    throw error;
  }
};

const usePostNews = () => {
  return useSWRMutation("news", postNews);
};

export default usePostNews;