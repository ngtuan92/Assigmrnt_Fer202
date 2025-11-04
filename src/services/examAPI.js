import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

export const getExams = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/exams`);
    console.log('List exams:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error exams:', error);
    throw error;
  }
};

export default getExams;