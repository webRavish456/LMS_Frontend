"use client";

import { Button, TextField, Box, MenuItem, Grid, Typography, FormControl, InputLabel, Select } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Create({ onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    profile: "",
    leaveType: "",
    startDate: new Date().toISOString().split('T')[0],
    reason: "",
    attachments: null // Isme actual file object jayega
  });

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!formData.attachments) {
      toast.error("Please upload an attachment. It is required by the server.");
      return;
    }

    // ✅ Multer ke liye FormData zaroori hai
    const data = new FormData();
    data.append("profile", formData.profile);
    data.append("startDate", formData.startDate);
    data.append("leaveType", formData.leaveType);
    data.append("activity", "Pending"); // Default status
    data.append("reason", formData.reason);
    data.append("attachMents", formData.attachments); // 👈 Field name must match controller's upload.single("attachMents")

    try {
      const response = await fetch(`${Base_url}/leave-request`, {
        method: "POST",
        headers: { 
          // ❌ Content-Type manually set nahi karna hai FormData ke sath
          "Authorization": `Bearer ${token}` 
        },
        body: data, 
      });

      const res = await response.json();
      
      if (res.success) {
        toast.success("Leave Request Saved Successfully!");
        if (onRefresh) onRefresh(); 
        onClose(); 
      } else {
        toast.error(res.message || "Fill all required fields");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Server connection failed");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Employee Name (Profile)" required 
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
          <TextField fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }}
            value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth multiline rows={2} label="Reason Note" required
            onChange={(e) => setFormData({...formData, reason: e.target.value})} />
        </Grid>

        {/* --- ATTACHMENTS (REQUIRED) --- */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Upload Attachment (Required)</Typography>
          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              bgcolor: "#f9f9f9",
              cursor: "pointer",
              "&:hover": { borderColor: "#1976d2" }
            }}
            component="label"
          >
            <input type="file" hidden accept=".jpeg,.jpg,.png,.pdf" onChange={handleFileChange} required />
            <CloudUploadIcon sx={{ color: "#777", fontSize: 30 }} />
            <Typography variant="body2">Click to Browse</Typography>
            {formData.attachments && (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: "green", fontWeight: 700 }}>
                Selected: {formData.attachments.name}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save</Button>
        </Grid>
      </Grid>
    </Box>
  );
}