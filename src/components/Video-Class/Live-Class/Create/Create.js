"use client";
import React, { useState } from "react";
import { Box, TextField, Grid, Button, Typography, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

const CreateVideoClass = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({
    title: "",        // Required in Model
    description: "",  // Required in Model
    courseName: "",
    teacherName: "",
    date: "",         // Required in Model
    timing: "",       // Required in Model
    duration: "",     // Required in Model
    meetingLink: "",  // Required in Model
  });

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${Base_url}/live-class`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();

      if (res.success || res.status === "success") {
        toast.success("Live Class Added Successfully!");
        handleCreate(); 
        handleClose();
      } else {
        // अगर बैकएंड से एरर आए तो यहाँ दिखेगा
        toast.error(res.message || "Failed to create: Check all fields");
      }
    } catch (error) {
      toast.error("Network Error: Could not connect to server");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxHeight: "80vh", overflowY: "auto" }}>
      <Grid container spacing={3}>
        
        {/* Title */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Title (Required)</Typography>
          <TextField fullWidth size="small" name="title" value={formData.title} onChange={handleChange} required />
        </Grid>

        {/* Course Name */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Course Name</Typography>
          <TextField fullWidth size="small" name="courseName" value={formData.courseName} onChange={handleChange} />
        </Grid>

        {/* Teacher Name */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Teacher Name</Typography>
          <TextField fullWidth size="small" name="teacherName" value={formData.teacherName} onChange={handleChange} />
        </Grid>

        {/* Date */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Date (Required)</Typography>
          <TextField fullWidth type="date" size="small" name="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleChange} required />
        </Grid>

        {/* Timing */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Timing (e.g. 10:00 AM)</Typography>
          <TextField fullWidth size="small" name="timing" value={formData.timing} onChange={handleChange} required />
        </Grid>

        {/* Duration */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Duration (in mins/hrs)</Typography>
          <TextField fullWidth size="small" name="duration" value={formData.duration} onChange={handleChange} required />
        </Grid>

        {/* Meeting Link */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Meeting Link (Required)</Typography>
          <TextField fullWidth size="small" name="meetingLink" placeholder="Zoom/Google Meet Link" value={formData.meetingLink} onChange={handleChange} required />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Description (Required)</Typography>
          <TextField fullWidth multiline rows={3} name="description" value={formData.description} onChange={handleChange} required />
        </Grid>

      </Grid>
      
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: "#007bff" }}>Save Class</Button>
      </Box>
    </Box>
  );
};

export default CreateVideoClass;