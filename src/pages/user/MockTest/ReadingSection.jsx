import React from 'react';
import { Card, Form, Alert } from 'react-bootstrap';
import { FaStar, FaRegStar, FaCheck, FaTimes } from 'react-icons/fa';

const ReadingSection = ({
    readingQuestions,
    markedQuestions,
    toggleMarkQuestion,
    handleAnswerSelect,
    answers,
    isSubmitted,
    getAnswerStatus
}) => {
    return (
        <Card.Body style={{ padding: '20px', marginBottom: '10px' }}>
            <h5 style={{ fontWeight: 600, marginBottom: 12 }}>Reading — Read and answer</h5>

            {readingQuestions.map((question) => {
                const userAnswer = answers[question.id];
                const isCorrect = isSubmitted && userAnswer === question.correctAnswer;
                const isIncorrect = isSubmitted && userAnswer && userAnswer !== question.correctAnswer;

                return (
                    <div key={question.id} id={`question-${question.id}`} style={{ marginBottom: '2rem' }}>
                        <div className='d-flex justify-content-between align-items-start mb-2'>
                            <div style={{ fontWeight: 500 }}>
                                <strong>Câu {question.id}:</strong> {question.questionText}
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); toggleMarkQuestion(question.id); }}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: '#ffc107' }}
                                title={markedQuestions.has(question.id) ? 'Bỏ đánh dấu' : 'Đánh dấu xem lại'}
                            >
                                {markedQuestions.has(question.id) ? <FaStar /> : <FaRegStar />}
                            </button>
                        </div>

                        <Form style={{ marginLeft: 6 }}>
                            {question.option.map((opt, index) => {
                                const optionLetter = String.fromCharCode(65 + index);
                                const isThisCorrect = optionLetter === question.correctAnswer;
                                const isThisSelected = userAnswer === optionLetter;

                                let optionStyle = {};
                                let iconElement = null;

                                if (isSubmitted) {
                                    if (isThisCorrect) {
                                        optionStyle = {
                                            backgroundColor: '#d4edda',
                                            border: '2px solid #28a745',
                                            borderRadius: '5px',
                                            padding: '8px',
                                            margin: '4px 0'
                                        };
                                        iconElement = <FaCheck style={{ color: '#28a745', marginLeft: '8px' }} />;
                                    } else if (isThisSelected && !isThisCorrect) {
                                        optionStyle = {
                                            backgroundColor: '#f8d7da',
                                            border: '2px solid #dc3545',
                                            borderRadius: '5px',
                                            padding: '8px',
                                            margin: '4px 0'
                                        };
                                        iconElement = <FaTimes style={{ color: '#dc3545', marginLeft: '8px' }} />;
                                    }
                                }

                                return (
                                    <div key={index} style={optionStyle}>
                                        <Form.Check
                                            type="radio"
                                            id={`question-${question.id}-option-${index}`}
                                            name={`question-${question.id}`}
                                            label={
                                                <span>
                                                    {`${optionLetter}. ${opt}`}
                                                    {iconElement}
                                                </span>
                                            }
                                            value={optionLetter}
                                            checked={isThisSelected}
                                            onChange={() => handleAnswerSelect(question.id, optionLetter)}
                                            disabled={isSubmitted}
                                        />
                                    </div>
                                );
                            })}
                        </Form>

                        {/* Hiển thị đáp án đúng sau khi submit */}
                        {isSubmitted && (
                            <Alert
                                variant={isCorrect ? 'success' : 'danger'}
                                style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                            >
                                <div className="d-flex align-items-center">
                                    {isCorrect ? (
                                        <>
                                            <FaCheck style={{ marginRight: '8px' }} />
                                            <strong>Chính xác!</strong> Đáp án đúng là: {question.correctAnswer}
                                        </>
                                    ) : (
                                        <>
                                            <FaTimes style={{ marginRight: '8px' }} />
                                            <strong>Sai rồi!</strong> Đáp án đúng là: <strong>{question.correctAnswer}</strong>
                                            {userAnswer && ` (Bạn chọn: ${userAnswer})`}
                                        </>
                                    )}
                                </div>
                                {question.explanation && (
                                    <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                                        <strong>Giải thích:</strong> {question.explanation}
                                    </div>
                                )}
                            </Alert>
                        )}
                    </div>
                );
            })}
        </Card.Body>
    );
};

export default ReadingSection;

