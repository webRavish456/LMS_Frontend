"use client";
import React, { useState, useEffect } from "react";
import { Box, TextField, Grid, Button } from "@mui/material";
import { toast } from "react-toastify";

const EditTeacher = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({ name: "", subject: "", email: "", mobile: "" });

  useEffect(() => {
    if (editData) setFormData(editData);
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/teacher/${editData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("जानकारी अपडेट हो गई!");
        handleUpdate();
        handleClose();
      }
    } catch (error) { toast.error("अपडेट विफल"); }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}><TextField fullWidth label="नाम" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="विषय" value={formData.subject} onChange={(e)=>setFormData({...formData, subject: e.target.value})} /></Grid>
      </Grid>
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">Update</Button>
      </Box>
    </Box>
  );
};

export default EditTeacher;