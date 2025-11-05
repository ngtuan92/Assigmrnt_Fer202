import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginRequiredModal = ({ show, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = () => {
        onClose();
        // Truyền current path để redirect sau khi đăng nhập
        navigate('/login', { state: { from: location } });
    };

    const handleSignup = () => {
        onClose();
        navigate('/signup', { state: { from: location } });
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Yêu cầu đăng nhập
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center py-4">
                
                <h5 className="mb-3">Bạn cần đăng nhập/đăng ký để làm bài thi</h5>
                <p className="text-muted mb-4">
                    Đăng nhập để theo dõi tiến độ học tập, lưu kết quả thi và truy cập đầy đủ các bàu thi!
                </p>

                <div className="d-flex gap-2 justify-content-center">
                    <Button
                        variant="primary"
                        onClick={handleLogin}
                        className="px-4"
                    >
                        Đăng nhập
                    </Button>
                    <Button
                        variant="outline-primary"
                        onClick={handleSignup}
                        className="px-4"
                    >
                        Đăng ký
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default LoginRequiredModal;