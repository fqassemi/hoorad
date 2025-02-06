import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = "http://localhost:3001/courses";
const ACCESS_TOKEN = Cookies.get('courses_accessToken');


const authHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

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
      id: course.id,
      description: course.description,
      previewImage: course.previewImage ? URL.createObjectURL(course.previewImage) : null,
      price: course.price,
      isFree: course.isFree,
      sessions: sessions,
      issuedDate: course.issuedDate || new Date().toISOString(),
    };

    const postResponse = await axios.post(`${API_URL}courses/${course.id}`, newCourse, authHeaders());

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
    const response = await axios.get(`${API_URL}`, authHeaders()); 
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw new Error('Failed to fetch course');
  }
};

export const updateCourse = async (course, id) => {
  try {
    const sessions = course.sessions ? transformSessions(course.sessions) : [];

    const updatedCourse = {
      title: course.title,
      id: course.id,
      description: course.description,
      previewImage: course.previewImage || null,
      sessions: sessions,
      price: course.price,
      issuedDate: course.issuedDate || new Date().toISOString(),
    };

    
    const response = await axios.patch(
      `${API_URL}course/${course.id}`,
      updatedCourse,
      authHeaders() 
    );

    return response.data;
  } catch (error) {
    console.error('Error updating course:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update course');
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}course/${id}`, authHeaders()); 
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw new Error('Failed to delete course');
  }
};
