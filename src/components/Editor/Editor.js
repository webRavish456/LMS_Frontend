
'use client';

import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const Editor = ({ onSave }) => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    if(onSave) onSave(content);
    setContent('');
  };

  return (
    <Box mb={2}>
      <TextField
        label="Course Content"
        multiline
        rows={6}
        fullWidth
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button variant="contained" sx={{ mt: 1 }} onClick={handleSave}>
        Save Content
      </Button>
    </Box>
  );
};

export default Editor;
