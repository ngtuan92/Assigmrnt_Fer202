import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Form, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { MdArrowDropDown } from 'react-icons/md';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.location.reload();
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    return (
        <Navbar bg="white" expand="lg" style={{ borderBottom: '1px solid #e3e3e3', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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
                    <Nav className="ms-auto align-items-center">
                        {user ? (
                            <>
                                <Form className="d-flex me-3">
                                    <Form.Control
                                        type="search"
                                        placeholder="Search"
                                        className="me-2"
                                        aria-label="Search"
                                        style={{ height: '36px', width: '200px' }}
                                    />
                                </Form>

                                <div className="custom-user-dropdown">
                                    <button
                                        className="user-dropdown-btn"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        {user.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                roundedCircle
                                                width={28}
                                                height={28}
                                                className="avatar-image"
                                            />
                                        ) : (
                                            <div className="avatar-initials">
                                                {getInitials(user.name)}
                                            </div>
                                        )}
                                        <span className="user-name">{user.name}</span>
                                        <MdArrowDropDown
                                            size={18}
                                            className={`dropdown-icon ${showDropdown ? 'open' : ''}`}
                                        />
                                    </button>

                                    {showDropdown && (
                                        <div className="dropdown-menu-custom">
                                            <a
                                                href="/profile"
                                                className="dropdown-item-custom"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <i className="fas fa-user me-2"></i>
                                                Thông tin cá nhân
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <button
                                                className="dropdown-item-custom logout"
                                                onClick={handleLogout}
                                            >
                                                <i className="fas fa-sign-out-alt me-2"></i>
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div>
                                <Button variant="light" as={Link} to="/login">
                                    Đăng nhập
                                </Button>
                                <Button variant="light" as={Link} to="/signup">
                                    Đăng ký
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
