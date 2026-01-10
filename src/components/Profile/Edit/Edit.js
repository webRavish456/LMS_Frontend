'use client'

import React, { useEffect, useState } from "react";
import { 
  Box, TextField, Button, Typography, Grid, 
  Avatar, IconButton, CircularProgress 
} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditProfile = ({ data, handleClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(data?.profilePhoto || null);
  
  // 1. TOKEN STATE ADD KI HAI (Aapke code mein ye missing tha)
  const [token, setToken] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // 2. TOKEN LOAD KARNA
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 3. FORM RESET & DATA FILL
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        email: data.email,
        mobileNo: data.mobileNo,
        address: data.address,
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
      });
      setPreview(data.profilePhoto);
    }
  }, [data, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData) => {
    // Check if token exists
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) {
      toast.error("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${Base_url}/profile/${data._id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentToken}`, // Fixed: currentToken use kiya
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();

      if (response.ok && res.status === "success") {
        toast.success("Profile updated successfully!");
        handleClose(); 
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      {/* Avatar Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={preview} sx={{ width: 100, height: 100, bgcolor: '#20a4ad' }} />
          <input accept="image/*" id="edit-photo" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
          <label htmlFor="edit-photo">
            <IconButton
              component="span"
              sx={{
                position: 'absolute', bottom: 0, right: 0,
                bgcolor: '#ff9800', color: 'white',
                '&:hover': { bgcolor: '#e68a00' },
                width: 32, height: 32, border: '2px solid white'
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </label>
        </Box>
      </Box>

      {/* Fields */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>Full Name</Typography>
          <TextField fullWidth size="small" {...register("name", { required: "Name is required" })} error={!!errors.name} helperText={errors.name?.message} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>Email Address</Typography>
          <TextField fullWidth size="small" type="email" {...register("email", { required: "Email is required" })} error={!!errors.email} helperText={errors.email?.message} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>Phone Number</Typography>
          <TextField fullWidth size="small" {...register("mobileNo")} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>Date of Birth</Typography>
          <TextField fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} {...register("dob")} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>Address</Typography>
          <TextField fullWidth multiline rows={3} {...register("address")} />
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ bgcolor: '#20a4ad', '&:hover': { bgcolor: '#1a8a91' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Update Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfile;