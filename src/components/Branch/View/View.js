"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const View = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Branch Details</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <strong>Branch ID:</strong> {data.branchId}
        </Typography>
        <Typography gutterBottom>
          <strong>Branch Name:</strong> {data.branchName}
        </Typography>
        <Typography gutterBottom>
          <strong>Location Address:</strong> {data.location}
        </Typography>
        <Typography gutterBottom>
          <strong>Contact Info:</strong> {data.contact}
        </Typography>
        <Typography gutterBottom>
          <strong>Status:</strong> {data.status}
        </Typography>
        <Typography gutterBottom>
          <strong>Creation Date:</strong> {data.createdAt}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default View;
