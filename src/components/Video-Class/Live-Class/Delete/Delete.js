"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const DeleteVideoClass = ({ handleDelete, isDeleting, handleClose }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Are you sure you want to delete this Video Class record?
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteVideoClass;
