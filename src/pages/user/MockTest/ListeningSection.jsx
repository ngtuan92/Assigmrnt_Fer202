import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Form } from 'react-bootstrap';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStar, FaRegStar } from 'react-icons/fa';

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
                                    const optionId = String.fromCharCode(65 + index);
                                    const status = getAnswerStatus ? getAnswerStatus(question.id, optionId) : '';

                                    return (
                                        <Form.Check
                                            key={index}
                                            type="radio"
                                            id={`question-${question.id}-option-${index}`}
                                            name={`question-${question.id}`}
                                            label={`${optionId}. ${opt}`}
                                            value={optionId}
                                            checked={answers?.[question.id] === optionId}
                                            onChange={() => handleAnswerSelect(question.id, optionId)}
                                            disabled={isSubmitted}
                                            className={status === 'correct' ? 'text-success' : status === 'incorrect' ? 'text-danger' : ''}
                                        />
                                    );
                                })}
                            </Form>
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