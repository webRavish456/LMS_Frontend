'use client'
import React, { useState } from "react";
import { Box, Button, Switch, FormControlLabel, Paper, Typography, Stack } from "@mui/material";
import { toast } from "react-toastify";

const CreateSetting = ({ onSave }) => {
  const [formData, setFormData] = useState({
    emailNotifications: true,
    pushNotifications: true,
    twoFactor: false
  });

  const handleSubmit = async () => {
    try {
      // API call to save settings
      toast.success("Settings initialized successfully!");
      onSave();
    } catch (error) {
      toast.error("Failed to create settings");
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>Initial Setup</Typography>
      <Stack spacing={2}>
        <FormControlLabel
          control={<Switch checked={formData.emailNotifications} onChange={(e) => setFormData({...formData, emailNotifications: e.target.checked})} />}
          label="Enable Email Notifications"
        />
        <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: "#20a4ad" }}>
          Save Initial Settings
        </Button>
      </Stack>
    </Paper>
  );
};

export default CreateSetting;