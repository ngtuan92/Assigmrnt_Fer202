import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { practiceService } from '../../services/practiceService';

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  type = 'listening', // 'listening' hoặc 'reading'
  practiceId = null,
  loading = false
}) => {
  const [questionCount, setQuestionCount] = useState(0);

  // Xác định thời gian dựa vào type
  const timeLimit = type === 'listening' ? 75 : 45;

  // Title dựa vào type
  const title = type === 'listening'
    ? 'Xác nhận bắt đầu thi Listening'
    : 'Xác nhận bắt đầu thi Reading';

  useEffect(() => {
    fetchQuestionCount();
  }, [type, practiceId]);

  const fetchQuestionCount = async () => {
    try {
      if (!practiceId) return;

      const quiz = await practiceService.getQuiz(practiceId);

      if (type === 'listening') {
        // Đếm câu hỏi Listening
        const listeningSection = quiz.sections?.find(s => s.sectionId === 'listening');
        const count = listeningSection?.groups?.reduce((acc, group) =>
          acc + (group.question?.length || 0), 0
        ) || 0;
        setQuestionCount(count);
      } else {
        // Đếm câu hỏi Reading
        const readingSection = quiz.sections?.find(s => s.sectionId === 'reading');
        const count = (readingSection?.question?.length || 0) +
          (readingSection?.groups?.reduce((acc, group) =>
            acc + (group.questions?.length || 0), 0) || 0);
        setQuestionCount(count);
      }
    } catch (error) {
      console.error('Error fetching question count:', error);
      setQuestionCount(0);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      contentClassName="border-0"
      style={{
        borderRadius: '16px'
      }}
    >
      <Modal.Body className="p-0">
        <button
          onClick={onClose}
          disabled={loading}
          className="btn-close position-absolute"
          style={{
            top: '20px',
            right: '20px',
            zIndex: 10
          }}
          aria-label="Close"
        />

        <div className="px-5 pt-5 pb-4">
          <h5
            className="text-center fw-semibold mb-4"
            style={{
              fontSize: '1.25rem',
              color: '#1a202c',
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </h5>

          <div className="d-flex gap-3 mb-4">
            <div
              className="flex-fill text-center py-3 px-2"
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}
            >
              <div
                className="mb-2"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  color: '#1a202c'
                }}
              >
                {questionCount}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#6c757d'
                }}
              >
                Số câu hỏi
              </div>
            </div>

            <div
              className="flex-fill text-center py-3 px-2"
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}
            >
              <div
                className="mb-2"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  color: '#1a202c'
                }}
              >
                {timeLimit}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#6c757d'
                }}
              >
                Thời gian (phút)
              </div>
            </div>
          </div>

          <p
            className="text-center mb-0"
            style={{
              fontSize: '0.9375rem',
              color: '#4a5568',
              lineHeight: 1.6
            }}
          >
            Sau khi bắt đầu, thời gian sẽ được đếm ngược và không thể tạm dừng.
          </p>
        </div>

        <div
          className="d-flex gap-2 px-5 pb-5 pt-2"
        >
          <Button
            variant="light"
            onClick={onClose}
            disabled={loading}
            className="flex-fill"
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              color: '#495057',
              backgroundColor: '#fff',
              fontWeight: '500',
              fontSize: '0.9375rem'
            }}
          >
            Hủy
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-fill"
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: loading ? '#94a3b8' : '#2563eb',
              color: '#fff',
              fontWeight: '500',
              fontSize: '0.9375rem'
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  style={{ width: '0.875rem', height: '0.875rem' }}
                />
                Đang xử lý...
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
