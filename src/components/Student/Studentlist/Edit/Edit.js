'use client';

import React, { useState, useEffect } from "react";
import { 
  TextField, Grid, Button, Box, CircularProgress, MenuItem 
} from "@mui/material";
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

const EditAllStudent = ({ editData, handleUpdate, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // ✅ Fix 1: Default values ko empty string set karein (MUI controlled error fix)
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studentName: "",
      emailId: "",
      mobileNumber: "",
      dob: "",
      gender: "",
      address: "",
      enrollmentDate: "",
      course: "",
      status: ""
    }
  });

  useEffect(() => {
    if (editData) {
      reset({
        studentName: editData.studentName || "",
        emailId: editData.emailId || "",
        mobileNumber: editData.mobileNumber || "",
        dob: editData.dob || "",
        gender: editData.gender || "",
        address: editData.address || "",
        enrollmentDate: editData.enrollmentDate || "",
        course: editData.course || "",
        status: editData.status || "Ongoing",
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    try {
      const response = await fetch(`${Base_url}/studentlist/${editData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Student details updated successfully!");
        handleUpdate();
        handleClose();
      } else {
        const res = await response.json();
        toast.error(res.message || "Failed to update student");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Student Name *" {...register("studentName")} error={!!errors.studentName} helperText={errors.studentName?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Email Id *" {...register("emailId")} error={!!errors.emailId} helperText={errors.emailId?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Mobile Number *" {...register("mobileNumber")} error={!!errors.mobileNumber} helperText={errors.mobileNumber?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Date of Birth *" type="date" InputLabelProps={{ shrink: true }} {...register("dob")} error={!!errors.dob} helperText={errors.dob?.message} />
        </Grid>
        
        {/* Gender Select */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <TextField 
                {...field} 
                select 
                fullWidth 
                label="Gender *" 
                error={!!errors.gender} 
                helperText={errors.gender?.message}
                // ✅ Fix 2: Value agar undefined ho toh empty string dikhaye
                value={field.value || ""} 
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Address *" {...register("address")} error={!!errors.address} helperText={errors.address?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Enrollment Date *" type="date" InputLabelProps={{ shrink: true }} {...register("enrollmentDate")} error={!!errors.enrollmentDate} helperText={errors.enrollmentDate?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Course *" {...register("course")} error={!!errors.course} helperText={errors.course?.message} />
        </Grid>

        {/* Status Select */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField 
                {...field} 
                select 
                fullWidth 
                label="Status *" 
                error={!!errors.status} 
                helperText={errors.status?.message}
                value={field.value || ""}
              >
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Graduated">Graduated</MenuItem>
                <MenuItem value="Dropped">Dropped</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={handleClose} variant="outlined" color="inherit">Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "#ed6c02" }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Update Student"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditAllStudent;