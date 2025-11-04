import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Image, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import MainLayout from '../../../layouts/user/MainLayout';


const DEFAULT_AVATAR = "/default-user.png";  // Đặt ảnh default vào public

const TOEIC_COLOR = "#27348B"; // Brand color theo TOEIC

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUserData(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <span>Đang tải thông tin...</span>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="py-5 text-center">
        <h4>Bạn chưa đăng nhập</h4>
        <Link to="/login">
          <Button variant="outline-primary">Đăng nhập</Button>
        </Link>
      </Container>
    );
  }

  // Tổng điểm TOEIC (vd: giả sử cộng tổng tất cả quiz, scale 990, hoặc có custom logic tùy hệ thống bạn)
  const totalScore = userData.quizzesTaken?.length
    ? userData.quizzesTaken.reduce((sum, quiz) => sum + quiz.score, 0)
    : 0;
  const avgScore = userData.quizzesTaken?.length
    ? (totalScore / userData.quizzesTaken.length).toFixed(0)
    : '0';
  const passed = userData.quizzesTaken?.filter(q => q.score >= 550).length || 0;

  return (
    <MainLayout>
      <Container className="py-4" style={{ maxWidth: 920 }}>
        {/* Header Card */}
        <Card className="mb-4 border-0 shadow" style={{ borderRadius: 22, background: '#f5f6fa' }}>
          <Card.Body>
            <Row className="align-items-center g-4">
              {/* Avatar + Basic */}
              <Col xs={12} md={3} className="text-center">
                <div style={{ position: "relative", margin: "0 auto" }}>
                  {userData.avatar
                    ? <Image
                        src={userData.avatar}
                        roundedCircle
                        style={{
                          width: 115,
                          height: 115,
                          objectFit: 'cover',
                          background: '#e4e9f7',
                          border: '4px solid #fff',
                          boxShadow: '0 2px 15px #dee1ec'
                        }}
                        alt={userData.name}
                      />
                    : <FaUserCircle style={{
                        width: 115,
                        height: 115,
                        color: "#b0b5c8",
                        background: "#edf1fa",
                        borderRadius: "50%",
                        border: "4px solid #fff",
                        boxShadow: '0 2px 15px #dee1ec'
                      }}
                    />}
                </div>
                <div className="mt-3 mb-2">
                  <div style={{ fontSize: "1.36rem", fontWeight: 700, color: TOEIC_COLOR }}>{userData.name}</div>
                  <Badge bg={userData.role === 'admin' ? 'danger' : 'primary'} className="mt-1">
                    {userData.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                  </Badge>
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-pill px-4"
                  as={Link}
                  to="/edit-profile"
                >
                  <FaEdit className="me-1" /> Chỉnh sửa
                </Button>
              </Col>

              {/* Điểm lớn */}
              <Col xs={12} md={5} className="text-center text-md-start d-flex flex-column align-items-center align-items-md-start justify-content-center">
                <div style={{
                  fontWeight: 500,
                  fontSize: 18,
                  letterSpacing: 0.5,
                  marginBottom: 8,
                  color: "#4d5574"
                }}>
                  Tổng điểm TOEIC của bạn
                </div>
                <div style={{
                  fontWeight: 900,
                  fontSize: 58,
                  color: TOEIC_COLOR,
                  lineHeight: 1.05
                }}>
                  {totalScore}
                  <span style={{ fontSize: 28, fontWeight: 600, marginLeft: 10, color: "#5162ae" }}>/990</span>
                </div>
                <div style={{
                  color: "#97a2cf", 
                  fontSize: 16,
                  marginTop: 5
                }}>Cố gắng chinh phục số điểm cao hơn nhé!</div>
              </Col>

              {/* Info */}
              <Col xs={12} md={4}>
                <Row className="gy-2">
                  <Col xs={12}>
                    <div style={{fontSize: 15, color: "#596080"}}>
                      <b>Email:</b> <span style={{ color: "#222", fontWeight: 400 }}>{userData.email}</span>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div style={{fontSize: 15, color: "#596080"}}>
                      <b>Ngày tham gia:</b> <span style={{ color: "#222", fontWeight: 400 }}>{new Date(userData.JoinedDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div style={{fontSize: 15, color: "#596080"}}>
                      <b>Bài đã tham gia:</b> <span style={{ color: "#222", fontWeight: 400 }}>{userData.quizzesTaken?.length || 0}</span>
                      <b className="ms-3">Điểm TB:</b> <span style={{ color: "#222" }}>{avgScore}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: 17 }}>
          <Card.Header className="bg-white border-0 pt-3 pb-2 px-4" style={{fontWeight:600, color:TOEIC_COLOR, fontSize:18}}>
            <span className="fw-bold">Thành tích các bài thi</span>
          </Card.Header>
          <Card.Body className="p-0 pb-3 px-3">
            {userData.quizzesTaken && userData.quizzesTaken.length > 0 ? (
              <div className="table-responsive">
                <Table className="mb-0 text-center align-middle border-0">
                  <thead>
                    <tr style={{background:"#f5f7fb"}}>
                      <th className="text-secondary">Tên bài</th>
                      <th className="text-secondary">Ngày</th>
                      <th className="text-secondary">Điểm TOEIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.quizzesTaken.slice(0, 5).map((quiz, idx) => (
                      <tr key={idx} style={{ fontSize: "1.08rem" }}>
                        <td>{quiz.quizName || `Quiz ${quiz.quizId}`}</td>
                        <td>{new Date(quiz.dateTaken).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <span style={{
                            display: "inline-block",
                            fontWeight: 700,
                            fontSize: 22,
                            color: TOEIC_COLOR,
                            minWidth: 65
                          }}>
                            {quiz.score}
                          </span>
                          <span style={{ color: "#8d9ad1", marginLeft: 2 }}>/990</span>
                        </td>
                     
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted py-4" style={{ fontSize: 18 }}>
                Bạn chưa có bài thi nào.
              </div>
            )}
          </Card.Body>
        </Card>

        <Row className="justify-content-center">
          <Col xs={12} md={5} className="mb-3 mb-md-0">
            <Button
              as={Link}
              to="/tests"
              variant="primary"
              className="w-100 fw-bold py-2 rounded-pill"
              style={{background:TOEIC_COLOR, border:"none", fontSize:18, letterSpacing:0.5}}
            >
              Làm bài thi TOEIC mới
            </Button>
          </Col>
          <Col xs={12} md={5}>
            <Button
              as={Link}
              to="/revise"
              variant="outline-secondary"
              className="w-100 fw-bold py-2 rounded-pill"
              style={{fontSize:18, letterSpacing:0.5}}
            >
              Ôn tập & luyện đề
            </Button>
          </Col>
        </Row>
        <div className="text-center mt-4" style={{color:'#8ca1d3', fontStyle:'italic'}}>Chúc bạn đạt điểm TOEIC thật cao!</div>
      </Container>
    </MainLayout>
  );
};

export default Profile;
