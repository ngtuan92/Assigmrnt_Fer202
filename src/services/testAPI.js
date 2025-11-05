import axios from 'axios';

import { API_URL} from '../config';
export const getQuizzes = async () => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`);
    console.log('List quizzes:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error quizzes:', error);
    throw error;
  }
};

export const getQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/${quizId}`);
    console.log('Quiz detail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

export default getQuizzes;