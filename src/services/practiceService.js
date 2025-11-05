import axios from 'axios';

const API_URL = 'http://localhost:9999';

export const practiceService = {
  async fetchPractices() {
    const [examsRes, quizzesRes] = await Promise.all([
      axios.get(`${API_URL}/exams`),
      axios.get(`${API_URL}/quizzes`)
    ]);
    
    return examsRes.data.map(exam => {
      const quiz = quizzesRes.data.find(q => q.id === exam.id);
      const readingSection = quiz?.sections?.find(s => s.sectionId === 'reading');
      const listeningSection = quiz?.sections?.find(s => s.sectionId === 'listening');
      
      return {
        ...exam,
        readingCount: readingSection?.groups?.length || 0,
        listeningCount: listeningSection?.groups?.length || 0
      };
    });
  },

  async createPractice(data) {
    const examRes = await axios.post(`${API_URL}/exams`, {
      ...data,
      learners: 0
    });
    
    // Tạo quiz ngay sau khi tạo exam
    await axios.post(`${API_URL}/quizzes`, {
      id: examRes.data.id,
      createBy: 2,
      createAt: new Date().toISOString().slice(0, 10),
      sections: [
        { 
          sectionId: 'reading', 
          title: 'Reading Comprehension', 
          totalQuestions: 0, 
          question: [], 
          groups: [] 
        },
        { 
          sectionId: 'listening', 
          title: 'Listening Comprehension', 
          totalQuestions: 0, 
          description: '', 
          audio: '', 
          groups: [] 
        }
      ]
    });

    return examRes.data;
  },

  async updatePractice(id, data) {
    await axios.patch(`${API_URL}/exams/${id}`, data);
  },

  async deletePractice(id) {
    await Promise.all([
      axios.delete(`${API_URL}/exams/${id}`),
      axios.delete(`${API_URL}/quizzes/${id}`)
    ]);
  },

  async getQuiz(id) {
    try {
      const res = await axios.get(`${API_URL}/quizzes/${id}`);
      return res.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Quiz chưa tồn tại, tạo skeleton
        const skeletonQuiz = {
          id,
          createBy: 2,
          createAt: new Date().toISOString().slice(0, 10),
          sections: [
            { 
              sectionId: 'reading', 
              title: 'Reading Comprehension', 
              totalQuestions: 0, 
              question: [], 
              groups: [] 
            },
            { 
              sectionId: 'listening', 
              title: 'Listening Comprehension', 
              totalQuestions: 0, 
              description: '', 
              audio: '', 
              groups: [] 
            }
          ]
        };

        // Tạo quiz trong database
        try {
          await axios.post(`${API_URL}/quizzes`, skeletonQuiz);
        } catch (e) {
          console.error('Không thể tạo quiz:', e);
        }

        return skeletonQuiz;
      }
      throw error;
    }
  },

  async updateQuiz(id, data) {
    try {
      // Thử update trước
      await axios.put(`${API_URL}/quizzes/${id}`, data);
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          await axios.post(`${API_URL}/quizzes`, { ...data, id });
        } catch (createError) {
          console.error('Không thể tạo quiz:', createError);
          throw createError;
        }
      } else {
        throw error;
      }
    }
  }
};
