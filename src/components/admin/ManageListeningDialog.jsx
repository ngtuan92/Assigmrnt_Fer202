import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Stack,
  CircularProgress,
  Box,
  Button,
  Input,
  Chip,
  Alert,
  Divider,
  Card,
  CardContent,
  TextField,
  DialogActions
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import { practiceService } from '../../services/practiceService';
import ListeningGroupsList from './ListeningGroupsList';

export default function ManageListeningDialog({ open, onClose, practice, onUpdate }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAudioDialog, setOpenAudioDialog] = useState(false);
  const [audioForm, setAudioForm] = useState('');
  const [uploadedAudioFile, setUploadedAudioFile] = useState(null);
  const [audioError, setAudioError] = useState('');
  const [audioSuccess, setAudioSuccess] = useState('');

  useEffect(() => {
    if (open && practice) {
      setLoading(true);
      practiceService
        .getQuiz(practice.id)
        .then(data => {
          setQuiz(data);
        })
        .catch(err => {
          console.error('Lỗi tải quiz:', err);
          setQuiz({
            id: practice.id,
            createBy: 2,
            createAt: new Date().toISOString().slice(0, 10),
            sections: [
              { 
                sectionId: 'reading', 
                title: 'Reading Comprehension', 
                totalQuestions: 0, 
                question: [], 
                groups: [] 
              },
              { 
                sectionId: 'listening', 
                title: 'Listening Comprehension', 
                totalQuestions: 0, 
                audio: '',
                groups: [] 
              }
            ]
          });
        })
        .finally(() => setLoading(false));
    }
  }, [open, practice]);

  const listeningSection = quiz?.sections?.find(s => s.sectionId === 'listening');

  const handleAudioFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/ogg'];
    if (!validAudioTypes.includes(file.type)) {
      setAudioError('Chỉ chấp nhận file audio: MP3, WAV, M4A, AAC, OGG');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setAudioError('File quá lớn, tối đa 100MB');
      return;
    }

    setAudioError('');
    setUploadedAudioFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAudioForm(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearAudioFile = () => {
    setUploadedAudioFile(null);
    setAudioForm('');
    setAudioError('');
  };

  const handleSaveAudio = async () => {
    setAudioError('');
    
    if (!audioForm.trim()) {
      setAudioError('Vui lòng chọn file audio hoặc nhập URL');
      return;
    }

    try {
      const updatedSections = quiz.sections.map(s =>
        s.sectionId === 'listening'
          ? { ...s, audio: audioForm }
          : s
      );

      await practiceService.updateQuiz(practice.id, { ...quiz, sections: updatedSections });
      setAudioSuccess('Cập nhật audio thành công!');
      setQuiz({ ...quiz, sections: updatedSections });
      setTimeout(() => {
        setOpenAudioDialog(false);
        setAudioForm('');
        setUploadedAudioFile(null);
        setAudioSuccess('');
      }, 1500);
    } catch (e) {
      setAudioError('Lưu audio thất bại: ' + e.message);
    }
  };

  return (
    <>
      {/* Main Dialog */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Quản lý Listening - {practice?.title}</Typography>
            <IconButton onClick={onClose}><Close /></IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={5}>
              <CircularProgress />
            </Box>
          ) : quiz ? (
            <Stack spacing={3}>
              {listeningSection && (
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        
                        {listeningSection.audio && (
                          <Typography variant="body2" color="success.main">
                            ✓ Audio đã được tải lên
                          </Typography>
                        )}
                      </Box>
                      <Button 
                        variant="contained" 
                        startIcon={<CloudUpload />}
                        onClick={() => setOpenAudioDialog(true)}
                      >
                        {listeningSection.audio ? 'Thay đổi Audio' : 'Thêm Audio'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              <Divider />

              <ListeningGroupsList 
                quiz={quiz} 
                practiceId={practice?.id}
                onUpdate={() => {
                  practiceService.getQuiz(practice.id).then(setQuiz);
                  onUpdate();
                }}
              />
            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Audio Dialog */}
      <Dialog open={openAudioDialog} onClose={() => { setOpenAudioDialog(false); setAudioError(''); }} maxWidth="sm" fullWidth>
        <DialogTitle>Tải lên audio cho Listening</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={2}>
            {audioError && <Alert severity="error" onClose={() => setAudioError('')}>{audioError}</Alert>}
            {audioSuccess && <Alert severity="success" onClose={() => setAudioSuccess('')}>{audioSuccess}</Alert>}

            <Typography variant="body2" color="text.secondary">
              Audio này sẽ được dùng cho toàn bộ phần Listening
            </Typography>

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Chọn file audio từ máy tính
              <Input
                hidden
                accept="audio/mpeg,audio/wav,audio/m4a,audio/aac,audio/ogg"
                type="file"
                onChange={handleAudioFileChange}
              />
            </Button>

            <TextField
              label="Hoặc nhập đường dẫn URL"
              value={audioForm}
              onChange={(e) => {
                setAudioForm(e.target.value);
                setUploadedAudioFile(null);
                setAudioError('');
              }}
              fullWidth
              placeholder="https://example.com/audio.mp3"
              multiline
              rows={2}
            />

            {uploadedAudioFile && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip 
                  label={uploadedAudioFile.name} 
                  onDelete={handleClearAudioFile}
                  color="primary"
                />
              </Stack>
            )}

            {audioForm && (
              <Box>
                <Typography variant="caption" color="text.secondary">Preview audio:</Typography>
                <Box
                  component="audio"
                  controls
                  sx={{
                    width: '100%',
                    mt: 1,
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <source src={audioForm} type="audio/mpeg" />
                  Trình duyệt của bạn không hỗ trợ audio.
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenAudioDialog(false); setAudioForm(''); setUploadedAudioFile(null); setAudioError(''); }}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveAudio} disabled={!audioForm.trim()}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
