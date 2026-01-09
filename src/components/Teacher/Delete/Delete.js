"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function Delete({ open, onClose, teacher, onConfirm }) {
  if (!teacher) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: '#e6130b' }}>Confirm Delete</DialogTitle>
      <DialogContent dividers>
        <Typography>
          क्या आप वाकई <strong>{teacher.teacherName}</strong> को डिलीट करना चाहते हैं?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={() => onConfirm(teacher._id)} // यहाँ ID पास हो रही है
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}