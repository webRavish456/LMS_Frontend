"use client";
import React, { useState } from "react";
import { Box, TextField, Grid, Button } from "@mui/material";
import { toast } from "react-toastify";

const CreateIncome = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({ source: "", amount: "", date: new Date().toISOString().split('T')[0] });
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/income`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const res = await response.json();
      if (res.status === "success" || res.success) {
        toast.success("Income added successfully!");
        handleCreate();
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to add income");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}><TextField fullWidth label="Income Source" required value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Amount" type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} /></Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained">Save Income</Button>
      </Box>
    </Box>
  );
};

export default CreateIncome;