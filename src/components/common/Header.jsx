import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown, NavDropdown, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";


const Header = () => {
    const navigate = useNavigate();

    const user = {
        username: 'Tuan',
        role: 'user'
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <Navbar bg="white" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to={"/home"}>
                    <strong style={{ color: "#404040ff" }}>TOEIC Quiz App</strong>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && (
                            <>
                                {user.role === 'admin' ? (
                                    <>
                                        <Nav.Link as={Link} to="/admin" style={{ color: "#404040ff" }}>
                                            Dashboard
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/admin/questions" style={{ color: "#404040ff" }}>
                                            Quản lý câu hỏi
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/admin/users" style={{ color: "#404040ff" }}>
                                            Quản lý người dùng
                                        </Nav.Link>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/revise" style={{ color: "#404040ff" }}>
                                            Ôn luyện
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/tests" style={{ color: "#404040ff" }}>
                                            Đề thi online
                                        </Nav.Link>
                                    </>
                                )}
                            </>
                        )}
                    </Nav>
                    <Nav className="ms-auto">
                        {user ? (
                            <>
                                <Form className="d-flex h-90 me-5">
                                    <Form.Control
                                        type="search"
                                        placeholder="Search"
                                        className="me-2"
                                        aria-label="Search"
                                    />

                                </Form>
                                <NavDropdown
                                    title={
                                        <span style={{ color: "#404040ff" }}>
                                            <FaCircleUser className="me-2" size={18} />
                                            {user.username}
                                        </span>
                                    }
                                    align="start"
                                    id="user-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to="/profile">
                                        <i className="fas fa-user me-2"></i>
                                        Thông tin cá nhân
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <Button variant="light" as={Link} to="/login">
                                Đăng nhập
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
