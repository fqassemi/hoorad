import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/blogs';

export const getBlogs = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data; // Assuming the API returns the blog list in `data`
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw new Error('Failed to fetch blogs');
  }
};

// Create a new blog
export const createBlog = async (blogData) => {
  try {
    const newBlog = {
      title: blogData.title,
      description: blogData.description,
      previewImage: blogData.previewImage ? URL.createObjectURL(blogData.previewImage) : null,
      subtitles: blogData.subtitles || [],
      includeConclusion: blogData.includeConclusion || false,
      issuedDate: blogData.issuedDate || new Date().toISOString(),
      conclusion: blogData.includeConclusion ? blogData.conclusion : '',
    };

    const response = await axios.post(API_BASE_URL, newBlog, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data; // Return the created blog data
  } catch (error) {
    console.error('Error creating blog:', error.response?.data || error.message);
    throw new Error('Failed to create blog');
  }
};


// Update an existing blog
export const updateBlog = async (id, blogData) => {
  try {
    const updatedBlog = {
      title: blogData.title,
      description: blogData.description,
      previewImage: blogData.previewImage ? URL.createObjectURL(blogData.previewImage) : null,
      subtitles: blogData.subtitles || [],
      includeConclusion: blogData.includeConclusion || false,
      issuedDate: blogData.issuedDate || new Date().toISOString(),
      conclusion: blogData.includeConclusion ? blogData.conclusion : '',
    };

    const response = await axios.put(`${API_BASE_URL}/${id}`, updatedBlog, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data; // Return the updated blog data
  } catch (error) {
    console.error('Error updating blog:', error.response?.data || error.message);
    throw new Error('Failed to update blog');
  }
};


// Delete a blog (if needed in the future)
export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data; // Assuming the API returns a success message
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw new Error('Failed to delete blog');
  }
};