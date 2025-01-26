import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/blogs';

export const getBlogs = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw new Error('Failed to fetch blogs');
  }
};

export const createBlog = async (blogData) => {
  try {
    const newBlog = {
      id : blogData.id,
      title: blogData.title,
      plainText : blogData.plainText,
      html : blogData.html,
      previewImage: blogData.previewImage ? URL.createObjectURL(blogData.previewImage) : null,
      issuedDate: blogData.issuedDate || new Date().toISOString(),
    };

    const response = await axios.post(API_BASE_URL, newBlog, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data; 
  } catch (error) {
    console.error('Error creating blog:', error.response?.data || error.message);
    throw new Error('Failed to create blog');
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const updatedBlog = {
      id : blogData.id,
      title: blogData.title,
      plainText : blogData.plainText,
      html : blogData.html,
      previewImage: blogData.previewImage ? URL.createObjectURL(blogData.previewImage) : null,
      issuedDate: blogData.issuedDate || new Date().toISOString(),
    };

    const response = await axios.put(`${API_BASE_URL}/${id}`, updatedBlog, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error.response?.data || error.message);
    throw new Error('Failed to update blog');
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw new Error('Failed to delete blog');
  }
};