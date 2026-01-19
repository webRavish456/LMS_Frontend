"use client";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, MenuItem, Box, Avatar, IconButton } from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { toast } from "react-toastify";

const CreateProfile = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({ name: "", email: "", mobileNo: "", address: "", dob: "", gender: "male", password: "" });
  const [preview, setPreview] = useState(null);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async () => {
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));

    const fileInput = document.getElementById('profile-img');
    if (fileInput?.files[0]) {
      dataToSend.append("profilePhoto", fileInput.files[0]); 
    }

    try {
      const response = await fetch(`${Base_url}/profile`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: dataToSend,
      });

      const res = await response.json();
      if (response.ok && res.status === "success") {
        toast.success("Created!");
        onCreate(); onClose();
      } else {
        toast.error(res.message);
      }
    } catch (error) { toast.error("Error connecting to server"); }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Profile</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar src={preview} sx={{ width: 80, height: 80 }} />
            <input accept="image/*" id="profile-img" type="file" hidden onChange={(e) => setPreview(URL.createObjectURL(e.target.files[0]))} />
            <label htmlFor="profile-img"><IconButton component="span"><PhotoCameraIcon /></IconButton></label>
          </Box>
          <TextField label="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <TextField label="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <TextField label="Mobile" onChange={(e) => setFormData({...formData, mobileNo: e.target.value})} />
          <TextField label="Password" type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <TextField label="DOB" type="date" InputLabelProps={{ shrink: true }} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
          <TextField label="Address" multiline onChange={(e) => setFormData({...formData, address: e.target.value})} />
        </Stack>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Cancel</Button><Button onClick={handleSubmit} variant="contained">Create</Button></DialogActions>
    </Dialog>
  );
};
export default CreateProfile;