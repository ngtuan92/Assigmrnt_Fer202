import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Stack,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { MenuBook, Headphones } from '@mui/icons-material';
import { practiceService } from '../../services/practiceService';
import ReadingSection from './ReadingGroupsList';
import ListeningSection from './ListeningGroupsList';

export default function PracticeDetailDialog({ open, onClose, practice, onUpdate }) {
  const [tab, setTab] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && practice) {
      setLoading(true);
      practiceService.getQuiz(practice.id)
        .then(data => setQuiz(data))
        .finally(() => setLoading(false));
    }
  }, [open, practice]);

  const handleClose = () => {
    setTab(0);
    setQuiz(null);
    onClose();
  };

  if (!practice) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{practice.title}</Typography>
          <Stack direction="row" spacing={1}>
            <Chip 
              icon={<MenuBook />} 
              label="Reading" 
              color={practice.hasReading ? 'success' : 'default'} 
            />
            <Chip 
              icon={<Headphones />} 
              label="Listening" 
              color={practice.hasListening ? 'success' : 'default'} 
            />
          </Stack>
        </Stack>
      </DialogTitle>
      
      <DialogContent dividers>
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="Reading Section" icon={<MenuBook />} iconPosition="start" />
          <Tab label="Listening Section" icon={<Headphones />} iconPosition="start" />
        </Tabs>
        
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : (
          <>
            {tab === 0 && (
              <ReadingSection 
                quiz={quiz} 
                practiceId={practice.id} 
                onUpdate={onUpdate} 
              />
            )}
            {tab === 1 && (
              <ListeningSection 
                quiz={quiz} 
                practiceId={practice.id} 
                onUpdate={onUpdate} 
              />
            )}
          </>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}