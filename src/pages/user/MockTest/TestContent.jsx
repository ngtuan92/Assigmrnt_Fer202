import React, { useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaStar, FaRegStar, FaCheckCircle } from 'react-icons/fa';
import ListeningSection from './ListeningSection';
import ReadingSection from './ReadingSection';

const TestContent = ({
    testInfo,
    toeicQuestions,
    listeningQuestions,
    audioSrc,
    partSelected,
    answers,
    handleAnswerSelect,
    markedQuestions,
    toggleMarkQuestion,
    currentQuestion,
    setCurrentQuestion,
    isSubmitted,
    requestSubmit,
    calculateScore,
    getAnswerStatus,
}) => {
    const audioRef = useRef(null);
    return (
        <>
            <Card className="test-card" bg="light">
                <div
                    className='d-flex justify-content-center fw-bold py-3'
                 
                >
                    <div style={{ position: 'absolute', bottom: 0, width: '95%', borderBottom: '1px solid #c7c7c7ff' }}></div>
                    {testInfo.title}
                </div>

                <Card.Body style={{ marginBottom: '20px', position: 'relative' }}>
                    <p className='mb-2' style={{ color: '#000000ff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {testInfo.part}: {testInfo.partName}
                    </p>
                    <p style={{ color: '#000000ff', fontSize: '0.95rem', marginBottom: '10px' }}>
                        {partSelected === 'LISTENING'
                            ? `In the Listening test, you will listen to conversations and talks and answer several different types of listening comprehension questions. The entire Listening test will last ${testInfo.timeLimit} minutes. There are four parts, and directions are given for each part. You are encouraged to answer as many questions as possible within the time allowed.`
                            : `In the Reading test, you will read a variety of texts and answer several different types of reading comprehension questions. The entire Reading test will last ${testInfo.timeLimit} minutes. There are three parts, and directions are given for each part. You are encouraged to answer as many questions as possible within the time allowed.`
                        }
                    </p>
                    <p style={{ color: '#000000ff', fontSize: '0.95rem', marginBottom: '10px' }}>
                        You must mark your answers on the separate answer sheet. Do not write your answers in your test book.
                    </p>
                    <p className='mb-2' style={{ fontWeight: 'bold' }}>Directions:</p>
                    <p style={{ fontSize: '0.95rem' }}>{testInfo.instructions}</p>
                    <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '95%', borderBottom: '1px solid #c7c7c7ff' }}></div>

                </Card.Body>

                {partSelected === 'LISTENING' ? (
                
                        <ListeningSection
                            audioRef={audioRef}
                            audioSrc={audioSrc}
                            listeningQuestions={listeningQuestions}
                            answers={answers}
                            handleAnswerSelect={handleAnswerSelect}
                            markedQuestions={markedQuestions}
                            toggleMarkQuestion={toggleMarkQuestion}
                            currentQuestion={currentQuestion}
                            setCurrentQuestion={setCurrentQuestion}
                            isSubmitted={isSubmitted}
                        />
                   
                ) : (
                    <ReadingSection
                        readingQuestions={toeicQuestions}
                        answers={answers}
                        handleAnswerSelect={handleAnswerSelect}
                        markedQuestions={markedQuestions}
                        toggleMarkQuestion={toggleMarkQuestion}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        isSubmitted={isSubmitted}
                        getAnswerStatus={getAnswerStatus}
                    />
                )}

                {!isSubmitted && (
                    <Card.Body className='text-center py-4'>
                        <Button variant="primary" size="lg" onClick={requestSubmit} style={{ padding: '12px 50px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                            NỘP BÀI
                        </Button>
                    </Card.Body>
                )}

                {isSubmitted && (
                    <Card.Body className='text-center' style={{ backgroundColor: '#e8f5e9', padding: '40px 20px', borderTop: '3px solid #4caf50' }}>
                        <h3 style={{ color: '#2e7d32', marginBottom: '20px', fontWeight: 'bold' }}>🎉 Hoàn thành bài thi!</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1b5e20', marginBottom: '10px' }}>
                            {calculateScore()}/{partSelected === 'LISTENING' ? listeningQuestions.length : toeicQuestions.length}
                        </div>
                        <p style={{ fontSize: '1.2rem', color: '#2e7d32', marginBottom: '10px' }}>
                            Tỷ lệ đúng: <strong>{((calculateScore() / (partSelected === 'LISTENING' ? listeningQuestions.length : toeicQuestions.length)) * 100).toFixed(1)}%</strong>
                        </p>
                        <p style={{ fontSize: '0.95rem', color: '#666' }}>
                            Xem lại các câu hỏi bên trên để hiểu rõ hơn về đáp án
                        </p>
                    </Card.Body>
                )}
            </Card>
        </>
    );
};

export default TestContent;