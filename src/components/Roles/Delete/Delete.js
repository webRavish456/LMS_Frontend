'use client'
import React from "react";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';

const DeleteRole = ({ roleName, onDelete, onCancel }) => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid #fee2e2' }}>
      <WarningIcon sx={{ color: '#ef4444', fontSize: 50, mb: 2 }} />
      <Typography variant="h6">Are you sure?</Typography>
      <Typography color="text.secondary" mb={3}>
        You are about to delete the <b>{roleName}</b> role. This action cannot be undone.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="outlined" onClick={onCancel}>No, Keep it</Button>
        <Button variant="contained" color="error" onClick={onDelete}>Yes, Delete Role</Button>
      </Stack>
    </Paper>
  );
};

export default DeleteRole;