import React, { useContext, useState } from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import LoginRequiredModal from '../../../components/user/LoginRequiredModal';

const OutstandingExams = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleStartTest = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }
        navigate('/mock-test');
    };

    return (
        <Container className='my-5'>
            <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{
                    color: "#404040ff",
                    fontSize: "40px",
                    fontWeight: "bold",
                    marginBottom: '15px'
                }}>
                    Đề thi nổi bật
                </h2>
                <p style={{
                    color: "#666",
                    fontSize: "16px",
                    lineHeight: '1.6'
                }}>
                    Khám phá các đề thi TOEIC nổi bật, được thiết kế theo chuẩn quốc tế, giúp bạn luyện tập và nâng cao kỹ năng làm bài hiệu quả.
                </p>
            </div>

            <Row className='align-items-center' style={{
                backgroundColor: '#f8f9fa',
                padding: '40px 30px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
                <Col lg={8}>
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#404040',
                        marginBottom: '15px'
                    }}>
                        TOEIC Practice Tests
                    </h3>
                    <p style={{
                        fontSize: '15px',
                        color: '#555',
                        lineHeight: '1.8',
                        marginBottom: '0'
                    }}>
                        Bộ đề thi thử TOEIC được thiết kế bám sát cấu trúc và định dạng chính thức của kỳ thi.
                        Bao gồm đầy đủ 4 kỹ năng Reading, Listening với các dạng câu hỏi, thời lượng và độ khó
                        tương đương đề thi thật. Nội dung được xây dựng từ các chủ đề học thuật và đời sống quen thuộc,
                        kèm theo đáp án chi tiết và giải thích để hỗ trợ người học đánh giá chính xác trình độ.
                        Luyện tập với bộ đề này giúp cải thiện tốc độ làm bài, kỹ năng xử lý câu hỏi và tăng sự tự tin
                        để đạt mục tiêu chứng chỉ TOEIC.
                    </p>
                </Col>

                {/* Bên phải - Button */}
                <Col lg={4} className='text-center'>
                    <Button
                        onClick={handleStartTest}
                        style={{
                            backgroundColor: '#007bff',
                            border: 'none',
                            padding: '14px 40px',
                            fontSize: '16px',
                            fontWeight: '600',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#0056b3';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#007bff';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        {isAuthenticated ? 'Thi ngay →' : 'Thi ngay →'}
                    </Button>

                </Col>
            </Row>

            {/* Modal yêu cầu đăng nhập */}
            <LoginRequiredModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </Container>
    )
}

export default OutstandingExams
