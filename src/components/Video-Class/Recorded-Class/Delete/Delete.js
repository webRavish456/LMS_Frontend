import React from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";

const DeleteVideoClass = ({ handleDelete, isDeleting, handleClose }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Are you sure you want to delete this recorded class?
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : null}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteVideoClass;
