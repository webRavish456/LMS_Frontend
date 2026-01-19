'use client'
import React from "react";
import { Box, Typography, Paper, Stack, Divider, Switch } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';

const ViewSetting = ({ data }) => {
  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <NotificationsIcon color="primary" />
          <Typography variant="h6">Notification Overview</Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">Email: {data?.emailNotifications ? "Enabled" : "Disabled"}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary">Push: {data?.pushNotifications ? "Enabled" : "Disabled"}</Typography>
        </Paper>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <SecurityIcon color="primary" />
          <Typography variant="h6">Security Status</Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">2FA: {data?.twoFactor ? "Active" : "Inactive"}</Typography>
        </Paper>
      </Box>
    </Stack>
  );
};

export default ViewSetting;