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
  Alert,
  Input
} from '@mui/material';
import { Add, Delete, Edit, CloudUpload } from '@mui/icons-material';
import { practiceService } from '../../services/practiceService';
import ManageQuestionsDialog from './ManageQuestionsDialog';

export default function ReadingGroupsList({ quiz, practiceId, onUpdate }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openQuestions, setOpenQuestions] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [form, setForm] = useState({ directions: '', src: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const readingSection = quiz?.sections?.find(s => s.sectionId === 'reading');
  const groups = readingSection?.groups || [];

  const getNextGroupId = () => {
    if (groups.length === 0) return '1';
    const maxId = Math.max(...groups.map(g => parseInt(g.groupId) || 0));
    return String(maxId + 1);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm({ ...form, src: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setForm({ ...form, src: '' });
  };

  const handleAdd = async () => {
    setError('');
    if (!form.directions.trim()) {
      setError('Vui lòng nhập directions');
      return;
    }
    
    try {
      const nextId = getNextGroupId();
      const newGroup = {
        groupId: nextId,
        directions: form.directions,
        src: form.src || '',
        questions: []
      };

      const updatedSections = quiz.sections.map(s =>
        s.sectionId === 'reading' 
          ? { ...s, groups: [...s.groups, newGroup] }
          : s
      );

      await practiceService.updateQuiz(practiceId, { ...quiz, sections: updatedSections });
      setSuccess(`Thêm Part Reading (Part ${nextId}) thành công`);
      setForm({ directions: '', src: '' });
      setUploadedFile(null);
      setOpenAdd(false);
      onUpdate();
    } catch (e) {
      setError('Thêm Part thất bại: ' + e.message);
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Xóa Part này?')) return;
    
    try {
      const updatedSections = quiz.sections.map(s =>
        s.sectionId === 'reading'
          ? { ...s, groups: s.groups.filter(g => g.groupId !== groupId) }
          : s
      );
      await practiceService.updateQuiz(practiceId, { ...quiz, sections: updatedSections });
      setSuccess('Xóa Part Reading thành công');
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
        <Typography variant="h6">Danh sách Part Reading</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={() => setOpenAdd(true)}>
          Thêm Part Reading
        </Button>
      </Stack>

      {groups.length === 0 ? (
        <Typography color="text.secondary">Chưa có Part Reading nào. Hãy thêm Part mới!</Typography>
      ) : (
        <Stack spacing={2}>
          {groups.map((group) => (
            <Card key={group.groupId} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                  <Box flex={1}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Part {group.groupId}
                      </Typography>
                      <Chip 
                        label={`${group.questions?.length || 0} câu hỏi`} 
                        size="small" 
                        color="primary"
                      />
                    </Stack>
                    {group.directions && (
                      <Typography variant="body2" color="text.secondary" noWrap mb={1}>
                        {group.directions}
                      </Typography>
                    )}
                  </Box>
                  {group.src && (
                    <Box
                      component="img"
                      src={group.src}
                      alt="part"
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  )}
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setSelectedGroup(group);
                        setOpenQuestions(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(group.groupId)}
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

      <Dialog open={openAdd} onClose={() => { setOpenAdd(false); setForm({ directions: '', src: '' }); setUploadedFile(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm Part Reading mới</DialogTitle>
        <DialogContent>
        
          <Stack spacing={2} mt={1}>
            <TextField
              label="Directions"
              value={form.directions}
              onChange={(e) => setForm({ ...form, directions: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Nhập hướng dẫn cho Part này..."
              required
            />

            <Typography variant="subtitle2" fontWeight="600">
              Hình ảnh (Tùy chọn)
            </Typography>
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Chọn file từ máy tính
              <Input
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileChange}
              />
            </Button>

            <TextField
              label="Hoặc nhập đường dẫn URL"
              value={form.src}
              onChange={(e) => {
                setForm({ ...form, src: e.target.value });
                setUploadedFile(null);
              }}
              fullWidth
              placeholder="https://example.com/image.png"
              size="small"
            />

            {uploadedFile && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip 
                  label={uploadedFile.name} 
                  onDelete={handleClearFile}
                  color="primary"
                />
              </Stack>
            )}

            {form.src && (
              <Box>
                <Typography variant="caption" color="text.secondary">Preview:</Typography>
                <Box
                  component="img"
                  src={form.src}
                  alt="preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '150px',
                    mt: 1,
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                  }}
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenAdd(false); setForm({ directions: '', src: '' }); setUploadedFile(null); }}>Hủy</Button>
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
          sectionId="reading"
          group={selectedGroup}
          onUpdate={onUpdate}
        />
      )}
    </Box>
  );
}
