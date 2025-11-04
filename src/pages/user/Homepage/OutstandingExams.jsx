import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { IoMdTime } from "react-icons/io";
import { LuUserRoundPen } from "react-icons/lu";
import { FaRegComments } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import getExams from '../../../services/examAPI';


const OutstandingExams = () => {
    const [exams, setExams] = useState([])

    const navigate = useNavigate()

    const goIntroTest = () => {
        navigate('/mock-test')
    }

    const fetchExams = async () => {
        try {
            const data = await getExams();
            setExams(data)
        } catch (error) {
            console.error('Failed to fetch exams:', error);
        }
    }

    useEffect(() => {
        fetchExams();
    }, [])

    return (
        <div>
            <strong style={{ color: "#404040ff", fontSize: "40px", display: "flex", justifyContent: "center" }}>Đề thi nổi bật</strong>
            <p style={{ color: "#404040ff", fontSize: "18px", display: "flex", justifyContent: "center" }} className="mt-3">
                Khám phá các đề thi TOEIC nổi bật, được thiết kế theo chuẩn quốc tế, giúp bạn luyện tập và nâng cao kỹ năng làm bài hiệu quả.
            </p>
            <Row>
                {exams.map((e) => {
                    return(
                    <Col md={3} className='mt-4' key={e.id}>
                        <Card style={{ width: '18rem', height: '15rem', backgroundColor: '#f8f9fa' }}>
                            <Card.Body>
                                <Card.Title className='mb-3'>{e.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted d-flex align-items-center">
                                    <IoMdTime className="me-1" />{e.durationMinutes} | <LuUserRoundPen className="me-1 m-2" />{e.learners}

                                </Card.Subtitle>
                                <Card.Text>
                                    {e.description}
                                </Card.Text>
                                <button onClick={goIntroTest} className='btn btn-outline-primary' style={{ width: '90%', display: 'block', margin: '0 auto' }}>Xem chi tiết</button>
                            </Card.Body>
                        </Card>
                    </Col>
                )})}
            </Row>
        </div>
    )
}

export default OutstandingExams
