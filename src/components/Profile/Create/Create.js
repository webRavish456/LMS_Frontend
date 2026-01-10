"use client";
import React, { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Stack, MenuItem, Box, Avatar, IconButton 
} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { toast } from "react-toastify";

const CreateProfile = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    address: "",
    dob: "",
    gender: "male",
    password: "", 
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.mobileNo || !formData.password || !formData.dob || !formData.address) {
      toast.error("Please fill all fields!");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await fetch(`${Base_url}/profile`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();

      if (response.ok && res.status === "success") {
        toast.success("Profile created successfully!");
        onCreate(); 
        onClose();  
      } else {
        toast.error(res.message || "Failed to create profile");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, color: "#072eb0" }}>Add New Profile</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar src={preview} sx={{ width: 80, height: 80, bgcolor: '#20a4ad' }} />
              <input accept="image/*" id="profile-img" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
              <label htmlFor="profile-img">
                <IconButton component="span" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#ff9800', color: 'white', width: 28, height: 28 }}>
                  <PhotoCameraIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </label>
            </Box>
          </Box>

          <TextField label="Full Name" fullWidth onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <TextField label="Email Id" type="email" fullWidth onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <TextField label="Mobile Number" fullWidth onChange={(e) => setFormData({...formData, mobileNo: e.target.value})} />
          <TextField label="Password" type="password" fullWidth onChange={(e) => setFormData({...formData, password: e.target.value})} />

          <Stack direction="row" spacing={2}>
            <TextField select label="Gender" value={formData.gender} fullWidth onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </TextField>
            <TextField label="Date of Birth" type="date" fullWidth InputLabelProps={{ shrink: true }} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
          </Stack>

          <TextField label="Address" multiline rows={2} fullWidth onChange={(e) => setFormData({...formData, address: e.target.value})} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ bgcolor: "#072eb0" }}>
          {loading ? "Creating..." : "Create Profile"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProfile;