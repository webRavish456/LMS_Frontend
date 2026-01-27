"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function ViewAttendance({ open, onClose, data }) {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        View Attendance
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography><b>Employee:</b> {data.employee}</Typography>
          <Typography><b>Punch In:</b> {data.punchIn}</Typography>
          <Typography><b>Punch Out:</b> {data.punchOut}</Typography>
          <Typography><b>Note:</b> {data.note}</Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
