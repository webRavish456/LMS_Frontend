'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const DeleteAdaptiveLearning = ({ open, handleClose, handleDelete, selectedData }) => {
  const handleConfirm = () => {
    handleDelete(selectedData.id);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Delete Learner</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{selectedData?.learnerName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAdaptiveLearning;
