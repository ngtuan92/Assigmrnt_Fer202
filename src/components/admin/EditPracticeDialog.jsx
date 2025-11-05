import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Stack
} from '@mui/material';

export default function EditPracticeDialog({ open, onClose, practice, onSubmit }) {
  const [form, setForm] = useState({ 
    title: '', 
    durationMinutes: 120, 
    description: '' 
  });

  useEffect(() => {
    if (practice) {
      setForm({
        title: practice.title || '',
        durationMinutes: practice.durationMinutes || 120,
        description: practice.description || ''
      });
    }
  }, [practice]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    const success = await onSubmit(practice.id, form);
    if (success) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa Practice</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            fullWidth
            required
          />
          <TextField
            type="number"
            label="Thời lượng (phút)"
            value={form.durationMinutes}
            onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
            fullWidth
          />
          <TextField
            label="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}
