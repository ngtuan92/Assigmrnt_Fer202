import React, { useState } from 'react'
import { Card, Col, Container, Row, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../layouts/user/MainLayout'
import Rating from '@mui/material/Rating';
import ConfirmModal from '../../../components/user/confirmModal';

const Intro = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const navigate = useNavigate();

    const requestStartTest = (type) => {
        setPendingAction(() => () => {
            navigate(`/mock-test/${type}`);
        });
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        if (pendingAction) {
            pendingAction();
        }
    }
    return (
        <MainLayout>
            <Container className='my-5'>
                <Row>
                    <Col md={4}>
                        <img
                            src='/access/Luyen-De-VSTEP-2025-4.png'
                            alt='mock-test'
                            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                        />
                    </Col>
                    <Col md={8} style={{ paddingLeft: "50px" }}>
                        <h2 style={{ color: "#404040ff", fontSize: "50px", fontWeight: "bold" }}>
                            Bộ đề thi thử TOEIC - TEST 1 (Reading và Listening)
                        </h2>
                        <Rating name="size-large" defaultValue={4.5} size="large" />
                        <p style={{ color: "#404040ff", fontSize: "18px", marginTop: "30px" }}>
                            Đề thi thử TOIEC được thiết kế bám sát cấu trúc và định dạng chính thức của kỳ thi đánh giá năng lực tiếng Anh do Bộ Giáo dục và Đào tạo ban hành. Bộ đề bao gồm đầy đủ bốn kỹ năng Listening, Reading, giúp thí sinh làm quen với dạng câu hỏi, thời lượng và độ khó tương đương đề thi thật. Nội dung được xây dựng từ các chủ đề tiếng Anh học thuật và đời sống quen thuộc, kèm theo đáp án và gợi ý trả lời chi tiết để hỗ trợ người học đánh giá chính xác trình độ hiện tại. Việc luyện tập với bộ đề thi này không chỉ giúp bạn cải thiện tốc độ làm bài và kỹ năng xử lý câu hỏi mà còn tăng sự tự tin, tạo nền tảng vững chắc để đạt mục tiêu chứng chỉ TOIEC.
                        </p>
                    </Col>
                </Row>

                <div>
                    <h1 style={{ color: "#404040ff", fontSize: "50px", fontWeight: "bold", marginTop: "60px" }}>
                        Practice Test 1
                    </h1>
                </div>

                <Row className='mt-4'>
                    <Col md={3} className='mt-4' style={{ marginRight: '40px' }}>
                        <div
                            style={{
                                position: 'relative',
                                width: '110%',
                                height: '400px',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                                transform: hoveredCard === 'listening' ? 'translateY(-5px)' : 'translateY(0)'
                            }}
                            onMouseEnter={() => setHoveredCard('listening')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <img
                                src="/access/toeic_reading.png"
                                alt="Listening Test"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'inherit',
                                    transition: 'all 0.4s ease',
                                    transform: hoveredCard === 'listening' ? 'scale(1.1)' : 'scale(1)',
                                    filter: hoveredCard === 'listening' ? 'brightness(0.5)' : 'brightness(1)'
                                }}
                            />

                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0, 0, 0, 0.75)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: hoveredCard === 'listening' ? 1 : 0,
                                transition: 'opacity 0.4s ease',
                                zIndex: 2
                            }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '20px',
                                    transform: hoveredCard === 'listening' ? 'translateY(0)' : 'translateY(20px)',
                                    transition: 'transform 0.4s ease'
                                }}>

                                    <Button
                                        variant="light"
                                        size="lg"
                                        onClick={() => requestStartTest('listening')}
                                        style={{
                                            fontWeight: 600,
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                                        }}
                                    >
                                        Bắt đầu thi Listening
                                    </Button>
                                    <ConfirmModal
                                        show={showConfirm}
                                        onClose={() => setShowConfirm(false)}
                                        onConfirm={handleConfirm}
                                       
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col md={3} className='mt-4'>
                        <div
                            style={{
                                position: 'relative',
                                width: '110%',
                                height: '400px',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                                transform: hoveredCard === 'reading' ? 'translateY(-5px)' : 'translateY(0)'
                            }}
                            onMouseEnter={() => setHoveredCard('reading')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <img
                                src="/access/toeic_reading.png"
                                alt="Reading Test"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'inherit',
                                    transition: 'all 0.4s ease',
                                    transform: hoveredCard === 'reading' ? 'scale(1.1)' : 'scale(1)',
                                    filter: hoveredCard === 'reading' ? 'brightness(0.5)' : 'brightness(1)'
                                }}
                            />

                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0, 0, 0, 0.75)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: hoveredCard === 'reading' ? 1 : 0,
                                transition: 'opacity 0.4s ease',
                                zIndex: 2
                            }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '20px',
                                    transform: hoveredCard === 'reading' ? 'translateY(0)' : 'translateY(20px)',
                                    transition: 'transform 0.4s ease'
                                }}>

                                    <Button
                                        variant="light"
                                        size="lg"
                                        onClick={() => requestStartTest('reading')}
                                        style={{
                                            fontWeight: 600,
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                                        }}
                                    >
                                        Bắt đầu thi Reading
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </MainLayout>
    )
}

export default Intro
