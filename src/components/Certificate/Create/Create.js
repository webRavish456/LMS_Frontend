'use client';
import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

const CreateCertificate = ({ handleCreate, handleClose }) => {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');

  const handleSubmit = () => {
    handleCreate({ name, issuer });
    handleClose();
  };

  return (
    <Box>
      <Stack spacing={2}>
        <TextField label="Student Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Issuer Name" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        <Button variant="contained" onClick={handleSubmit}>Create Certificate</Button>
      </Stack>
    </Box>
  );
};

export default CreateCertificate;
