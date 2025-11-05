import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Login.css';
import { AuthContext } from '../../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    setSuccess("")
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Vui lòng nhập đầy đủ Email và Mật khẩu");
        setLoading(false);
        return;
      }

      const result = await login({ email, password });

      if (result.success) {
        setSuccess("Đăng nhập thành công!");
        console.log("Success", result.user)
        sessionStorage.setItem("name", result.user.name);

        // Redirect dựa trên role và from location
        const from = location.state?.from?.pathname || '/home';
        if (result.user && result.user.role === 'admin') {
          navigate("/admin/exams");
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Container fluid className="login-container">
        <Row className="login-row">
          <Col className="login-right">
            <div className="form-container">
              <h2 className="form-title d-flex justify-content-center">ĐĂNG NHẬP TÀI KHOẢN</h2>

              {error && (
                <Alert severity="error" sx={{ mb: 2, fontSize: 16, textAlign: 'center' }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2, fontSize: 16, textAlign: 'center' }}>
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="login-form">
                <Form.Group className="form-group-custom">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="form-input"
                    autoComplete="email"
                    required
                  />
                </Form.Group>

                <Form.Group className="form-group-custom">
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    className="form-input"
                    autoComplete="current-password"
                    required
                  />
                </Form.Group>

                <Row className="remember-forgot">
                  <Col>
                    <Form.Check
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      label="Ghi nhớ đăng nhập"
                      className="remember-check"
                    />
                  </Col>
                  <Col className="text-end">
                    <a href="/forgot-password" className="forgot-link">
                      Quên mật khẩu?
                    </a>
                  </Col>
                </Row>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-login-custom"
                >
                  {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                </button>
              </Form>

              <div className="signup-section">
                <span className="signup-text">Chưa có tài khoản? </span>
                <a href="/signup" className="signup-link">Tạo tài khoản luyện thi</a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
