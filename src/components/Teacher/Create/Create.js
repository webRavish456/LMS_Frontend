"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";

const CreateTeacher = ({ handleClose, handleCreate }) => {
  const [formData, setFormData] = useState({
    teacherName: "",
    emailId: "",
    mobileNo: "",
    courseName: "",
    gender: "",
    qualification: "",
    experience: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.teacherName || !formData.emailId || !formData.mobileNo) {
      toast.error("Teacher Name, Email and Mobile are required!");
      return;
    }

    try {
      
      const fd = new FormData();
      Object.keys(formData).forEach((k) => {
        if (formData[k] !== undefined && formData[k] !== null) fd.append(k, formData[k]);
      });

      await handleCreate(fd);

      toast.success("Teacher created successfully!");
      handleClose();
    } catch (error) {
      console.error("Error creating teacher:", error);
      toast.error(error.message || "Failed to create teacher. Please try again.");
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Teacher</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Teacher Name"
          name="teacherName"
          value={formData.teacherName}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Email ID"
          name="emailId"
          type="email"
          value={formData.emailId}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Mobile Number"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Course Name"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
        />
        <TextField
          select
          fullWidth
          margin="dense"
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField
          fullWidth
          margin="dense"
          label="Qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Experience (in years)"
          name="experience"
          type="number"
          value={formData.experience}
          onChange={handleChange}
        />
        <TextField
          select
          fullWidth
          margin="dense"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add Teacher
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTeacher;
