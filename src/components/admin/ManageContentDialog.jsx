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
  Box
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
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

  const handleAddQuestion = () => {
    if (!form.id || !form.questionText) return;
    
    const newQuestion = {
      type: form.type,
      questionText: form.questionText,
      option: form.option.filter(o => o.trim()),
      correctAnswer: form.correctAnswer,
      src: form.src || ''
    };

    setQuestions([...questions, newQuestion]);
    setForm({
      type: 'MC',
      questionText: '',
      option: ['', '', '', ''],
      correctAnswer: '',
      src: ''
    });
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = async () => {
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
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Quản lý câu hỏi - {sectionId === 'reading' ? `Group ${group?.groupId}` : `Bài ${group?.id}`}
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" mb={2}>Thêm câu hỏi mới</Typography>
              <Stack spacing={2}>
               
                <TextField
                  label="Nội dung câu hỏi"
                  value={form.questionText}
                  onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                  multiline
                  rows={2}
                  size="small"
                />
                
                {/* 4 đáp án */}
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
                    size="small"
                  />
                ))}
                
                <TextField
                  label="Đáp án đúng"
                  value={form.correctAnswer}
                  onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                  size="small"
                  placeholder="A, B, C, hoặc D"
                />
                
                {sectionId === 'listening' && (
                  <TextField
                    label="Hình ảnh (nếu có)"
                    value={form.src}
                    onChange={(e) => setForm({ ...form, src: e.target.value })}
                    size="small"
                  />
                )}
                
                <Button variant="contained" startIcon={<Add />} onClick={handleAddQuestion}>
                  Thêm câu hỏi
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Divider />

          {/* Danh sách câu hỏi */}
          <Typography variant="subtitle1" fontWeight="600">
            Danh sách câu hỏi ({questions.length})
          </Typography>

          {questions.length === 0 ? (
            <Typography color="text.secondary">Chưa có câu hỏi nào</Typography>
          ) : (
            <Stack spacing={2}>
              {questions.map((q) => (
                <Card key={q.id} variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="600" mb={1}>
                          Câu {q.id}: {q.questionText}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Đáp án: {q.option?.join(', ')} | Đúng: {q.correctAnswer}
                        </Typography>
                      </Box>
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
