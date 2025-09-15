import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";

const CreateVideoClass = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    enrollmentNo: "",
    subjectName: "",
    teacherName: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call parent handler with new data
    handleCreate(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField 
        label="Student Name" 
        name="studentName" 
        value={formData.studentName} 
        onChange={handleChange} 
        required 
      />
      <TextField 
        label="Enrollment No" 
        name="enrollmentNo" 
        value={formData.enrollmentNo} 
        onChange={handleChange} 
        required 
      />
      <TextField 
        label="Subject Name" 
        name="subjectName" 
        value={formData.subjectName} 
        onChange={handleChange} 
        required 
      />
      <TextField 
        label="Teacher Name" 
        name="teacherName" 
        value={formData.teacherName} 
        onChange={handleChange} 
        required 
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" type="submit">Create</Button>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default CreateVideoClass;
