import React, { useState, useEffect } from 'react'
import { Card, Col, Container, Row, Button, Spinner, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../layouts/user/MainLayout'
import Rating from '@mui/material/Rating';
import ConfirmModal from '../../../components/user/confirmModal';
import { practiceService } from '../../../services/practiceService';
import { examService } from '../../../services/examService';

const Intro = () => {
    const [practices, setPractices] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [pendingType, setPendingType] = useState('listening');
    const [selectedPracticeId, setSelectedPracticeId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('🔍 Đang fetch data...');
            const [practicesData, examsData] = await Promise.all([
                practiceService.fetchPractices(),
                examService.getAllExams()
            ]);
            console.log('📊 Practices data:', practicesData);
            console.log('🎯 Exams data:', examsData);
            setPractices(practicesData || []);
            setExams(examsData || []);
        } catch (e) {
            console.error('❌ Error fetching data:', e);
            setPractices([]);
            setExams([]);
        } finally {
            setLoading(false);
        }
    };

    const requestStartTest = (type, quizId) => {
        setSelectedPracticeId(quizId);
        setPendingType(type);

        setPendingAction(() => () => {
            navigate(`/mock-test/${type}/${quizId}`);
        });
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        if (pendingAction) {
            pendingAction();
        }
    };

    const formatLearnerCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count?.toString() || '0';
    };

    const getExamById = (examId) => {
        return exams.find(exam => exam.id === examId);
    };

    if (loading) {
        return (
            <MainLayout>
                <Container className='my-5 text-center'>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </Spinner>
                    <p className='mt-3'>Đang tải danh sách đề thi...</p>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container className='my-5'>
                <h1 style={{
                    color: "#404040ff",
                    fontSize: "50px",
                    fontWeight: "bold",
                    marginBottom: "60px"
                }}>
                    Practice Tests
                </h1>

                <Row className='g-4'>
                    {practices.length === 0 && !loading ? (
                        <Col xs={12} className="text-center py-5">
                            <div style={{ color: '#666', fontSize: '18px' }}>
                                <p>🚫 Không tìm thấy bài thi nào</p>
                                <p style={{ fontSize: '14px' }}>
                                    Kiểm tra kết nối mạng hoặc thử tải lại trang
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={fetchData}
                                    style={{ marginTop: '10px' }}
                                >
                                    🔄 Tải lại
                                </Button>
                            </div>
                        </Col>
                    ) : (
                        practices.map((practice) => (
                            <Col md={6} lg={4} key={practice.id} className='mb-4'>
                                <Card
                                    style={{
                                        height: '100%',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: 'none',
                                        borderRadius: '12px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <Card.Body style={{ padding: '24px' }}>
                                        <Card.Title style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#404040',
                                            marginBottom: '12px'
                                        }}>
                                            {practice.title}
                                        </Card.Title>

                                        <div style={{ marginBottom: '15px' }}>
                                            <Rating
                                                value={4.5}
                                                readOnly
                                                size="small"
                                            />
                                            <span style={{
                                                marginLeft: '8px',
                                                color: '#999',
                                                fontSize: '12px'
                                            }}>
                                                4.5/5.0
                                            </span>
                                        </div>

                                        <Card.Text style={{
                                            color: '#666',
                                            marginBottom: '15px',
                                            minHeight: '60px',
                                            fontSize: '14px',
                                            lineHeight: '1.5'
                                        }}>
                                            {practice.description?.substring(0, 100)}
                                            {practice.description?.length > 100 ? '...' : ''}
                                        </Card.Text>

                                        <div style={{
                                            display: 'flex',
                                            gap: '15px',
                                            marginBottom: '20px',
                                            fontSize: '13px',
                                            color: '#999'
                                        }}>
                                            <div>⏱ {practice.durationMinutes} phút</div>
                                            <div>👥 {formatLearnerCount(getExamById(practice.id)?.learners || 0)} người thi</div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className='flex-grow-1'
                                                onClick={() => requestStartTest('listening', practice.id)}
                                                style={{
                                                    fontWeight: 600,
                                                    borderRadius: '6px'
                                                }}
                                            >
                                                🎧 Listening
                                            </Button>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className='flex-grow-1'
                                                onClick={() => requestStartTest('reading', practice.id)}
                                                style={{
                                                    fontWeight: 600,
                                                    borderRadius: '6px'
                                                }}
                                            >
                                                📖 Reading
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>

                {/* ✅ Sửa lại ConfirmModal */}
                <ConfirmModal
                    show={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={handleConfirm}
                    type={pendingType}
                    practiceId={selectedPracticeId}
                />
            </Container>
        </MainLayout>
    )
}

export default Intro
