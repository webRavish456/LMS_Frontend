'use client';

import React, { useState } from "react";
import { TextField, Grid, Button, Box, CircularProgress, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  studentName: yup.string().required("Student Name is required"),
  emailId: yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: yup.string().required("Mobile No is required").matches(/^[0-9]{10}$/, "Must be 10 digits"),
  dob: yup.string().required("DOB is required"),
  gender: yup.string().required("Gender is required"),
  address: yup.string().required("Address is required"),
  enrollmentDate: yup.string().required("Enrollment Date is required"),
  course: yup.string().required("Course is required"),
  status: yup.string().required("Status is required"),
});

const CreateAllStudent = ({ handleCreate, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: "Ongoing", gender: "" }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    try {
      const response = await fetch(`${Base_url}/studentlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data), 
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Student added successfully!");
        reset(); 
        handleCreate(); // Page refresh karega
        handleClose();  // Modal close karega
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network Error: Backend server is not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 1 }}>
      <Grid container spacing={2}>
        {/* MUI Grid v5/v6 syntax */}
        <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Student Name" {...register("studentName")} error={!!errors.studentName} helperText={errors.studentName?.message} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Email Id" {...register("emailId")} error={!!errors.emailId} helperText={errors.emailId?.message} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Mobile Number" {...register("mobileNumber")} error={!!errors.mobileNumber} helperText={errors.mobileNumber?.message} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} {...register("dob")} error={!!errors.dob} helperText={errors.dob?.message} /></Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="gender" control={control} render={({ field }) => (
            <TextField {...field} select fullWidth size="small" label="Gender" error={!!errors.gender} helperText={errors.gender?.message}>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </TextField>
          )} />
        </Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Address" {...register("address")} error={!!errors.address} helperText={errors.address?.message} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Enrollment Date" type="date" InputLabelProps={{ shrink: true }} {...register("enrollmentDate")} error={!!errors.enrollmentDate} helperText={errors.enrollmentDate?.message} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Course" {...register("course")} error={!!errors.course} helperText={errors.course?.message} /></Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="status" control={control} render={({ field }) => (
            <TextField {...field} select fullWidth size="small" label="Status" error={!!errors.status} helperText={errors.status?.message}>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Graduated">Graduated</MenuItem>
              <MenuItem value="Dropped">Dropped</MenuItem>
            </TextField>
          )} />
        </Grid>
      </Grid>
      
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={handleClose} variant="outlined" color="inherit">Cancel</Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading} 
          sx={{ bgcolor: "#072eb0", "&:hover": { bgcolor: "#051f7a" } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save Student"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateAllStudent;