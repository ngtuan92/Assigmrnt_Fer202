import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { practiceService } from '../../services/practiceService';
import ManageQuestionsDialog from './ManageQuestionsDialog';

export default function ListeningGroupsList({ quiz, practiceId, onUpdate }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openQuestions, setOpenQuestions] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [form, setForm] = useState({ directions: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const listeningSection = quiz?.sections?.find(s => s.sectionId === 'listening');
  const groups = listeningSection?.groups || [];

  const getNextId = () => {
    if (groups.length === 0) return 1;
    const maxId = Math.max(...groups.map(g => g.id || 0));
    return maxId + 1;
  };

  const getNextGroupId = () => {
    if (groups.length === 0) return 1;
    const maxGroupId = Math.max(...groups.map(g => g.groupId || 0));
    return maxGroupId + 1;
  };

  const handleAdd = async () => {
    setError('');
    if (!form.directions.trim()) {
      setError('Vui lòng nhập directions');
      return;
    }

    try {
      const nextGroupId = getNextGroupId();
      const newGroup = {
        groupId: nextGroupId, // Gán groupId tăng dần
        id: getNextId(),
        type: 'AudioMC',
        directions: form.directions,
        question: []
      };

      const updatedSections = quiz.sections.map(s =>
        s.sectionId === 'listening'
          ? { ...s, groups: [...s.groups, newGroup] }
          : s
      );

      await practiceService.updateQuiz(practiceId, { ...quiz, sections: updatedSections });
      setSuccess(`Thêm bài Listening (Bài ${nextGroupId}) thành công`);
      setForm({ directions: '' });
      setOpenAdd(false);
      onUpdate();
    } catch (e) {
      setError('Thêm bài thất bại: ' + e.message);
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Xóa bài này?')) return;

    try {
      const updatedSections = quiz.sections.map(s =>
        s.sectionId === 'listening'
          ? { ...s, groups: s.groups.filter(g => g.id !== groupId) }
          : s
      );
      await practiceService.updateQuiz(practiceId, { ...quiz, sections: updatedSections });
      setSuccess('Xóa bài Listening thành công');
      onUpdate();
    } catch (e) {
      setError('Xóa thất bại: ' + e.message);
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Danh sách bài Listening</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={() => setOpenAdd(true)}>
          Thêm bài Listening
        </Button>
      </Stack>

      {groups.length === 0 ? (
        <Typography color="text.secondary">Chưa có bài Listening nào. Hãy thêm bài mới!</Typography>
      ) : (
        <Stack spacing={2}>
          {groups.map((group, index) => (
            <Card key={group.id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                  <Box flex={1} minWidth={0}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Part {group.groupId || index + 1}
                      </Typography>
                      <Chip
                        label={`${group.question?.length || 0} câu`}
                        size="small"
                        color="secondary"
                      />
                    </Stack>
                    {group.directions && (
                      <Typography variant="body2" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {group.directions}
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={0.5} flexShrink={0}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        setSelectedGroup(group);
                        setOpenQuestions(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      title="Xóa bài"
                      onClick={() => handleDelete(group.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}

        </Stack>
      )}

      {/* Dialog thêm bài */}
      <Dialog open={openAdd} onClose={() => { setOpenAdd(false); setForm({ directions: '' }); }} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm bài Listening mới</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Bài sẽ được tự động đánh số {getNextId()}
          </Typography>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Directions"
              value={form.directions}
              onChange={(e) => setForm({ ...form, directions: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Nhập hướng dẫn cho bài này..."
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenAdd(false); setForm({ directions: '' }); }}>Hủy</Button>
          <Button variant="contained" onClick={handleAdd}>Thêm</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog quản lý câu hỏi */}
      {selectedGroup && (
        <ManageQuestionsDialog
          open={openQuestions}
          onClose={() => {
            setOpenQuestions(false);
            setSelectedGroup(null);
          }}
          quiz={quiz}
          practiceId={practiceId}
          sectionId="listening"
          group={selectedGroup}
          onUpdate={onUpdate}
        />
      )}
    </Box>
  );
}
