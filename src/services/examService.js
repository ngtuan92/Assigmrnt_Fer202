const API_BASE_URL = 'http://localhost:9999';

export const examService = {
    // Lấy thông tin exam
    getExamById: async (examId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/exams/${examId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch exam');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching exam:', error);
            throw error;
        }
    },

    // Cập nhật số người thi
    updateLearnerCount: async (examId) => {
        try {
            // Lấy thông tin exam hiện tại
            const exam = await examService.getExamById(examId);

            // Tăng số lượng learners lên 1
            const updatedExam = {
                ...exam,
                learners: (exam.learners || 0) + 1
            };

            // Cập nhật lại vào database
            const response = await fetch(`${API_BASE_URL}/exams/${examId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedExam)
            });

            if (!response.ok) {
                throw new Error('Failed to update learner count');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating learner count:', error);
            throw error;
        }
    },

    // Lấy tất cả exams
    getAllExams: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/exams`);
            if (!response.ok) {
                throw new Error('Failed to fetch exams');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching exams:', error);
            throw error;
        }
    }
};