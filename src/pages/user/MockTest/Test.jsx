import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import MainLayout from '../../../layouts/user/MainLayout';
import PopupSubmitTest from '../../../components/user/popupSubmitTest';
import TestResultModal from '../../../components/user/TestResultModal';
import TestContent from './TestContent';
import TestSidebar from './TestSidebar';
import { getQuizById } from '../../../services/testAPI';
import { historyService } from '../../../services/historyService';
import { examService } from '../../../services/examService';

const Test = () => {
    const { type, quizId } = useParams();
    const navigate = useNavigate();
    const initialPart = (type && type.toLowerCase() === 'listening') ? 'LISTENING' : 'READING';

    const [partSelected, setPartSelected] = useState(initialPart);
    const [answers, setAnswers] = useState({});
    const [markedQuestions, setMarkedQuestions] = useState(new Set());
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [hasUpdatedLearnerCount, setHasUpdatedLearnerCount] = useState(false);

    const [quizData, setQuizData] = useState(null);
    const [readingQuestions, setReadingQuestions] = useState([]);
    const [listeningQuestions, setListeningQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lưu thời gian bắt đầu
        setStartTime(new Date());

        const fetchQuizData = async () => {
            try {
                setLoading(true);

                // Kiểm tra nếu quizId không tồn tại
                if (!quizId) {
                    console.error('quizId is missing from URL');
                    navigate('/mock-test');
                    return;
                }

                const data = await getQuizById(quizId);
                setQuizData(data);

                const readingSection = data.sections?.find(s => s.sectionId === 'reading');
                const listeningSection = data.sections?.find(s => s.sectionId === 'listening');

                if (readingSection) {
                    const readingQs = [
                        ...(readingSection.question || []),
                        ...(readingSection.groups || []).flatMap(group =>
                            (group.questions || []).map(q => ({ ...q, groupId: group.groupId }))
                        )
                    ];
                    setReadingQuestions(readingQs);
                } else {
                    setReadingQuestions([]);
                }

                if (listeningSection) {
                    const listeningQs = (listeningSection.groups || []).flatMap(group =>
                        (group.question || []).map(q => ({
                            ...q,
                            groupId: group.id,
                            directions: group.directions
                        }))
                    );
                    setListeningQuestions(listeningQs);
                } else {
                    setListeningQuestions([]);
                }

                const duration = partSelected === 'LISTENING' ? 75 : 45;
                setTimeRemaining(duration * 60);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching quiz:', error);
                setReadingQuestions([]);
                setListeningQuestions([]);
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [quizId, partSelected, navigate]);

    useEffect(() => {
        if (partSelected === 'LISTENING' && listeningQuestions.length > 0) {
            setCurrentQuestion(listeningQuestions[0].id);
        } else if (partSelected === 'READING' && readingQuestions.length > 0) {
            setCurrentQuestion(readingQuestions[0].id);
        }
    }, [partSelected, listeningQuestions, readingQuestions]);

    useEffect(() => {
        if (isSubmitted || loading) return;
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleConfirmSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isSubmitted, loading]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const ss = s % 60;
        return `${m}:${ss.toString().padStart(2, '0')}`;
    };

    const getTimeSpent = () => {
        if (!startTime) return '0:00';
        const endTime = new Date();
        const diffInSeconds = Math.floor((endTime - startTime) / 1000);
        return formatTime(diffInSeconds);
    };

    const handleAnswerSelect = (questionId, optionId) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const toggleMarkQuestion = (questionId) => {
        setMarkedQuestions(prev => {
            const next = new Set(prev);
            if (next.has(questionId)) next.delete(questionId);
            else next.add(questionId);
            return next;
        });
    };

    const requestSubmit = () => setShowConfirm(true);

    const handleConfirmSubmit = () => {
        setIsSubmitted(true);
        setShowConfirm(false);
        setShowResult(true); // Hiển thị popup kết quả

        // Lưu lịch sử thi
        saveTestResult();
    }; const cancelSubmit = () => setShowConfirm(false);

    const calculateScore = () => {
        let correct = 0;
        const questions = partSelected === 'LISTENING' ? listeningQuestions : readingQuestions;

        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    const getAnswerStatus = (questionId, optionId) => {
        if (!isSubmitted) return '';

        const questions = partSelected === 'LISTENING' ? listeningQuestions : readingQuestions;
        const q = questions.find(x => x.id === questionId);
        if (!q) return '';

        const userAnswer = answers[questionId];
        if (optionId === q.correctAnswer) return 'correct';
        if (userAnswer === optionId && userAnswer !== q.correctAnswer) return 'incorrect';
        return '';
    };

    const scrollToQuestion = (questionId) => {
        setCurrentQuestion(questionId);
        const el = document.getElementById(`question-${questionId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleCloseResult = () => {
        setShowResult(false);
        // Có thể redirect về trang chủ hoặc làm gì đó khác
        // navigate('/mock-test');
    };

    const saveTestResult = () => {
        try {
            const score = calculateScore();
            const questions = partSelected === 'LISTENING' ? listeningQuestions : readingQuestions;
            const totalQuestions = questions.length;

            // Tính điểm TOEIC
            const toeicScore = historyService.calculateToeicScore(score, totalQuestions, partSelected);

            const testResult = {
                quizId: quizId,
                quizName: quizData?.title || `Practice ${quizId}`,
                type: partSelected, // 'LISTENING' hoặc 'READING'
                score: toeicScore, // Điểm TOEIC đã tính
                totalQuestions: totalQuestions,
                correctAnswers: score, // Số câu đúng
                timeSpent: getTimeSpent(),
                answers: answers,
                questions: questions
            };

            historyService.saveTestHistory(testResult);
            console.log('Test result saved:', testResult);
        } catch (error) {
            console.error('Error saving test result:', error);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Container className="my-5 text-center">
                    <h3>Đang tải đề thi...</h3>
                </Container>
            </MainLayout>
        );
    }

    const testInfo = {
        part: partSelected,
        partName: partSelected === 'LISTENING' ? 'LISTENING SECTION' : 'READING SECTION',
        totalQuestions: partSelected === 'LISTENING' ? listeningQuestions.length : readingQuestions.length,
        timeLimit: partSelected === 'LISTENING' ? 75 : 45,
        instructions: partSelected === 'LISTENING'
            ? quizData?.sections.find(s => s.sectionId === 'listening')?.description || ''
            : 'Read each question carefully and choose the best answer.'
    };

    const audioSrc = quizData?.sections.find(s => s.sectionId === 'listening')?.audio || '/assets/audio/listening-1.mp3';

    return (
        <MainLayout>
            <Container className='my-5'>
                <Row>
                    <Col lg={8} md={7}>
                        <TestContent
                            testInfo={testInfo}
                            toeicQuestions={readingQuestions}
                            listeningQuestions={listeningQuestions}
                            audioSrc={audioSrc}
                            partSelected={partSelected}
                            answers={answers}
                            handleAnswerSelect={handleAnswerSelect}
                            markedQuestions={markedQuestions}
                            toggleMarkQuestion={toggleMarkQuestion}
                            currentQuestion={currentQuestion}
                            setCurrentQuestion={setCurrentQuestion}
                            isSubmitted={isSubmitted}
                            requestSubmit={requestSubmit}
                            calculateScore={calculateScore}
                            getAnswerStatus={getAnswerStatus}
                        />
                    </Col>

                    <Col lg={4} md={5}>
                        <TestSidebar
                            toeicQuestions={partSelected === 'LISTENING' ? listeningQuestions : readingQuestions}
                            answers={answers}
                            markedQuestions={markedQuestions}
                            currentQuestion={currentQuestion}
                            scrollToQuestion={scrollToQuestion}
                            timeRemaining={timeRemaining}
                            formatTime={formatTime}
                        />
                    </Col>
                </Row>
            </Container>

            <PopupSubmitTest
                show={showConfirm}
                onConfirm={handleConfirmSubmit}
                onClose={cancelSubmit}
                answersCount={Object.keys(answers).length}
                totalQuestions={readingQuestions.length + listeningQuestions.length}
            />

            {/* Popup hiển thị kết quả */}
            <TestResultModal
                show={showResult}
                onClose={handleCloseResult}
                score={calculateScore()}
                totalQuestions={partSelected === 'LISTENING' ? listeningQuestions.length : readingQuestions.length}
                timeSpent={getTimeSpent()}
                partSelected={partSelected}
            />
        </MainLayout>
    );
};

export default Test;
