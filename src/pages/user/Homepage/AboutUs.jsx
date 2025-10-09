import React from 'react'
import { Container } from 'react-bootstrap'

const AboutUs = () => {
    return (
        <div>
            <Container className="my-5">
                <strong style={{ color: "#404040ff", fontSize: "30px" }}>Về chúng tôi</strong>
                <p style={{ color: "#404040ff", fontSize: "18px", width: "50%" }} className="mt-3">
                    Chúng tôi là nền tảng luyện thi TOEIC toàn diện, giúp học viên rèn luyện kỹ năng nghe – đọc – nói – viết hiệu quả nhất. Với hệ thống bài học được xây dựng theo chuẩn đề thi quốc tế, công nghệ chấm điểm thông minh và lộ trình cá nhân hóa, chúng tôi cam kết đồng hành cùng bạn chinh phục mục tiêu TOEIC nhanh chóng và bền vững.
                </p>
            </Container>
        </div>
    )
}

export default AboutUs
