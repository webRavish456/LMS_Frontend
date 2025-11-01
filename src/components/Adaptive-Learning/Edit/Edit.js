'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack
} from '@mui/material';

const EditAdaptiveLearning = ({ open, handleClose, handleUpdate, selectedData }) => {
  const [formData, setFormData] = useState(selectedData || {});

  useEffect(() => {
    setFormData(selectedData);
  }, [selectedData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    handleUpdate(formData);
    handleClose();
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Edit Learner</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Learner Name" name="learnerName" value={formData.learnerName} onChange={handleChange} fullWidth />
          <TextField label="Skill Level" name="skillLevel" value={formData.skillLevel} onChange={handleChange} fullWidth />
          <TextField label="Recommended Path" name="recommendedPath" value={formData.recommendedPath} onChange={handleChange} fullWidth />
          <TextField label="Progress (%)" name="progress" value={formData.progress} onChange={handleChange} fullWidth />
          <TextField label="Status" name="status" value={formData.status} onChange={handleChange} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAdaptiveLearning;
