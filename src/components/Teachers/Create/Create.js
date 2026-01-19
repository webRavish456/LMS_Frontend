"use client";
import React, { useState } from "react";
import { Box, TextField, Grid, Button } from "@mui/material";
import { toast } from "react-toastify";

const CreateTeacher = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({ name: "", subject: "", email: "", mobile: "", password: "teacher123" });
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const res = await response.json();
      if (res.success) {
        toast.success("Teacher registered successfully!");
        handleCreate();
        handleClose();
      }
    } catch (error) {
      toast.error("Error creating record");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}><TextField fullWidth label="Full Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Subject Specialty" required onChange={(e) => setFormData({...formData, subject: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Email Address" type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Mobile Number" onChange={(e) => setFormData({...formData, mobile: e.target.value})} /></Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained">Register</Button>
      </Box>
    </Box>
  );
};

export default CreateTeacher;