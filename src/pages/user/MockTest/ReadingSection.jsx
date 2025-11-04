import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ReadingSection = ({
    readingQuestions,
    markedQuestions,
    toggleMarkQuestion,
    handleAnswerSelect
}) => {
    return (
        <Card.Body style={{ padding: '20px', marginBottom: '10px' }}>
            <h5 style={{ fontWeight: 600, marginBottom: 12 }}>Reading — Read and answer</h5>

            {readingQuestions.map((question) => (
                <div key={question.id} id={`question-${question.id}`}>
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
                        {question.option.map((opt, index) => (
                            <Form.Check
                                key={index}
                                type="radio"
                                id={`question-${question.id}-option-${index}`}
                                name={`question-${question.id}`}
                                label={`${String.fromCharCode(65 + index)}. ${opt}`}
                                value={String.fromCharCode(65 + index)}
                                onChange={() => handleAnswerSelect(question.id, String.fromCharCode(65 + index))}
                            />
                        ))}
                    </Form>
                </div>
            ))}
        </Card.Body>
    );
};

export default ReadingSection;

