"use client";
import React, { useState } from "react";
import { Box, TextField, Grid, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";

const CreateVideoClass = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    enrollmentNo: "",
    subjectName: "",
    teacherName: "",
  });

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${Base_url}/recorded-class`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();
      if (res.status === "success") {
        toast.success("Create Successfully!");
        handleCreate(); 
        handleClose();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Student Name" name="studentName" onChange={(e) => setFormData({...formData, studentName: e.target.value})} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Enrollment No" name="enrollmentNo" onChange={(e) => setFormData({...formData, enrollmentNo: e.target.value})} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Subject Name" name="subjectName" onChange={(e) => setFormData({...formData, subjectName: e.target.value})} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Teacher Name" name="teacherName" onChange={(e) => setFormData({...formData, teacherName: e.target.value})} required />
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained" color="primary">Save to Database</Button>
      </Box>
    </Box>
  );
};

export default CreateVideoClass;