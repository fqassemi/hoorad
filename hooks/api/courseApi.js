import axios from 'axios';

const API_URL = 'http://localhost:3001/courses';

const transformSessions = (sessions) =>
  sessions.map((session) => ({
    title: session.title,
    videoFile: session.video ? URL.createObjectURL(session.video) : null,
    codeFile: session.codeFile ? URL.createObjectURL(session.codeFile) : null,
  }));

export const postCourse = async (course) => {
  try {
    const sessions = transformSessions(course.sessions || []);

    const newCourse = {
      title: course.title,
      description: course.description,
      previewImage: course.previewImage ? URL.createObjectURL(course.previewImage) : null,
      price: course.price,
      isFree: course.isFree,
      sessions: sessions,
      issuedDate: course.issuedDate || new Date().toISOString(),
    };

    const postResponse = await axios.post(API_URL, newCourse, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Revoke object URLs to free memory
    if (course.previewImage) URL.revokeObjectURL(newCourse.previewImage);
    newCourse.sessions.forEach((session) => {
      if (session.videoFile) URL.revokeObjectURL(session.videoFile);
      if (session.codeFile) URL.revokeObjectURL(session.codeFile);
    });

    return postResponse.data;
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
    console.error('Error fetching course:', error);
    throw new Error('Failed to fetch course');
  }
};

export const updateCourse = async (id, course) => {
  try {
    
    const sessions = course.sessions ? transformSessions(course.sessions) : [];

    const updatedCourse = {
      title: course.title,
      description: course.description,
      previewImage: course.previewImage || null, 
      sessions: sessions,  // Make sure transformed sessions are passed
      price: course.price,
      issuedDate: course.issuedDate || new Date().toISOString(),
    };

    const response = await axios.put(`${API_URL}/${id}`, updatedCourse, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating course:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update course');
  }
};


// Delete a blog (if needed in the future)
export const deleteCourse = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw new Error('Failed to delete course');
  }
};
