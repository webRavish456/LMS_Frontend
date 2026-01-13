'use client';

import React, { useState, useEffect } from "react";
import { 
  TextField, Grid, Button, Box, CircularProgress, Typography 
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// 1. Validation Schema
const schema = yup.object().shape({
  profile: yup.string().required("Profile name is required"),
  punchedIn: yup.string().required("Punch-in time is required"),
  punchedOut: yup.string().required("Punch-out time is required"),
  behavior: yup.string().required("Behavior rating is required"),
  breakTime: yup.string().required("Break time duration is required"),
  totalHours: yup.string().required("Total working hours required"),
  entry: yup.string().required("Entry type is required"),
});

const EditAttendance = ({ editData, handleUpdate, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      profile: "", punchedIn: "", punchedOut: "", 
      behavior: "", breakTime: "", totalHours: "", entry: ""
    }
  });

  // ✅ Purana data form mein load karne ke liye
  useEffect(() => {
    if (editData) {
      reset({
        profile: editData.profile || "",
        punchedIn: editData.punchedIn || "",
        punchedOut: editData.punchedOut || "",
        behavior: editData.behavior || "",
        breakTime: editData.breakTime || "",
        totalHours: editData.totalHours || "",
        entry: editData.entry || "",
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    try {
      const response = await fetch(`${Base_url}/attendance/${editData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Attendance record updated!");
        handleUpdate(); // Table list refresh karein
        handleClose();  // Modal close karein
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      toast.error("Network error: Backend server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Profile Name" {...register("profile")} error={!!errors.profile} helperText={errors.profile?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Entry Type" {...register("entry")} error={!!errors.entry} helperText={errors.entry?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Punch In" {...register("punchedIn")} error={!!errors.punchedIn} helperText={errors.punchedIn?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Punch Out" {...register("punchedOut")} error={!!errors.punchedOut} helperText={errors.punchedOut?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Break Duration" {...register("breakTime")} error={!!errors.breakTime} helperText={errors.breakTime?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Total Hours" {...register("totalHours")} error={!!errors.totalHours} helperText={errors.totalHours?.message} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth size="small" label="Behavior" {...register("behavior")} error={!!errors.behavior} helperText={errors.behavior?.message} />
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={handleClose} variant="outlined" color="inherit">Cancel</Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading} 
          sx={{ bgcolor: "#0d1b75" }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Update Attendance"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditAttendance;