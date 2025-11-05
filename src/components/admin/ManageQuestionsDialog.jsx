import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  IconButton,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Alert,
  Input,
  Chip
} from '@mui/material';
import { Add, Delete, CloudUpload } from '@mui/icons-material';
import { practiceService } from '../../services/practiceService';

export default function ManageQuestionsDialog({ open, onClose, quiz, practiceId, sectionId, group, onUpdate }) {
  const [questions, setQuestions] = useState(group?.questions || group?.question || []);
  const [form, setForm] = useState({
    type: 'MC',
    questionText: '',
    option: ['', '', '', ''],
    correctAnswer: '',
    src: ''
  });
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const getNextQuestionId = () => {
    if (questions.length === 0) return 1;
    const maxId = Math.max(...questions.map(q => q.id || 0));
    return maxId + 1;
  };

  const getValidOptions = () => {
    return form.option.filter(o => o.trim());
  };

  const getValidAnswerLetters = () => {
    const validCount = getValidOptions().length;
    const letters = [];
    for (let i = 0; i < validCount; i++) {
      letters.push(String.fromCharCode(65 + i));
    }
    return letters;
  };

  const isListening = sectionId === 'listening';

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file ảnh: PNG, JPG, JPEG, WebP, GIF');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File quá lớn, tối đa 5MB');
      return;
    }

    setError('');
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm({ ...form, src: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setForm({ ...form, src: '' });
    setError('');
  };

  const validateImageUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      setError('URL không hợp lệ');
      return false;
    }
  };

  const handleAddQuestion = () => {
    setError('');

    if (!form.questionText.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi');
      return;
    }

    const validOptions = getValidOptions();
    if (validOptions.length < 2) {
      setError('Vui lòng nhập ít nhất 2 đáp án');
      return;
    }

    if (!form.correctAnswer.trim()) {
      setError('Vui lòng chọn đáp án đúng');
      return;
    }

    const validLetters = getValidAnswerLetters();
    if (!validLetters.includes(form.correctAnswer.toUpperCase())) {
      setError(
        `Đáp án đúng phải là một trong: ${validLetters.join(', ')}. ` +
        `Bạn chỉ nhập ${validOptions.length} đáp án nhưng lại chọn ${form.correctAnswer.toUpperCase()}`
      );
      return;
    }
    
    const nextId = getNextQuestionId();
    const newQuestion = {
      id: nextId,
      type: form.type,
      questionText: form.questionText,
      option: validOptions,
      correctAnswer: form.correctAnswer.toUpperCase(),
      src: isListening ? (form.src || '') : ''
    };

    setQuestions([...questions, newQuestion]);
    setForm({
      type: 'MC',
      questionText: '',
      option: ['', '', '', ''],
      correctAnswer: '',
      src: ''
    });
    setUploadedFile(null);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    try {
      const updatedSections = quiz.sections.map(section => {
        if (section.sectionId === sectionId) {
          const updatedGroups = section.groups.map(g => {
            const groupIdField = sectionId === 'reading' ? 'groupId' : 'id';
            const questionField = sectionId === 'reading' ? 'questions' : 'question';
            
            if (g[groupIdField] === group[groupIdField]) {
              return { ...g, [questionField]: questions };
            }
            return g;
          });
          return { ...section, groups: updatedGroups };
        }
        return section;
      });

      await practiceService.updateQuiz(practiceId, { ...quiz, sections: updatedSections });
      onUpdate();
      onClose();
    } catch (e) {
      alert('Lưu thất bại: ' + e.message);
    }
  };

  const validLetters = getValidAnswerLetters();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Quản lý câu hỏi - {sectionId === 'reading' ? `Part ${group?.groupId}` : `Bài ${group?.id}`}
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Form thêm câu hỏi */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight="600" mb={2}>
                Thêm câu hỏi mới - Câu {getNextQuestionId()}
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Stack spacing={2}>
                <TextField
                  label="Nội dung câu hỏi"
                  value={form.questionText}
                  onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                  multiline
                  rows={2}
                  fullWidth
                  required
                />
                
                <Typography variant="subtitle2" fontWeight="600">Các đáp án:</Typography>
                {form.option.map((opt, idx) => (
                  <TextField
                    key={idx}
                    label={`Đáp án ${String.fromCharCode(65 + idx)}`}
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...form.option];
                      newOptions[idx] = e.target.value;
                      setForm({ ...form, option: newOptions });
                    }}
                    fullWidth
                    placeholder={`Nhập đáp án hoặc để trống`}
                  />
                ))}

                {validLetters.length > 0 && (
                  <Alert severity="info">
                    Đáp án hợp lệ: <strong>{validLetters.join(', ')}</strong>
                  </Alert>
                )}
                
                <TextField
                  label="Đáp án đúng"
                  value={form.correctAnswer}
                  onChange={(e) => setForm({ ...form, correctAnswer: e.target.value.toUpperCase() })}
                  fullWidth
                  placeholder={validLetters.length > 0 ? `Chọn: ${validLetters.join(' / ')}` : 'Nhập ít nhất 2 đáp án trước'}
                  disabled={validLetters.length < 2}
                />
                
                {/* CHỈ HIỂN THỊ NẾU LÀ LISTENING */}
                {isListening && (
                  <>
                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" fontWeight="600" mb={1}>
                        Hình ảnh (Tùy chọn)
                      </Typography>
                      
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Chọn file từ máy tính
                        <Input
                          hidden
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </Button>

                      <TextField
                        label="Hoặc nhập đường dẫn URL"
                        value={form.src}
                        onChange={(e) => {
                          const url = e.target.value;
                          setForm({ ...form, src: url });
                          setUploadedFile(null);
                          if (url) setError('');
                        }}
                        onBlur={(e) => {
                          if (e.target.value && !e.target.value.startsWith('data:')) {
                            validateImageUrl(e.target.value);
                          }
                        }}
                        fullWidth
                        placeholder="https://example.com/image.png"
                        size="small"
                      />

                      {/* Hiển thị file được chọn */}
                      {uploadedFile && (
                        <Stack direction="row" spacing={1} mt={1} alignItems="center">
                          <Chip 
                            label={uploadedFile.name} 
                            onDelete={handleClearFile}
                            color="primary"
                          />
                        </Stack>
                      )}

                      {/* Preview - CHO CẢ FILE + URL */}
                      {form.src && (
                        <Box mt={2}>
                          <Typography variant="caption" color="text.secondary">Preview:</Typography>
                          <Box
                            component="img"
                            src={form.src}
                            alt="preview"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            sx={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              mt: 1,
                              borderRadius: 1,
                              border: '1px solid #e0e0e0',
                              display: 'block'
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </>
                )}

                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  onClick={handleAddQuestion}
                  fullWidth
                  disabled={validLetters.length < 2}
                >
                  Thêm câu hỏi
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Divider />

          {/* Danh sách câu hỏi */}
          <Box>
            <Typography variant="subtitle1" fontWeight="600" mb={2}>
              Danh sách câu hỏi ({questions.length})
            </Typography>

            {questions.length === 0 ? (
              <Typography color="text.secondary">Chưa có câu hỏi nào</Typography>
            ) : (
              <Stack spacing={2}>
                {questions.map((q) => (
                  <Card key={q.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight="600" mb={1}>
                            Câu {q.id}: {q.questionText}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            <strong>Đáp án:</strong> {q.option?.join(' | ')}
                          </Typography>
                          <Typography variant="caption" color="error" display="block">
                            <strong>Đúng:</strong> {q.correctAnswer}
                          </Typography>
                        </Box>
                        {isListening && q.src && (
                          <Box
                            component="img"
                            src={q.src}
                            alt="question"
                            sx={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0'
                            }}
                          />
                        )}
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteQuestion(q.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSave}>
          Lưu tất cả
        </Button>
      </DialogActions>
    </Dialog>
  );
}
