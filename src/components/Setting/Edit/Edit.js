'use client'
import React, { useState } from "react";
import { Box, Typography, Paper, Stack, Switch, Button, Divider } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import { toast } from "react-toastify";

const EditSetting = ({ initialData, onUpdate }) => {
  const [settings, setSettings] = useState(initialData);

  const handleToggle = (field) => {
    const updated = { ...settings, [field]: !settings[field] };
    setSettings(updated);
    // Auto-save logic can be added here
  };

  const saveChanges = async () => {
    toast.success("Changes updated successfully!");
    onUpdate(settings);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: "1px solid #e2e8f0", borderRadius: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
          <NotificationsIcon sx={{ color: "#20a4ad" }} />
          <Typography variant="h6" fontWeight="600">Notifications</Typography>
        </Stack>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography color="text.secondary">Email Notifications</Typography>
            <Switch checked={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography color="text.secondary">Push Notifications</Typography>
            <Switch checked={settings.pushNotifications} onChange={() => handleToggle('pushNotifications')} />
          </Box>
        </Stack>
      </Paper>

      <Button variant="contained" fullWidth onClick={saveChanges} sx={{ bgcolor: "#20a4ad", py: 1.5, borderRadius: 2 }}>
        Update Settings
      </Button>
    </Box>
  );
};

export default EditSetting;