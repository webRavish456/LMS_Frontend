"use client";

import { 
  Button, TextField, Box, MenuItem, Grid, Typography, 
  RadioGroup, FormControlLabel, Radio, Paper, Divider 
} from "@mui/material";
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
  });

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = { 
        ...formData, 
        activity: "Pending", 
        time: new Date().toLocaleTimeString() 
    };

    try {
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
        toast.success("Leave Request Applied Successfully!");
        onRefresh();
        onClose();
      } else {
        toast.error(res.message || "Failed to submit request");
      }
    } catch (error) { 
        toast.error("Server connection failed"); 
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        p: 2, 
        maxHeight: '85vh', 
        overflowY: 'auto',
        // Styling scrollbar for a cleaner look
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#e0e0e0", borderRadius: "10px" }
      }}
    >
      <Grid container spacing={3.5}> {/* Professional vertical spacing */}
        
        {/* Employee Selection */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#444" }}>Employee</Typography>
          <TextField 
            select 
            fullWidth 
            size="small"
            name="profile"
            value={formData.profile} 
            onChange={handleChange} 
            required
          >
            <MenuItem value="Arjun Singh">Arjun Singh</MenuItem>
            <MenuItem value="rohit kumar">rohit kumar</MenuItem>
          </TextField>
        </Grid>

        {/* Leave Type */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#444" }}>Leave Type</Typography>
          <TextField 
            select 
            fullWidth 
            size="small"
            name="leaveType"
            value={formData.leaveType} 
            onChange={handleChange} 
            required
          >
            <MenuItem value="Paid Casual">Paid Casual</MenuItem>
            <MenuItem value="Paid Sick">Paid Sick</MenuItem>
            <MenuItem value="Unpaid Casual">Unpaid Casual</MenuItem>
            <MenuItem value="Unpaid Sick">Unpaid Sick</MenuItem>
          </TextField>
        </Grid>

        {/* Leave Duration (Radio Buttons) */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "#444" }}>Leave duration</Typography>
          <RadioGroup 
            row 
            name="leaveDuration"
            value={formData.leaveDuration} 
            onChange={handleChange}
          >
            <FormControlLabel value="Single day" control={<Radio size="small" />} label={<Typography variant="body2">Single day</Typography>} />
            <FormControlLabel value="Multi day" control={<Radio size="small" />} label={<Typography variant="body2">Multi day</Typography>} />
            <FormControlLabel value="Half day" control={<Radio size="small" />} label={<Typography variant="body2">Half day</Typography>} />
          </RadioGroup>
        </Grid>

        {/* Date Selection */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#444" }}>Date</Typography>
          <TextField 
            fullWidth 
            type="date" 
            size="small"
            name="date"
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </Grid>

        {/* Reason Note */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#444" }}>Reason Note</Typography>
          <TextField 
            fullWidth 
            multiline 
            rows={4} 
            placeholder="Add reason note here..."
            name="reason"
            value={formData.reason} 
            onChange={handleChange} 
            required 
          />
        </Grid>

        {/* Attachments Section */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#444" }}>Attachments</Typography>
          <Paper 
            variant="outlined" 
            sx={{ 
                p: 4, 
                textAlign: 'center', 
                borderStyle: 'dashed', 
                bgcolor: '#fcfcfc',
                borderColor: '#d1d1d1',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { bgcolor: '#f5f8ff', borderColor: '#007bff' }
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 42, color: '#007bff', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Drag and drop or <span style={{ color: '#007bff', textDecoration: 'underline' }}>Browse</span>
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                Allowed file types: jpeg, jpg, png, pdf (Max size: 2MB)
            </Typography>
          </Paper>
        </Grid>

        {/* Footer Actions */}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2, pb: 1 }}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            color="inherit" 
            sx={{ px: 4, textTransform: 'none', borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ px: 5, bgcolor: "#007bff", textTransform: 'none', borderRadius: '8px' }}
          >
            Save Request
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}