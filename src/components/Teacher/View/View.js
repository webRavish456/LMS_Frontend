"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider } from "@mui/material";

export default function View({ open, onClose, teacher }) {
  if (!teacher) return null;

  // 1. उन Keys की लिस्ट जिन्हें आप नहीं दिखाना चाहते
  const keysToHide = [
    '_id', 
    '__v', 
    'updatedAt', 
    'createdAt', 
    'companyDetails', // इसे छुपाया गया
    'documents',      // इसे छुपाया गया
    'bankDetails',    // इसे छुपाया गया
    'status'
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', color: '#072eb0' }}>
        Teacher Profile
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.keys(teacher).map((key) => {
            // अगर key 'keysToHide' लिस्ट में है, तो उसे रेंडर मत करो
            if (keysToHide.includes(key)) return null;

            return (
              <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize', color: '#555' }}>
                  {key.replace(/([A-Z])/g, " $1")}:
                </Typography>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
                  {String(teacher[key])}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
        <Button onClick={onClose} variant="contained" fullWidth sx={{ backgroundColor: "#072eb0" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}