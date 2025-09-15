"use client";
import React, { useState } from "react";
import { Box, TextField, Grid, Button } from "@mui/material";

const EditVideoClass = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState(editData || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(true); // refresh parent
    handleClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, minWidth: 400 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth required label="Student Name" name="studentName" value={formData.studentName || ""} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth required label="Enrollment No" name="enrollmentNo" value={formData.enrollmentNo || ""} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth required label="Subject Name" name="subjectName" value={formData.subjectName || ""} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth required label="Teacher Name" name="teacherName" value={formData.teacherName || ""} onChange={handleChange} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
        <Button type="submit" variant="contained" color="primary">Update</Button>
      </Box>
    </Box>
  );
};

export default EditVideoClass;
