'use client';

import React, { useState } from "react";
import { 
  TextField, Grid, Button, Box, CircularProgress, Typography 
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  profile: yup.string().required("Profile name is required"),
  punchedIn: yup.string().required("Punch-in time is required"),
  punchedOut: yup.string().required("Punch-out time is required"),
  behavior: yup.string().required("Behavior rating is required"),
  breakTime: yup.string().required("Break time duration is required"),
  totalHours: yup.string().required("Total working hours required"),
  entry: yup.string().required("Entry type is required"),
});

const CreateAttendance = ({ handleCreate, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      profile: "", punchedIn: "", punchedOut: "", 
      behavior: "", breakTime: "", totalHours: "", entry: ""
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    // Token ko localStorage se sahi tarike se uthayen
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    try {
      // ⚠️ FIX: Endpoint ko controller ke mutabiq badla gaya hai (/daily-logs)
      const response = await fetch(`${Base_url}/daily-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Attendance added successfully!");
        reset();
        handleCreate(); 
        handleClose();  
      } else {
        // Agar 401 aata hai toh iska matlab token expire ho chuka hai
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(res.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Network Error: Backend server is not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary" }}>
        Enter daily attendance details for the staff/student profile.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Profile Name *" {...register("profile")} error={!!errors.profile} helperText={errors.profile?.message} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Entry Type (e.g. Office) *" {...register("entry")} error={!!errors.entry} helperText={errors.entry?.message} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Punch In Time *" {...register("punchedIn")} error={!!errors.punchedIn} helperText={errors.punchedIn?.message} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Punch Out Time *" {...register("punchedOut")} error={!!errors.punchedOut} helperText={errors.punchedOut?.message} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Break Duration *" {...register("breakTime")} error={!!errors.breakTime} helperText={errors.breakTime?.message} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Total Working Hours *" {...register("totalHours")} error={!!errors.totalHours} helperText={errors.totalHours?.message} />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth size="small" label="Behavior Rating / Comments *" {...register("behavior")} error={!!errors.behavior} helperText={errors.behavior?.message} />
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={handleClose} variant="outlined" color="inherit">Cancel</Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading} 
          sx={{ bgcolor: "#0d1b75", "&:hover": { bgcolor: "#0a145a" } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save Attendance"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateAttendance;