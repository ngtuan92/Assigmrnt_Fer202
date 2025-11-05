import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Stack,
  CircularProgress,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { practiceService } from '../../services/practiceService';
import ReadingGroupsList from './ReadingGroupsList';

export default function ManageReadingDialog({ open, onClose, practice, onUpdate }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

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
                description: '', 
                audio: '', 
                groups: [] 
              }
            ]
          });
        })
        .finally(() => setLoading(false));
    }
  }, [open, practice]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Quản lý Reading - {practice?.title}</Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress />
          </Box>
        ) : quiz ? (
          <ReadingGroupsList 
            quiz={quiz} 
            practiceId={practice?.id}
            onUpdate={() => {
              practiceService.getQuiz(practice.id).then(setQuiz);
              onUpdate();
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
