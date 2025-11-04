import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'

const AboutUs = () => {
    return (
        <div>
            <Row className='align-items-center' style={{marginBottom: '7rem'}}>
                <Col md={6}>
                    <strong style={{ color: "#404040ff", fontSize: "40px" }}>Về chúng tôi</strong>
                    <p style={{ color: "#404040ff", fontSize: "18px", width: "80%" }} className="mt-3">
                        Chúng tôi là nền tảng luyện thi TOEIC toàn diện, giúp học viên rèn luyện kỹ năng nghe – đọc – nói – viết hiệu quả nhất. Với hệ thống bài học được xây dựng theo chuẩn đề thi quốc tế, công nghệ chấm điểm thông minh và lộ trình cá nhân hóa, chúng tôi cam kết đồng hành cùng bạn chinh phục mục tiêu TOEIC nhanh chóng và bền vững.
                    </p>
                    <p style={{ color: "#404040ff", fontSize: "18px", width: "80%" }}>
                        Học TOEIC không chỉ để thi – mà để mở ra cơ hội nghề nghiệp và tương lai mới.
                    </p>
                </Col>
                <Col md={6} className='mt-4'>
                    <Card>
                        <Card.Img variant="top" src='https://img.freepik.com/free-vector/flat-design-online-education-illustration_23-2148888820.jpg?w=740&t=st=1700348403~exp=1700349003~hmac=1f3a5e2e4a5f0e2d1f6e8c9b8c9e8c9b8c9e8c9b8c9e8c9b8c9e8c9b8c9e8c9b8' alt='about us' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default AboutUs
