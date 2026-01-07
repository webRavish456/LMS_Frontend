"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";

export default function View({ open, onClose, teacher }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Teacher Details</DialogTitle>
      <DialogContent dividers>
        {teacher ? (
          <Box>
            {Object.keys(teacher).map((key) => (
              <Typography key={key}><strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {teacher[key]}</Typography>
            ))}
          </Box>
        ) : (
          <Typography>No data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
