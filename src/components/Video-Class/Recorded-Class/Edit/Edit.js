import React, { useState, useEffect } from "react";
import { Button, TextField, Box } from "@mui/material";

const EditVideoClass = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    enrollmentNo: "",
    subjectName: "",
    teacherName: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        studentName: editData.studentName || "",
        enrollmentNo: editData.enrollmentNo || "",
        subjectName: editData.subjectName || "",
        teacherName: editData.teacherName || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData);
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
        <Button variant="contained" type="submit">Update</Button>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default EditVideoClass;
