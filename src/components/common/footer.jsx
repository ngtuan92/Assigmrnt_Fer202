// src/components/common/Footer.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white mt-auto py-4">
      <hr className="border border-1 opacity-75" />
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <h5 className="mb-3">TOEIC Quiz App</h5>
            <p className="text-muted medium w-75">
              Ứng dụng luyện thi TOEIC trực tuyến với hệ thống câu hỏi đa dạng,
              giúp người học nâng cao kỹ năng tiếng Anh hiệu quả.
            </p>
          </Col>

          <Col md={4}>
            <h5 className="mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled  ">
              <li className="mb-2">
                <Link to="/user" className="text-muted text-decoration-none">
                  Trang chủ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/user" className="text-muted text-decoration-none">
                  Bài thi
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/user/history" className="text-muted text-decoration-none">
                  Lịch sử
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Hỗ trợ
                </a>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="mb-3">Thông tin liên hệ</h5>
            <ul className="list-unstyled text-muted medium">
              <li className="mb-2">
                Email: luyenthitoeic.edu.com.vn
              </li>
              <li className="mb-2">
                Hotline: 1900-7979
              </li>
              <li className="mb-2">
                Địa chỉ: Hà Nội, Việt Nam
              </li>
              <li className="mb-2">
                T2 - T6: 8:00 - 17:00
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 bg-secondary" />

        <Row>
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <small className="text-muted">
              © {currentYear} TOEIC Quiz App. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
