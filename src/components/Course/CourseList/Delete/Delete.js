"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const DeleteCourseList = ({ handleDelete, isDeleting, handleClose }) => {
  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Course</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this course? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={isDeleting}
          startIcon={isDeleting && <CircularProgress size={18} color="inherit" />}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCourseList;
