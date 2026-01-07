"use client";

import { Box, Typography, Button, CircularProgress } from "@mui/material";

const DeleteSchedule = ({ handleDelete, isDeleting, handleClose }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom align="center" color="error">
        Are you sure you want to delete this Schedule?
      </Typography>

      <Typography variant="body2" align="center" sx={{ mb: 3 }}>
        This action cannot be undone and will permanently remove the schedule
        from the system.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <CircularProgress size={24} color="inherit" /> : "Delete"}
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteSchedule;
