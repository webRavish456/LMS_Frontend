"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

export default function EditAttendance({
  open,
  onClose,
  formData,
  onChange,
  onUpdate,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600 }}>
        Edit Attendance
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Employee"
            name="employee"
            value={formData.employee}
            onChange={onChange}
          />
          <TextField
            label="Punch in date and time"
            type="datetime-local"
            name="punchIn"
            value={formData.punchIn}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Punch out date and time"
            type="datetime-local"
            name="punchOut"
            value={formData.punchOut}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Reason note"
            multiline
            rows={4}
            name="note"
            value={formData.note}
            onChange={onChange}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onUpdate}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
