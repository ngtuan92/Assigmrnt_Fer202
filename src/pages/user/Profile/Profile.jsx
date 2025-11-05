import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Image, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { FaEdit, FaUserCircle, FaHeadphones, FaBook, FaTrophy, FaTrash } from 'react-icons/fa';
import MainLayout from '../../../layouts/user/MainLayout';
import { historyService } from '../../../services/historyService';



const TOEIC_COLOR = "#27348B"; 

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testHistory, setTestHistory] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUserData(JSON.parse(storedUser));

    const history = historyService.getTestHistory();
    const statistics = historyService.getStats();

    setTestHistory(history);
    setStats(statistics);
    setLoading(false);
  }, []);

  // Hàm xóa bài thi
  const handleDeleteTest = (testId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài thi này?')) {
      historyService.deleteTest(testId);
      // Cập nhật lại state
      const newHistory = historyService.getTestHistory();
      const newStats = historyService.getStats();
      setTestHistory(newHistory);
      setStats(newStats);
    }
  };

  const formatTestType = (type) => {
    switch (type) {
      case 'LISTENING': return 'Listening';
      case 'READING': return 'Reading';
      case 'FULL': return 'Full Test';
      default: return type;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'LISTENING': return <FaHeadphones className="me-1" style={{ color: '#007bff' }} />;
      case 'READING': return <FaBook className="me-1" style={{ color: '#28a745' }} />;
      case 'FULL': return <FaTrophy className="me-1" style={{ color: '#ffc107' }} />;
      default: return null;
    }
  };

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

  // Sử dụng stats từ historyService thay vì userData
  const totalScore = stats.totalScore || 0;
  const avgScore = stats.avgScore || 0;
  const bestScore = stats.bestScore || 0;

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
                  Điểm TOEIC cao nhất
                </div>
                <div style={{
                  fontWeight: 900,
                  fontSize: 58,
                  color: TOEIC_COLOR,
                  lineHeight: 1.05
                }}>
                  {bestScore}
                  <span style={{ fontSize: 28, fontWeight: 600, marginLeft: 10, color: "#5162ae" }}>/990</span>
                </div>
                <div style={{
                  color: "#97a2cf",
                  fontSize: 16,
                  marginTop: 5
                }}>Điểm trung bình: {avgScore} | Tổng điểm: {totalScore}</div>
              </Col>

              {/* Info */}
              <Col xs={12} md={4}>
                <Row className="gy-2">
                  <Col xs={12}>
                    <div style={{ fontSize: 15, color: "#596080" }}>
                      <b>Email:</b> <span style={{ color: "#222", fontWeight: 400 }}>{userData.email}</span>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div style={{ fontSize: 15, color: "#596080" }}>
                      <b>Ngày tham gia:</b> <span style={{ color: "#222", fontWeight: 400 }}>{new Date(userData.JoinedDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div style={{ fontSize: 15, color: "#596080" }}>
                      <b>Bài đã tham gia:</b> <span style={{ color: "#222", fontWeight: 400 }}>{stats.totalTests || 0}</span>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div style={{ fontSize: 15, color: "#596080" }}>
                      <b>Listening:</b> <span style={{ color: "#007bff", fontWeight: 500 }}>{stats.listeningTests || 0}</span>
                      <b className="ms-3">Reading:</b> <span style={{ color: "#28a745", fontWeight: 500 }}>{stats.readingTests || 0}</span>
                      <b className="ms-3">Full:</b> <span style={{ color: "#ffc107", fontWeight: 500 }}>{stats.fullTests || 0}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: 17 }}>
          <Card.Header className="bg-white border-0 pt-3 pb-2 px-4" style={{ fontWeight: 600, color: TOEIC_COLOR, fontSize: 18 }}>
            <span className="fw-bold">Lịch sử làm bài ({stats.totalTests || 0} bài)</span>
          </Card.Header>
          <Card.Body className="p-0 pb-3 px-3">
            {testHistory && testHistory.length > 0 ? (
              <div className="table-responsive">
                <Table className="mb-0 text-center align-middle border-0">
                  <thead>
                    <tr style={{ background: "#f5f7fb" }}>
                      <th className="text-secondary">Tên bài</th>
                      <th className="text-secondary">Loại</th>
                      <th className="text-secondary">Ngày thi</th>
                      <th className="text-secondary">Điểm</th>
                      <th className="text-secondary">Thời gian</th>
                      <th className="text-secondary">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testHistory.slice(0, 10).map((test) => (
                      <tr key={test.id} style={{ fontSize: "1.08rem" }}>
                        <td style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 500 }}>{test.quizName}</div>
                          <small style={{ color: '#6c757d' }}>
                            {test.correctAnswers}/{test.totalQuestions} câu đúng
                          </small>
                        </td>
                        <td>
                          <Badge
                            bg={test.type === 'LISTENING' ? 'primary' : test.type === 'READING' ? 'success' : 'warning'}
                            style={{ fontSize: '0.8rem' }}
                          >
                            {getTypeIcon(test.type)}
                            {formatTestType(test.type)}
                          </Badge>
                        </td>
                        <td>
                          <div>{new Date(test.dateTaken).toLocaleDateString('vi-VN')}</div>
                          <small style={{ color: '#6c757d' }}>
                            {new Date(test.dateTaken).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </td>
                        <td>
                          <span style={{
                            display: "inline-block",
                            fontWeight: 700,
                            fontSize: 22,
                            color: test.score >= 400 ? TOEIC_COLOR : '#dc3545',
                            minWidth: 65
                          }}>
                            {test.score}
                          </span>
                          <span style={{ color: "#8d9ad1", marginLeft: 2 }}>
                            /{test.type === 'FULL' ? '990' : '495'}
                          </span>
                        </td>
                        <td style={{ color: '#6c757d' }}>{test.timeSpent}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteTest(test.id)}
                            title="Xóa bài thi"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted py-4" style={{ fontSize: 18 }}>
                Bạn chưa có bài thi nào.
                <br />
                <Link to="/mock-test" className="text-decoration-none">
                  Bắt đầu làm bài thi đầu tiên →
                </Link>
              </div>
            )}
          </Card.Body>
        </Card>

        <Row className="justify-content-center">
          <Col xs={12} md={5} className="mb-3 mb-md-0">
            <Button
              as={Link}
              to="/mock-test"
              variant="primary"
              className="w-100 fw-bold py-2 rounded-pill"
              style={{ background: TOEIC_COLOR, border: "none", fontSize: 18, letterSpacing: 0.5 }}
            >
              Làm bài thi TOEIC mới
            </Button>
          </Col>
          <Col xs={12} md={5}>
            <Button
              variant="outline-secondary"
              className="w-100 fw-bold py-2 rounded-pill"
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử làm bài?')) {
                  historyService.clearHistory();
                  setTestHistory([]);
                  setStats({});
                }
              }}
              style={{ fontSize: 18, letterSpacing: 0.5 }}
            >
              Xóa toàn bộ lịch sử
            </Button>
          </Col>
        </Row>
        <div className="text-center mt-4" style={{ color: '#8ca1d3', fontStyle: 'italic' }}>Chúc bạn đạt điểm TOEIC thật cao!</div>
      </Container>
    </MainLayout>
  );
};

export default Profile;
