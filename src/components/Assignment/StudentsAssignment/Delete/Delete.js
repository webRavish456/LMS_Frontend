'use client';
import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function Delete({ data, handleClose, onConfirm }) {
  return (
    <Box sx={{ textAlign: "center", py: 2 }}>
      <WarningAmberIcon sx={{ fontSize: 60, color: "#d32f2f", mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>Are you sure?</Typography>
      <Typography sx={{ mb: 3, color: "#666" }}>
        You are about to delete assignment for <strong>{data?.studentName}</strong>. This action cannot be undone.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" sx={{ minWidth: 100 }}>
          Delete
        </Button>
      </Stack>
    </Box>
  );
}