'use client';

import React from "react";
import { 
  Box, Grid, Typography, Divider, Chip, Paper, Avatar 
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CoffeeIcon from '@mui/icons-material/Coffee';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LoginIcon from '@mui/icons-material/Login';

const ViewAttendance = ({ viewData }) => {
  // Loading check agar data na ho
  if (!viewData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">No Attendance Details Found</Typography>
      </Box>
    );
  }

  // Row Helper Component
  const InfoRow = ({ icon, label, value, color = "primary.main" }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1.5, borderRadius: '10px', bgcolor: '#fcfcfc' }}>
      <Avatar sx={{ bgcolor: color, mr: 2, width: 35, height: 35 }}>
        {React.cloneElement(icon, { sx: { fontSize: 20, color: '#fff' } })}
      </Avatar>
      <Box>
        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
          {value || "N/A"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0d1b75' }}>
          Attendance Summary
        </Typography>
        <Chip 
          label={viewData.entry || "Regular"} 
          sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: '#0d1b75' }} 
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={1}>
        {/* Profile Info */}
        <Grid item xs={12} sm={6}>
          <InfoRow icon={<PersonIcon />} label="Employee/Student Profile" value={viewData.profile} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow icon={<AssessmentIcon />} label="Overall Behavior" value={viewData.behavior} color="#4caf50" />
        </Grid>

        {/* Time Tracking */}
        <Grid item xs={12} sm={6}>
          <InfoRow icon={<LoginIcon />} label="Punched In" value={viewData.punchedIn} color="#fb8c00" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow icon={<AccessTimeIcon />} label="Punched Out" value={viewData.punchedOut} color="#f44336" />
        </Grid>

        {/* Productivity Tracking */}
        <Grid item xs={12} sm={6}>
          <InfoRow icon={<CoffeeIcon />} label="Break Duration" value={viewData.breakTime} color="#795548" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow icon={<PsychologyIcon />} label="Total Working Hours" value={viewData.totalHours} color="#9c27b0" />
        </Grid>
      </Grid>

      {/* Footer System Log */}
      <Box sx={{ mt: 2, p: 2, borderRadius: '8px', border: '1px dashed #ccc', textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          Last Updated At: {viewData.updatedAt ? new Date(viewData.updatedAt).toLocaleString() : "N/A"}
        </Typography>
      </Box>
    </Box>
  );
};

export default ViewAttendance;