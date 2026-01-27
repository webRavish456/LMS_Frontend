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
  Typography,
} from "@mui/material";

export default function CreateAttendance({
  open,
  onClose,
  formData,
  onChange,
  onSave,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600 }}>
        Add Attendance
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box>
            <Typography fontWeight={500} mb={1}>
              Employee
            </Typography>
            <TextField
              fullWidth
              placeholder="Search and Select Employee"
              name="employee"
              value={formData.employee}
              onChange={onChange}
            />
          </Box>

          <Box>
            <Typography fontWeight={500} mb={1}>
              Punch in date and time
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              name="punchIn"
              value={formData.punchIn}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box>
            <Typography fontWeight={500} mb={1}>
              Punch out date and time
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              name="punchOut"
              value={formData.punchOut}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box>
            <Typography fontWeight={500} mb={1}>
              Reason note for manual entry
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Enter note"
              name="note"
              value={formData.note}
              onChange={onChange}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
