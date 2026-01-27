'use client';

import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';

const EditAttendance = ({ data, onUpdate, onClose }) => {
  const [form, setForm] = useState({
    profile: '',
    day: '',
    status: 'P',
  });

  // 🔁 Prefill data when dialog opens
  useEffect(() => {
    if (data) {
      setForm({
        profile: data.profile || '',
        day: '',
        status: 'P',
      });
    }
  }, [data]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.profile || !form.day) {
      alert('Profile and Day are required');
      return;
    }

    onUpdate(form); // send updated data to page.js
    onClose();
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Profile (readonly) */}
      <TextField
        label="Profile"
        name="profile"
        value={form.profile}
        disabled
      />

      {/* Day */}
      <TextField
        label="Day (1-31)"
        name="day"
        type="number"
        value={form.day}
        onChange={handleChange}
      />

      {/* Status */}
      <TextField
        select
        label="Status"
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <MenuItem value="P">Present</MenuItem>
        <MenuItem value="A">Absent</MenuItem>
        <MenuItem value="L">Leave</MenuItem>
      </TextField>

      {/* Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditAttendance;
