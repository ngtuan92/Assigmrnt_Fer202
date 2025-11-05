import axios from 'axios';

import { API_URL} from '../config';
export const getExams = async () => {
  try {
    const response = await axios.get(`${API_URL}/exams`);
    console.log('List exams:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error exams:', error);
    throw error;
  }
};

export default getExams;