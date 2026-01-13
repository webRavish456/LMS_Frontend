"use client";

import { Button, TextField, Box, MenuItem, Grid, Typography, FormControl, InputLabel, Select } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Create({ onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    profile: "",
    leaveType: "",
    leaveDuration: "Single day",
    date: new Date().toISOString().split('T')[0],
    reason: "",
    attachments: null
  });

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // ✅ Payload ko Controller ke variables se EXACT match karein
    const payload = {
      profile: formData.profile,
      date: formData.date,
      time: new Date().toISOString(),
      leaveDuration: formData.leaveDuration,
      leaveType: formData.leaveType,
      activity: "Pending", // Controller ko 'activity' field chahiye
      reason: formData.reason,
      attachments: formData.attachments ? formData.attachments.name : null
    };

    try {
      // ✅ Route path must be '/leave-status' as per your routes.js
      const response = await fetch(`${Base_url}/leave-status`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      
      if (res.success) {
        toast.success("Leave Request Saved!");
        if (onRefresh) onRefresh(); 
        onClose(); 
      } else {
        // Backend ka actual error message yahan dikhega
        toast.error(res.message || "Submission Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server connection failed. Is backend running?");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Employee Name" required 
            onChange={(e) => setFormData({...formData, profile: e.target.value})} />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Leave Type</InputLabel>
            <Select value={formData.leaveType} label="Leave Type"
              onChange={(e) => setFormData({...formData, leaveType: e.target.value})}>
              <MenuItem value="Paid Casual">Paid Casual</MenuItem>
              <MenuItem value="Paid Sick">Paid Sick</MenuItem>
              <MenuItem value="Unpaid Casual">Unpaid Casual</MenuItem>
              <MenuItem value="Unpaid Sick">Unpaid Sick</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Duration</InputLabel>
            <Select value={formData.leaveDuration} label="Duration"
              onChange={(e) => setFormData({...formData, leaveDuration: e.target.value})}>
              <MenuItem value="Single day">Single day</MenuItem>
              <MenuItem value="Multi day">Multi day</MenuItem>
              <MenuItem value="Half day">Half day</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }}
            value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={2} label="Reason Note" required
            onChange={(e) => setFormData({...formData, reason: e.target.value})} />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </Grid>
      </Grid>
    </Box>
  );
}