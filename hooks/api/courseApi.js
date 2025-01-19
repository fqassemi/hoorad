import axios from 'axios';

const API_URL = 'http://localhost:3001/courses';

export const postCourse = async (course) => {
  try {
    const newCourse = {
      title: course.title,
      description: course.description,
      previewImage: course.previewImage ? URL.createObjectURL(course.previewImage) : null,
      price: course.price,
      isfree :course.isfree,
      files: course.files,
      issuedDate: course.issuedDate || new Date().toISOString(),
    };

    const response = await axios.post(API_URL, newCourse, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating course:', error.response?.data || error.message);
    throw new Error('Failed to create course');
  }
};

export const getCourses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw new Error('Failed to fetch blogs');
  }
};

export const updateCourse = async (id, course) => {
  try {
    const updatedCourse = {
      title: course.title,
      description: course.description,
      previewImage: course.previewImage ? URL.createObjectURL(course.previewImage) : null,
      price: course.price,
      issuedDate: course.issuedDate || new Date().toISOString(),
    };

    const response = await axios.put(`${API_URL}/${id}`, updatedCourse, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data; // Return the updated blog data
  } catch (error) {
    console.error('Error updating blog:', error.response?.data || error.message);
    throw new Error('Failed to update blog');
  }
};


// Delete a blog (if needed in the future)
export const deleteCourse = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data; // Assuming the API returns a success message
  } catch (error) {
    console.error('Error deleting course:', error);
    throw new Error('Failed to delete course');
  }
};
