'use client';

import React from "react";
import { 
  Box, Grid, Typography, Divider, Chip, Paper 
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';

const ViewAllStudent = ({ viewData }) => {
  // Loading check
  if (!viewData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">No Student Data Available</Typography>
      </Box>
    );
  }

  // Helper component for detail rows
  const DetailRow = ({ icon, label, value }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 1.5, 
      borderRadius: '8px',
      '&:hover': { bgcolor: '#f0f4ff' } // Subtle hover effect
    }}>
      <Box sx={{ 
        mr: 2, 
        bgcolor: 'primary.light', 
        color: 'white', 
        p: 1, 
        borderRadius: '50%',
        display: 'flex',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
      }}>
        {React.cloneElement(icon, { fontSize: 'small' })}
      </Box>
      <Box>
        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
          {value || "Not Provided"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a237e' }}>
            Academic Profile
          </Typography>
        </Box>
        <Chip 
          label={viewData.status || "Ongoing"} 
          color={viewData.status === "Graduated" ? "success" : viewData.status === "Dropped" ? "error" : "primary"}
          sx={{ fontWeight: 'bold', px: 1 }}
        />
      </Box>
      
      <Divider sx={{ mb: 3, borderBottomWidth: 2 }} />

      {/* Details Grid */}
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <DetailRow icon={<AccountCircleIcon />} label="Student Name" value={viewData.studentName} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailRow icon={<EmailIcon />} label="Email Address" value={viewData.emailId} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailRow icon={<PhoneIcon />} label="Mobile Number" value={viewData.mobileNumber} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailRow icon={<EventIcon />} label="Date of Birth" value={viewData.dob} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailRow icon={<PersonIcon />} label="Gender" value={viewData.gender} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailRow icon={<HomeIcon />} label="Home Address" value={viewData.address} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailRow icon={<EventIcon />} label="Enrollment Date" value={viewData.enrollmentDate} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailRow icon={<SchoolIcon />} label="Course Enrolled" value={viewData.course} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: '8px', borderLeft: '5px solid #1976d2' }}>
        <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
          SYSTEM INFO:
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Record Created On: {viewData.createdAt ? new Date(viewData.createdAt).toLocaleString() : "N/A"}
        </Typography>
      </Box>
    </Box>
  );
};

export default ViewAllStudent;