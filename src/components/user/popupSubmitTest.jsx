import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const PopupSubmitTest = ({ show, onConfirm, onClose, answersCount, totalQuestions }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận nộp bài</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bạn đã trả lời {answersCount}/{totalQuestions} câu. Bạn có chắc muốn nộp bài?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    Nộp bài
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PopupSubmitTest
