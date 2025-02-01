import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};


const ACCESS_TOKEN = getCookie('courses_accessToken');
console.log(ACCESS_TOKEN);

const authHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',    
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});


export const getBlogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}blogs`, authHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error.response?.data || error.message);
    throw new Error('Failed to fetch blogs');
  }
};

export const createBlog = async (blogData) => {
  try {
    const newBlog = {
      id: blogData.id,
      title: blogData.title,
      plainText: blogData.plainText,
      html: blogData.html,
      previewImage: blogData.previewImage ? URL.createObjectURL(blogData.previewImage) : null,
      issuedDate: blogData.issuedDate || new Date().toISOString(),
      author: blogData.author,
    };

    const response = await axios.post(`${API_BASE_URL}blogs/${blogData.id}`, newBlog, authHeaders());

    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error.response?.data || error.message);
    throw new Error('Failed to create blog');
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const updatedBlog = {
      id: blogData.id,
      title: blogData.title,
      plainText: blogData.plainText,
      html: blogData.html,
      previewImage: blogData.previewImage ? URL.createObjectURL(blogData.previewImage) : null,
      issuedDate: blogData.issuedDate || new Date().toISOString(),
      author: blogData.author,
    };

    const response = await axios.patch(`${API_BASE_URL}blogs/${blogData.id}`, updatedBlog, authHeaders());

    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error.response?.data || error.message);
    throw new Error('Failed to update blog');
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}blogs/${id}`, authHeaders());
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error.response?.data || error.message);
    throw new Error('Failed to delete blog');
  }
};
