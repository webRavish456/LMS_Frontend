'use client'
import React, { useState } from "react";
import { 
  Box, Typography, Paper, Stack, Switch, 
  Button, Container, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions 
} from "@mui/material";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Layout from "@/components/Layout";
import { toast } from "react-toastify";

const SettingsPage = () => {
  // Toggle States (सारी सेटिंग्स सुरक्षित हैं)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    twoFactor: false,
  });

  // Password Modal State
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ 
    oldPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
    toast.info(`${field.split(/(?=[A-Z])/).join(" ")} updated`);
  };

  const handlePasswordChange = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      return toast.error("Please fill all fields");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      // यहाँ आपका API Call आएगा
      toast.success("Password updated successfully!");
      setOpenPasswordModal(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#1e293b" }}>
          Settings
        </Typography>

        <Stack spacing={4}>
          {/* Notifications Card */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #f1f5f9", bgcolor: "#fff" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
              <NotificationsNoneIcon sx={{ color: "#20a4ad" }} />
              <Typography variant="h6" fontWeight="bold">Notifications</Typography>
            </Box>

            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                <Typography color="#475569">Email Notifications</Typography>
                <Switch 
                  checked={settings.emailNotifications} 
                  onChange={() => handleToggle('emailNotifications')}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                <Typography color="#475569">Push Notifications</Typography>
                <Switch 
                  checked={settings.pushNotifications} 
                  onChange={() => handleToggle('pushNotifications')}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                <Typography color="#475569">SMS Notifications</Typography>
                <Switch 
                  checked={settings.smsNotifications} 
                  onChange={() => handleToggle('smsNotifications')}
                />
              </Box>
            </Stack>
          </Paper>

          {/* Security Card */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #f1f5f9", bgcolor: "#fff" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
              <LockOutlinedIcon sx={{ color: "#20a4ad" }} />
              <Typography variant="h6" fontWeight="bold">Security</Typography>
            </Box>

            <Stack spacing={2} alignItems="flex-start">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', py: 1.5 }}>
                <Typography color="#475569">Two-Factor Authentication</Typography>
                <Switch 
                  checked={settings.twoFactor} 
                  onChange={() => handleToggle('twoFactor')}
                />
              </Box>
              
              <Button 
                variant="outlined" 
                onClick={() => setOpenPasswordModal(true)}
                sx={{ 
                  textTransform: 'none', borderRadius: 2, 
                  color: "#1e293b", borderColor: "#e2e8f0", px: 3
                }}
              >
                Change Password
              </Button>
            </Stack>
          </Paper>
        </Stack>

        {/* Change Password Modal */}
        <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 'bold' }}>Update Password</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField 
                label="Current Password" 
                type="password" 
                fullWidth 
                size="small"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
              />
              <TextField 
                label="New Password" 
                type="password" 
                fullWidth 
                size="small"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
              <TextField 
                label="Confirm New Password" 
                type="password" 
                fullWidth 
                size="small"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenPasswordModal(false)} color="inherit">Cancel</Button>
            <Button 
              onClick={handlePasswordChange} 
              variant="contained" 
              sx={{ bgcolor: "#20a4ad", '&:hover': { bgcolor: "#1a8a91" } }}
            >
              Update Password
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default SettingsPage;