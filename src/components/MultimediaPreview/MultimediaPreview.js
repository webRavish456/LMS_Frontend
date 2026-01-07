'use client';
import React from 'react';
import { Button } from '@mui/material';

const MultimediaPreview = ({ onUpload }) => {
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return <Button variant="outlined" component="label">Upload Multimedia<input type="file" hidden onChange={handleFileChange} /></Button>;
};

export default MultimediaPreview;
