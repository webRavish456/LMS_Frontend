'use client';

import React, { useState } from "react";
import { 
  TextField, Grid, Button, Box, CircularProgress, Typography 
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// 1. Validation Schema (Points 1-4)
const schema = yup.object().shape({
  studentName: yup.string().required("Student Name is required"),
  courseName: yup.string().required("Course Name is required"),
  duration: yup.string().required("Duration is required"),
  certificate: yup.mixed().test("required", "Certificate file is required", (value) => {
    return value && value.length > 0;
  }),
});

const CreateCertificate = ({ handleCreate, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studentName: "",
      courseName: "",
      duration: ""
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // FormData use karna zaroori hai kyunki hum file bhej rahe hain
    const formData = new FormData();
    formData.append("studentName", data.studentName);
    formData.append("courseName", data.courseName);
    formData.append("duration", data.duration);
    formData.append("certificates", data.certificate[0]); // Point 4

    try {
      const response = await fetch(`${Base_url}/certificates`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Note: Content-Type yahan manually mat likhna, browser FormData ke liye apne aap set kar lega
        },
        body: formData,
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Certificate uploaded successfully!");
        reset();
        handleCreate(); // Table refresh karein
        handleClose();  // Modal close karein
      } else {
        toast.error(res.message || "Failed to upload certificate");
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
      <Grid container spacing={2}>
        {/* 1) Student Name */}
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            label="1) Student Name *" 
            {...register("studentName")} 
            error={!!errors.studentName} 
            helperText={errors.studentName?.message} 
          />
        </Grid>

        {/* 2) Course Name */}
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            label="2) Course Name *" 
            {...register("courseName")} 
            error={!!errors.courseName} 
            helperText={errors.courseName?.message} 
          />
        </Grid>

        {/* 3) Duration */}
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            label="3) Duration (e.g. 6 Months) *" 
            {...register("duration")} 
            error={!!errors.duration} 
            helperText={errors.duration?.message} 
          />
        </Grid>

        {/* 4) Certificate (File Upload) */}
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            type="file" 
            label="4) Certificate File (PDF/Image) *" 
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "application/pdf,image/*" }}
            {...register("certificate")} 
            error={!!errors.certificate} 
            helperText={errors.certificate?.message} 
          />
        </Grid>
      </Grid>

      {/* 5) Actions */}
      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading} 
          sx={{ bgcolor: "#072eb0", minWidth: '120px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateCertificate;