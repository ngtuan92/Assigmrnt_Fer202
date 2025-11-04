import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { AuthContext } from '../../../context/AuthContext'
import './Login.css';

const Signup = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [success, setSuccess] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirm: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.name || !form.email || !form.password || !form.confirm) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (form.password !== form.confirm) {
            setError('Mật khẩu xác nhận không trùng khớp');
            return;
        }
        setLoading(true);
        try {
            const result = await signup({
                name: form.name,
                email: form.email,
                password: form.password
            })
            if (result.success) {
                setSuccess('Đăng ký thành công!');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/login');
                }, 1000);
            }
        } catch (error) {
            setLoading(false);
            console.error('Signup error: ', error);
            setError('Có lỗi xảy ra, vui lòng thử lại');
        }
    };



    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #ec4899 75%, #f97316 100%)",
                padding: 20,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}
        >
            <Container fluid style={{ maxWidth: 500 }}>
                <Row
                    style={{
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
                        background: "#fff",
                        minHeight: 540,
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Col
                        style={{
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "56px 32px"
                        }}
                    >
                        <div style={{ width: "100%", maxWidth: 370 }}>
                            <h2
                                style={{
                                    color: "#4f46e5",
                                    fontSize: "1.3rem",
                                    fontWeight: 600,
                                    marginBottom: 48,
                                    letterSpacing: "0.5px",
                                    textAlign: "center"
                                }}
                            >
                                ĐĂNG KÝ TÀI KHOẢN
                            </h2>
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
                            <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                                <Form.Group style={{ marginBottom: 18 }}>
                                    <Form.Control
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Tên của bạn"
                                        autoComplete="name"
                                        required
                                        style={{
                                            padding: "15px 16px",
                                            border: "none",
                                            borderRadius: 6,
                                            backgroundColor: "#f3f4f6",
                                            fontSize: "1rem",
                                            color: "#333",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group style={{ marginBottom: 18 }}>
                                    <Form.Control
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        autoComplete="email"
                                        required
                                        style={{
                                            padding: "15px 16px",
                                            border: "none",
                                            borderRadius: 6,
                                            backgroundColor: "#f3f4f6",
                                            fontSize: "1rem",
                                            color: "#333",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group style={{ marginBottom: 18 }}>
                                    <InputGroup>
                                        <Form.Control
                                            name="password"
                                            type={showPass ? "text" : "password"}
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Mật khẩu"
                                            autoComplete="new-password"
                                            required
                                            style={{
                                                padding: "15px 16px",
                                                border: "none",
                                                borderRadius: 6,
                                                backgroundColor: "#f3f4f6",
                                                fontSize: "1rem",
                                                color: "#333",
                                                boxSizing: "border-box"
                                            }}
                                        />
                                        <InputGroup.Text
                                            as="span"
                                            style={{
                                                background: "#f3f4f6",
                                                border: "none",
                                                borderRadius: 6,
                                                cursor: "pointer",
                                                fontSize: 20,
                                                color: "#444",
                                                userSelect: "none",
                                                minWidth: 42,
                                                justifyContent: "center"
                                            }}
                                            onClick={() => setShowPass(!showPass)}
                                        >
                                            {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group style={{ marginBottom: 28 }}>
                                    <InputGroup>
                                        <Form.Control
                                            name="confirm"
                                            type={showConfirm ? "text" : "password"}
                                            value={form.confirm}
                                            onChange={handleChange}
                                            placeholder="Xác nhận mật khẩu"
                                            autoComplete="new-password"
                                            required
                                            style={{
                                                padding: "15px 16px",
                                                border: "none",
                                                borderRadius: 6,
                                                backgroundColor: "#f3f4f6",
                                                fontSize: "1rem",
                                                color: "#333",
                                                boxSizing: "border-box"
                                            }}
                                        />
                                        <InputGroup.Text
                                            as="span"
                                            style={{
                                                background: "#f3f4f6",
                                                border: "none",
                                                borderRadius: 6,
                                                cursor: "pointer",
                                                fontSize: 20,
                                                color: "#444",
                                                userSelect: "none",
                                                minWidth: 42,
                                                justifyContent: "center"
                                            }}
                                            onClick={() => setShowConfirm(!showConfirm)}
                                        >
                                            {showConfirm ? <MdVisibilityOff /> : <MdVisibility />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-login-custom"
                                >
                                    {loading ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
                                </button>
                            </Form>
                            <div
                                style={{
                                    textAlign: "center",
                                    fontSize: "0.95rem",
                                    marginTop: 6
                                }}
                            >
                                <span style={{ color: "#6b7280" }}>Đã có tài khoản? </span>
                                <a
                                    href="/login"
                                    style={{
                                        color: "#4f46e5",
                                        fontWeight: 600,
                                        textDecoration: "none"
                                    }}
                                >Đăng nhập ngay</a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Signup;
