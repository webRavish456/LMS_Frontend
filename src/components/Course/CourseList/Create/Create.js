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

/* ================= VALIDATION ================= */
const schema = yup.object({
  courseId: yup.string().required("Course ID is required"),
  courseName: yup.string().required("Course Name is required"),
  courseDescription: yup.string().required("Description is required"),
  duration: yup.string().required("Duration is required"),
  pricing: yup
    .number()
    .typeError("Pricing must be a number")
    .required("Pricing is required"),
  assignedTeachers: yup.string().optional(),
  syllabus: yup.string().optional(),
  video: yup.string().optional(),
  status: yup.string().required("Status is required"),
});

/* ================= COMPONENT ================= */
const CreateCourse = ({ handleCreate, handleClose }) => {
  const [loading, setLoading] = useState(false);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      courseId: "",
      courseName: "",
      courseDescription: "",
      duration: "",
      pricing: "",
      assignedTeachers: "",
      syllabus: "",
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
      const response = await fetch(`${Base_url}/courselist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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
              label="Course ID *"
              {...register("courseId")}
              error={!!errors.courseId}
              helperText={errors.courseId?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...commonProps}
              label="Course Name *"
              {...register("courseName")}
              error={!!errors.courseName}
              helperText={errors.courseName?.message}
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
              label="Duration *"
              {...register("duration")}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...commonProps}
              type="number"
              label="Pricing (₹) *"
              {...register("pricing")}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...commonProps}
              label="Assigned Teachers"
              {...register("assignedTeachers")}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...commonProps}
              label="Syllabus (URL / Text)"
              {...register("syllabus")}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...commonProps}
              label="Intro Video URL"
              {...register("video")}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} {...commonProps} select label="Status *">
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              )}
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
