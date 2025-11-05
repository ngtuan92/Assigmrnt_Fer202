import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Stack
} from '@mui/material';

export default function CreatePracticeDialog({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ 
    title: '', 
    durationMinutes: 120, 
    description: '' 
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    const success = await onSubmit(form);
    if (success) {
      setForm({ title: '', durationMinutes: 120, description: '' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo Practice mới</DialogTitle>
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
        <Button variant="contained" onClick={handleSubmit}>Tạo</Button>
      </DialogActions>
    </Dialog>
  );
}
