import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Container, Spinner } from 'react-bootstrap';

const RequireAuth = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-2">Đang kiểm tra đăng nhập...</span>
            </Container>
        );
    }

    if (!isAuthenticated) {
        // Lưu đường dẫn hiện tại để redirect sau khi đăng nhập
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;