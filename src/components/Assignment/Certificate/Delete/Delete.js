'use client';
import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';

const DeleteCertificate = ({ handleDelete, handleClose, isDeleting }) => {
  return (
    <Box>
      <Typography>Are you sure you want to delete this certificate?</Typography>
      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
      </Stack>
    </Box>
  );
};

export default DeleteCertificate;
