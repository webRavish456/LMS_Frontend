"use client";

import React, { useState } from "react";
import {
  TextField,
  Grid,
  Button,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

/* ================= VALIDATION ================= */
const schema = yup.object({
  courseName: yup.string().required("Course Name is required"),
  courseDescription: yup.string().required("Description is required"),
  duration: yup.string().required("Duration is required"),
  pricing: yup.string().required("Pricing is required"),
  syllabus: yup
    .mixed()
    .test("required", "Syllabus PDF is required", (value) => {
      return value && value.length > 0;
    }),
  assignedTeachers: yup.string().optional(),
  video: yup.string().optional(),
  status: yup.string().required("Status is required"),
});

/* ================= COMPONENT ================= */
const CreateCourse = ({ handleCreate, handleClose }) => {
  const [loading, setLoading] = useState(false);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem("token")

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      courseName: "",
      courseDescription: "",
      duration: "",
      pricing: "",
      assignedTeachers: "",
      video: "",
      status: "Active",
    },
  });

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("courseName", data.courseName);
      formData.append("courseDescription", data.courseDescription);
      formData.append("duration", data.duration);
      formData.append("pricing", data.pricing);
      formData.append("assignedTeachers", data.assignedTeachers || "");
      formData.append("video", data.video || "");
      formData.append("status", data.status);
      formData.append("syllabus", data.syllabus[0]); 

      const response = await fetch(`${Base_url}/courselist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });

      const res = await response.json();

      if (res.status === "success") {
        toast.success("Course Created Successfully!");
        handleCreate(true);
        handleClose();
        reset();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const commonProps = {
    fullWidth: true,
    variant: "outlined",
  };

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...commonProps}
              label="Course Name *"
              {...register("courseName")}
              error={!!errors.courseName}
              helperText={errors.courseName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...commonProps}
              label="Duration *"
              {...register("duration")}
              error={!!errors.duration}
              helperText={errors.duration?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...commonProps}
              multiline
              rows={3}
              label="Course Description *"
              {...register("courseDescription")}
              error={!!errors.courseDescription}
              helperText={errors.courseDescription?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...commonProps}
              label="Pricing (₹) *"
              {...register("pricing")}
              error={!!errors.pricing}
              helperText={errors.pricing?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="file"
              label="Syllabus (PDF) *"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "application/pdf" }}
              {...register("syllabus")}
              error={!!errors.syllabus}
              helperText={errors.syllabus?.message}
              fullWidth
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "SUBMIT"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateCourse;
