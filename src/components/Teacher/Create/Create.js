"use client";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box } from "@mui/material";
import { toast } from "react-toastify";
import TextFeild from "@mui/material/TextField";

const CreateTeacher = ({ handleClose, handleCreate }) => {
  const [formData, setFormData] = useState({
    teacherName: "",
    emailId: "",
    mobileNo: "",
    courseName: "",
    Dob:"",
    gender: "Male",
    qualification: "",
    experience: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    if (!formData.teacherName || !formData.emailId || !formData.mobileNo) {
      toast.error("Please fill Name, Email, and Mobile!");
      return;
    }
    
    await handleCreate(formData); 
  };

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Add New Teacher Details</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Teacher Name" name="teacherName" fullWidth onChange={handleChange} />
          <TextField label="Email ID" name="emailId" fullWidth onChange={handleChange} />
          <TextField label="Mobile Number" name="mobileNo" fullWidth onChange={handleChange} />
          <TextField label="Department" name="courseName" fullWidth onChange={handleChange} />
          <TextFeild label="Dob" name="Dob" fullWidth onChange={handleChange}/>
          <TextField select label="Gender" name="gender" value={formData.gender} fullWidth onChange={handleChange}>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
          <TextField label="Experience" name="experience" type="number" fullWidth onChange={handleChange} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={onSubmit} sx={{ backgroundColor: "#072eb0" }}>Save Teacher</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTeacher;