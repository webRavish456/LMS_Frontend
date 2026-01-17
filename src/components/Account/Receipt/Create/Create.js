"use client";
import React, { useState } from "react";
import { Box, TextField, Grid, Button } from "@mui/material";
import { toast } from "react-toastify";

const CreateReceipt = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({ 
    number: "", 
    amount: "", 
    date: new Date().toISOString().split('T')[0] 
  });
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const res = await response.json();
      if (res.status === "success" || res.success) {
        toast.success("Receipt added successfully!");
        handleCreate();
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to add receipt");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}><TextField fullWidth label="Receipt Number" placeholder="e.g. R-101" required value={formData.number} onChange={(e) => setFormData({...formData, number: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Amount" type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} /></Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </Box>
  );
};

export default CreateReceipt; // Export Default ज़रूरी है