'use client'
import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from "react-toastify";

const DeleteSetting = ({ onReset }) => {
  const handleDelete = () => {
    if (window.confirm("क्या आप सेटिंग्स को डिफ़ॉल्ट पर रिसेट करना चाहते हैं?")) {
      toast.warn("Settings restored to default");
      onReset();
    }
  };

  return (
    <Paper sx={{ p: 3, border: "1px solid #fee2e2", bgcolor: "#fffafb" }}>
      <Typography color="error" variant="h6" gutterBottom>Danger Zone</Typography>
      <Typography variant="body2" mb={2}>Resetting will disable all notifications and 2FA.</Typography>
      <Button 
        variant="outlined" 
        color="error" 
        startIcon={<DeleteForeverIcon />}
        onClick={handleDelete}
      >
        Reset Settings
      </Button>
    </Paper>
  );
};

export default DeleteSetting;