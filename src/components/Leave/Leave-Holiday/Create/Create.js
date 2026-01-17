"use client";

import { Button, TextField, Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Create({ onClose, onRefresh }) {
  const [formData, setFormData] = useState({ 
    name: "", // बैकएंड मॉडल 'name' मांग रहा है
    date: ""  // बैकएंड मॉडल 'date' मांग रहा है
  });
  
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // ✅ बैकएंड कंट्रोलर 'multipart/form-data' मांग रहा है
    const data = new FormData();
    data.append("name", formData.name);
    data.append("date", formData.date);

    try {
      const response = await fetch(`${Base_url}/holiday`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}` 
          // Note: FormData के साथ Content-Type मैन्युअल सेट न करें
        },
        body: data,
      });

      const res = await response.json();
      if (res.status === "success") {
        toast.success("Holiday created successfully!");
        onRefresh();
        onClose();
      } else {
        toast.error(res.message || "Failed to create holiday");
      }
    } catch (error) {
      toast.error("Server connection error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, minWidth: "400px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Holiday Name</Typography>
          <TextField 
            fullWidth size="small" placeholder="e.g. Independence Day"
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required 
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Date</Typography>
          <TextField 
            fullWidth type="date" size="small" InputLabelProps={{ shrink: true }}
            value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required 
          />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: "#007bff" }}>Save</Button>
        </Grid>
      </Grid>
    </Box>
  );
}