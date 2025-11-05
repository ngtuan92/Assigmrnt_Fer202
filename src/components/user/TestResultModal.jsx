import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

const TestResultModal = ({ show, onClose, score, totalQuestions, timeSpent, partSelected }) => {
    const percentage = Math.round((score / totalQuestions) * 100);

    const getScoreColor = () => {
        if (percentage >= 80) return '#28a745'; // Xanh lá
        if (percentage >= 60) return '#ffc107'; // Vàng
        return '#dc3545'; // Đỏ
    };

    const getScoreMessage = () => {
        if (percentage >= 80) return 'Xuất sắc!';
        if (percentage >= 60) return 'Khá tốt!';
        if (percentage >= 40) return 'Cần cải thiện';
        return 'Cần ôn tập thêm';
    };

    return (
        <Modal show={show} onHide={onClose} centered size="md">
            <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <Modal.Title style={{ width: '100%', textAlign: 'center', color: '#333' }}>
                    🎉 Hoàn thành bài thi!
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ textAlign: 'center', padding: '2rem' }}>
                {/* Điểm số chính */}
                <div style={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    color: getScoreColor(),
                    marginBottom: '1rem'
                }}>
                    {score}/{totalQuestions}
                </div>

                {/* Phần trăm */}
                <div style={{
                    fontSize: '1.5rem',
                    color: getScoreColor(),
                    marginBottom: '1rem'
                }}>
                    {percentage}%
                </div>

                {/* Thông điệp */}
                <div style={{
                    fontSize: '1.2rem',
                    color: '#666',
                    marginBottom: '2rem'
                }}>
                    {getScoreMessage()}
                </div>

                {/* Thống kê chi tiết */}
                <Row className="text-center">
                    <Col>
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                                Phần thi
                            </div>
                            <div style={{ color: '#666' }}>
                                {partSelected === 'LISTENING' ? 'LISTENING' : 'READING'}
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                                Thời gian
                            </div>
                            <div style={{ color: '#666' }}>
                                {timeSpent}
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className="text-center">
                    <Col>
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#d4edda',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#155724' }}>
                                Câu đúng
                            </div>
                            <div style={{ color: '#155724', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                {score}
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#f8d7da',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#721c24' }}>
                                Câu sai
                            </div>
                            <div style={{ color: '#721c24', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                {totalQuestions - score}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer style={{ borderTop: 'none', justifyContent: 'center' }}>
                <Button
                    variant="primary"
                    onClick={onClose}
                    style={{
                        padding: '0.75rem 2rem',
                        fontSize: '1.1rem',
                        borderRadius: '8px'
                    }}
                >
                    Xem đáp án chi tiết
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TestResultModal;