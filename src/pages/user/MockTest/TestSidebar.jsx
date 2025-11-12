import React from 'react';
import { Card } from 'react-bootstrap';
import { FaClock, FaStar } from 'react-icons/fa';

const TestSidebar = ({ toeicQuestions, answers, markedQuestions, currentQuestion, scrollToQuestion, timeRemaining, formatTime }) => {

    return (
        <div style={{ position: 'sticky', top: '20px' }}>
            <Card className='mb-3' style={{ backgroundColor: timeRemaining < 300 ? '#ffebee' : '#e3f2fd', border: timeRemaining < 300 ? '2px solid #dc8989ff' : '2px solid #8ea9c9ff' }}>
                <Card.Body style={{ padding: '25px', textAlign: 'center' }}>
                    <FaClock style={{ fontSize: '2.5rem', marginBottom: '10px', color: timeRemaining < 300 ? '#c62828' : '#1565C0' }} />
                    <h3 style={{ fontWeight: 'bold', color: timeRemaining < 300 ? '#c62828' : '#1565C0', marginBottom: '5px', fontSize: '2rem' }}>
                        {formatTime(timeRemaining)}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, fontWeight: '500' }}>
                        Thời gian còn lại
                    </p>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body style={{ padding: '20px' }}>
                    <h6 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '1.1rem' }}>
                        🔢 Bảng câu hỏi
                    </h6>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', maxHeight: '500px', overflowY: 'auto', padding: '5px' }}>
                        {toeicQuestions.map((question, index) => {
                            const questionNumber = question.displayId || (index + 1);
                            const isAnswered = !!answers[question.id];
                            const isMarked = markedQuestions.has(question.id);
                            const isCurrent = currentQuestion === question.id;

                            return (
                                <button
                                    key={question.id}
                                    onClick={() => scrollToQuestion(question.id)}
                                    style={{
                                        padding: '12px 8px',
                                        border: `2px solid ${isCurrent ? '#1565C0' : isAnswered ? '#4caf50' : '#dee2e6'}`,
                                        borderRadius: '8px',
                                        backgroundColor: isAnswered ? '#4caf50' : isCurrent ? '#e3f2fd' : 'white',
                                        color: isAnswered ? 'white' : '#333',
                                        fontWeight: isCurrent ? 'bold' : isAnswered ? '600' : 'normal',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'all 0.2s',
                                        fontSize: '0.95rem',
                                        boxShadow: isCurrent ? '0 2px 8px rgba(21, 101, 192, 0.3)' : 'none'
                                    }}
                                >
                                    {questionNumber}
                                    {isMarked && (
                                        <FaStar style={{ position: 'absolute', top: '-6px', right: '-6px', fontSize: '0.9rem', color: '#ffc107', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </Card.Body>

                <Card.Body style={{ padding: '15px 20px', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
                    <p style={{ fontSize: '0.85rem', margin: '5px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ display: 'inline-block', width: '18px', height: '18px', backgroundColor: '#4caf50', marginRight: '8px', borderRadius: '4px', border: '2px solid #4caf50' }}></span>
                        Đã trả lời
                    </p>
                    <p style={{ fontSize: '0.85rem', margin: '5px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ display: 'inline-block', width: '18px', height: '18px', backgroundColor: 'white', marginRight: '8px', borderRadius: '4px', border: '2px solid #dee2e6' }}></span>
                        Chưa trả lời
                    </p>
                    <p style={{ fontSize: '0.85rem', margin: '5px 0', display: 'flex', alignItems: 'center' }}>
                        <FaStar style={{ color: '#ffc107', marginRight: '8px', fontSize: '1rem' }} />
                        Đánh dấu xem lại
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TestSidebar;