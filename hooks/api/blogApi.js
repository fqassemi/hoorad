const API_BASE_URL = '/json/blog.json'; 


export const getBlogs = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Error fetching blogs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};


export const createBlog = async (blogData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      throw new Error('Error creating blog');
    }

    return await response.json(); 
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};


export const updateBlog = async (blogId, blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${blogId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      throw new Error('Error updating blog');
    }

    return await response.json(); 
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};


// export const deleteBlog = async (blogId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/${blogId}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       throw new Error('Error deleting blog');
//     }

//     return true; 
//   } catch (error) {
//     console.error('Error:', error);
//     return false;
//   }
// };
