'use client';

import React, { useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

const EditStudent = ({ editData, handleClose, onSuccess }) => {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {
      studentName: "",
      emailId: "",
      course: "",
      status: "Ongoing",
    },
  });

  /* 🔥 MOST IMPORTANT PART */
  useEffect(() => {
    if (editData?._id) {
      reset({
        studentName: editData.studentName,
        emailId: editData.emailId,
        course: editData.course,
        status: editData.status || "Ongoing",
      });
    }
  }, [editData, reset]);

  const onSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${Base_url}/studentlist/${editData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const res = await response.json();

      if (response.ok && res.status === "success") {
        toast.success("Student updated successfully");

        /* 🔥 THIS LINE FIXES TABLE UPDATE */
        onSuccess(res.data);

        handleClose();
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      toast.error("Network error while updating");
    }
  };

  if (!editData) return null;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Student Name"
            {...register("studentName")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            {...register("emailId")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Course"
            {...register("course")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField {...field} select fullWidth label="Status">
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Graduated">Graduated</MenuItem>
                <MenuItem value="Dropped">Dropped</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditStudent;
