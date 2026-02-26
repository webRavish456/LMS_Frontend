'use client';

import React, { useState } from "react";
import { TextField, Grid, Button, Box, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateStudent = ({ handleCreate, handleClose }) => {

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      studentName: "",
      emailId: "",
      mobileNumber: "",
      dob: "",
      address: "",
      course: "",
      status: "Ongoing"
    }
  });

  const onSubmit = async (data) => {

    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

    if (!token) {
      toast.error("Login required");
      return;
    }

    try {
      setLoading(true);

      console.log("BASE_URL:", BASE_URL);
      console.log("Sending JSON:", data);

      const response = await fetch(`${BASE_URL}/studentlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Request failed");
      }

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Student Created Successfully ✅");
        reset();
        handleCreate();
        handleClose();
      } else {
        toast.error(result.message || "Failed to create student");
      }

    } catch (error) {
      console.error("Create Student Error:", error);

      if (error.message.includes("Failed to fetch")) {
        toast.error("Cannot connect to backend server 🚨");
      } else {
        toast.error(error.message || "Server Error");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Student Name"
            {...register("studentName")}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register("emailId")}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mobile Number"
            {...register("mobileNumber")}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("dob")}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            {...register("address")}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Course"
            {...register("course")}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Status"
            {...register("status")}
          />
        </Grid>

      </Grid>

      <Box mt={2} textAlign="right">
        <Button onClick={handleClose} sx={{ mr: 2 }}>
          Cancel
        </Button>

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateStudent;