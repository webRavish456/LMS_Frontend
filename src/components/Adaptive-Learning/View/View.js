'use client';
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Stack
} from '@mui/material';

const ViewAdaptiveLearning = ({ open, handleClose, selectedData }) => {
  if (!selectedData) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>View Learner Details</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Typography><strong>Learner Name:</strong> {selectedData.learnerName}</Typography>
          <Typography><strong>Skill Level:</strong> {selectedData.skillLevel}</Typography>
          <Typography><strong>Recommended Path:</strong> {selectedData.recommendedPath}</Typography>
          <Typography><strong>Progress (%):</strong> {selectedData.progress}</Typography>
          <Typography><strong>Status:</strong> {selectedData.status}</Typography>
          <Typography><strong>Created Date:</strong> {selectedData.createdAt || 'N/A'}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAdaptiveLearning;
