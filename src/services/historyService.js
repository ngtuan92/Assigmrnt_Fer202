// Service quản lý lịch sử làm bài
export const historyService = {
    // Lưu kết quả thi vào localStorage
    saveTestHistory: (testResult) => {
        try {
            const existingHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');

            const newHistoryItem = {
                id: Date.now(), 
                quizId: testResult.quizId,
                quizName: testResult.quizName || `Practice ${testResult.quizId}`,
                type: testResult.type, 
                score: testResult.score,
                totalQuestions: testResult.totalQuestions,
                correctAnswers: testResult.correctAnswers,
                timeSpent: testResult.timeSpent,
                dateTaken: new Date().toISOString(),
                answers: testResult.answers || {},
                questions: testResult.questions || []
            };

            existingHistory.unshift(newHistoryItem);

            if (existingHistory.length > 50) {
                existingHistory.splice(50);
            }

            localStorage.setItem('testHistory', JSON.stringify(existingHistory));

            this.updateUserStats();

            return newHistoryItem;
        } catch (error) {
            console.error('Error saving test history:', error);
            return null;
        }
    },

    getTestHistory: () => {
        try {
            return JSON.parse(localStorage.getItem('testHistory') || '[]');
        } catch (error) {
            console.error('Error getting test history:', error);
            return [];
        }
    },

    getHistoryByType: (type) => {
        const history = historyService.getTestHistory();
        return history.filter(item => item.type === type);
    },

    // Lấy thống kê tổng quát
    getStats: () => {
        const history = historyService.getTestHistory();

        if (history.length === 0) {
            return {
                totalTests: 0,
                totalScore: 0,
                avgScore: 0,
                bestScore: 0,
                listeningTests: 0,
                readingTests: 0,
                fullTests: 0
            };
        }

        const totalScore = history.reduce((sum, item) => sum + item.score, 0);
        const scores = history.map(item => item.score);

        return {
            totalTests: history.length,
            totalScore,
            avgScore: Math.round(totalScore / history.length),
            bestScore: Math.max(...scores),
            listeningTests: history.filter(item => item.type === 'LISTENING').length,
            readingTests: history.filter(item => item.type === 'READING').length,
            fullTests: history.filter(item => item.type === 'FULL').length,
            recentTests: history.slice(0, 10) // 10 bài gần nhất
        };
    },

    // Xóa lịch sử
    clearHistory: () => {
        localStorage.removeItem('testHistory');
        historyService.updateUserStats();
    },

    // Xóa một bài cụ thể
    deleteTest: (testId) => {
        try {
            const history = historyService.getTestHistory();
            const updatedHistory = history.filter(item => item.id !== testId);
            localStorage.setItem('testHistory', JSON.stringify(updatedHistory));
            historyService.updateUserStats();
            return true;
        } catch (error) {
            console.error('Error deleting test:', error);
            return false;
        }
    },

    // Cập nhật thống kê user
    updateUserStats: () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const stats = historyService.getStats();

            // Cập nhật user data với thống kê mới
            const updatedUser = {
                ...user,
                quizzesTaken: historyService.getTestHistory(),
                totalScore: stats.totalScore,
                avgScore: stats.avgScore,
                bestScore: stats.bestScore,
                totalTests: stats.totalTests
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error updating user stats:', error);
        }
    },

    // Tính điểm TOEIC từ số câu đúng (ước tính)
    calculateToeicScore: (correctAnswers, totalQuestions, type) => {
        if (totalQuestions === 0) return 0;

        const percentage = correctAnswers / totalQuestions;

        // Ước tính điểm TOEIC dựa trên phần trăm
        if (type === 'LISTENING' || type === 'READING') {
            // Mỗi phần tối đa 495 điểm
            return Math.round(percentage * 495);
        } else {
            // Full test tối đa 990 điểm
            return Math.round(percentage * 990);
        }
    }
};