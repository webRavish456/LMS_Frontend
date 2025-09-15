"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function LeaveForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    reason: "",
    date: "",
    attachment: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange=(e)=>{
    setFormData({...formData, attachment:e.target.files[0]});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Leave Request Submitted by ${formData.name}`);
    console.log("Leave Data:", formData);
    setFormData({ name: "", reason: "", date: "",attachment:null });
    onClose(); // call close function
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 400,
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" align="center">
        Leave Request Form
      </Typography>

      <TextField
        label="Student Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Reason"
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        required
      />
      <TextField
        label="Date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />

      <Button variant="outlined" component="label">
        upload Attachment
        <input type="file" hidden onChange={handleFileChange0}/>
      </Button>
      
    </Box>
  );
}
