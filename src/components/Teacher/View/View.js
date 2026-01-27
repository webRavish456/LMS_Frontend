"use client";
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box
} from "@mui/material";

const ViewTeacher = ({ teacher, onClose }) => {
  if (!teacher) return null;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Teacher Details</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography><b>Name:</b> {teacher.teacherName}</Typography>
          <Typography><b>Email:</b> {teacher.emailid}</Typography>
          <Typography><b>Mobile:</b> {teacher.mobileNumber}</Typography>
          <Typography><b>Gender:</b> {teacher.gender}</Typography>
          <Typography><b>Experience:</b> {teacher.experience}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTeacher;
