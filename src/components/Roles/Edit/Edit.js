'use client'
import React, { useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, TextField, Stack } from "@mui/material";

const EditRole = ({ initialData, onUpdate, onCancel }) => {
  const [permissions, setPermissions] = useState(initialData.permissions);

  const handleCheck = (index, field) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Edit Permissions: {initialData.roleName}</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={onCancel}>Back</Button>
          <Button variant="contained" color="success" onClick={() => onUpdate(permissions)}>Update</Button>
        </Stack>
      </Stack>
    
    </Box>
  );
};

export default EditRole;