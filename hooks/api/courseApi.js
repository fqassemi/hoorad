// services/coursesApi.js

const API_URL = '/json/course.json'; 

export const postCourse = async (course) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json(); 
    } catch (error) {
      console.error('Error in postCourse:', error);
      throw error; 
    }
  };
  


export const getCourses = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
