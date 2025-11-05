import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Form, Alert } from 'react-bootstrap';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStar, FaRegStar, FaCheck, FaTimes } from 'react-icons/fa';

const ListeningSection = ({
    audioSrc,
    listeningQuestions,
    handleAnswerSelect,
    markedQuestions,
    toggleMarkQuestion,
    answers,
    isSubmitted,
    getAnswerStatus
}) => {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onTime = () => setProgress((audio.currentTime / (audio.duration || 1)) * 100);
        const onLoad = () => setDuration(audio.duration || 0);
        const onEnd = () => setPlaying(false);

        audio.addEventListener('timeupdate', onTime);
        audio.addEventListener('loadedmetadata', onLoad);
        audio.addEventListener('ended', onEnd);
        return () => {
            audio.removeEventListener('timeupdate', onTime);
            audio.removeEventListener('loadedmetadata', onLoad);
            audio.removeEventListener('ended', onEnd);
        };
    }, [audioSrc]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) { audio.pause(); setPlaying(false); }
        else { audio.play(); setPlaying(true); }
    };

    const seek = (pct) => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        audio.currentTime = (pct / 100) * audio.duration;
    };

    if (!listeningQuestions || listeningQuestions.length === 0) {
        return <div>Không có câu hỏi listening</div>;
    }

    const groupedQuestions = listeningQuestions.reduce((acc, q) => {
        const groupId = q.groupId || 'default';
        if (!acc[groupId]) {
            acc[groupId] = {
                questions: [],
                directions: q.directions || ''
            };
        }
        acc[groupId].questions.push(q);
        return acc;
    }, {})


    return (
        <Card.Body style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <audio ref={audioRef} src={audioSrc} preload="metadata" />
                <Button variant="outline-secondary" size="sm" onClick={togglePlay}>
                    {playing ? <FaPause /> : <FaPlay />}
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={() => { setMuted(!muted); if (audioRef.current) audioRef.current.muted = !muted; }}>
                    {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </Button>

                <div style={{ flex: 1 }}>
                    <ProgressBar now={progress} onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = ((e.clientX - rect.left) / rect.width) * 100;
                        seek(pct);
                    }} />
                </div>

                <div style={{ minWidth: 70, textAlign: 'right', fontSize: 12, color: '#555' }}>
                    {Math.floor((progress / 100) * duration) || 0}s / {Math.floor(duration) || 0}s
                </div>
            </div>

            {Object.entries(groupedQuestions).map(([groupId, group], idx, arr) => (
                <div
                    key={groupId}
                    style={{
                        position: 'relative',
                        marginBottom: '30px',
                        paddingBottom: '20px'
                    }}
                >
                    {group.directions && (
                        <div>
                            <strong>Directions:</strong>
                            <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                                {group.directions}
                            </p>
                        </div>
                    )}

                    {group.questions.map((question) => (
                        <div key={question.id} id={`question-${question.id}`} style={{ marginBottom: '25px' }}>
                            <div className='d-flex justify-content-between align-items-start mb-2'>
                                <div style={{ fontWeight: 500 }}>
                                    <strong>Câu {question.id}:</strong> {question.questionText || ''}
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMarkQuestion(question.id);
                                    }}
                                    style={{
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                        fontSize: 18,
                                        color: '#ffc107'
                                    }}
                                    title={markedQuestions?.has(question.id) ? 'Bỏ đánh dấu' : 'Đánh dấu xem lại'}
                                >
                                    {markedQuestions?.has(question.id) ? <FaStar /> : <FaRegStar />}
                                </button>
                            </div>

                            {question.src && (
                                <div style={{ marginBottom: '15px', marginLeft: 6 }}>
                                    <img
                                        src={question.src}
                                        alt={`Question ${question.id}`}
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            borderRadius: '4px',
                                            border: '1px solid #ddd'
                                        }}
                                        onError={(e) => {
                                            console.error('Image load failed:', question.src);
                                        }}
                                    />
                                </div>
                            )}

                            <Form style={{ marginLeft: 6 }}>
                                {(question.option || []).map((opt, index) => {
                                    const optionLetter = String.fromCharCode(65 + index);
                                    const isThisCorrect = optionLetter === question.correctAnswer;
                                    const isThisSelected = answers?.[question.id] === optionLetter;

                                    let optionStyle = {};
                                    let iconElement = null;

                                    if (isSubmitted) {
                                        if (isThisCorrect) {
                                            optionStyle = {
                                                backgroundColor: '#d4edda',
                                                border: '2px solid #28a745',
                                                borderRadius: '5px',
                                                padding: '8px',
                                                margin: '4px 0'
                                            };
                                            iconElement = <FaCheck style={{ color: '#28a745', marginLeft: '8px' }} />;
                                        } else if (isThisSelected && !isThisCorrect) {
                                            optionStyle = {
                                                backgroundColor: '#f8d7da',
                                                border: '2px solid #dc3545',
                                                borderRadius: '5px',
                                                padding: '8px',
                                                margin: '4px 0'
                                            };
                                            iconElement = <FaTimes style={{ color: '#dc3545', marginLeft: '8px' }} />;
                                        }
                                    }

                                    return (
                                        <div key={index} style={optionStyle}>
                                            <Form.Check
                                                type="radio"
                                                id={`question-${question.id}-option-${index}`}
                                                name={`question-${question.id}`}
                                                label={
                                                    <span>
                                                        {`${optionLetter}. ${opt}`}
                                                        {iconElement}
                                                    </span>
                                                }
                                                value={optionLetter}
                                                checked={isThisSelected}
                                                onChange={() => handleAnswerSelect(question.id, optionLetter)}
                                                disabled={isSubmitted}
                                            />
                                        </div>
                                    );
                                })}
                            </Form>

                            {/* Hiển thị đáp án đúng sau khi submit */}
                            {isSubmitted && (
                                <Alert
                                    variant={answers?.[question.id] === question.correctAnswer ? 'success' : 'danger'}
                                    style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                                >
                                    <div className="d-flex align-items-center">
                                        {answers?.[question.id] === question.correctAnswer ? (
                                            <>
                                                <FaCheck style={{ marginRight: '8px' }} />
                                                <strong>Chính xác!</strong> Đáp án đúng là: {question.correctAnswer}
                                            </>
                                        ) : (
                                            <>
                                                <FaTimes style={{ marginRight: '8px' }} />
                                                <strong>Sai rồi!</strong> Đáp án đúng là: <strong>{question.correctAnswer}</strong>
                                                {answers?.[question.id] && ` (Bạn chọn: ${answers[question.id]})`}
                                            </>
                                        )}
                                    </div>
                                    {question.explanation && (
                                        <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                                            <strong>Giải thích:</strong> {question.explanation}
                                        </div>
                                    )}
                                </Alert>
                            )}
                        </div>
                    ))}

                    {idx < arr.length - 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: '2.5%',
                            width: '95%',
                            height: '1px',
                            backgroundColor: '#d9dee5'
                        }} />
                    )}
                </div>
            ))}
        </Card.Body>
    );
};

export default ListeningSection;