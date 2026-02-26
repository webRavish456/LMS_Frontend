'use client'

import React, { useEffect, useState } from "react";
import {
  TextField,
  Grid,
  Button,
  Box,
  CircularProgress,
  Typography
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";

const schema = yup.object().shape({
  studentName: yup.string().required("Student Name is required"),
  courseName: yup.string().required("Course Name is required"),
  duration: yup.string().required("Duration is required"),
});

const EditCertificate = ({ handleUpdate, editData, handleClose }) => {

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studentName: "",
      courseName: "",
      duration: ""
    }
  });

  // ✅ Set values when editData changes
  useEffect(() => {
    if (editData) {
      reset({
        studentName: editData.studentName || "",
        courseName: editData.courseName || "",
        duration: editData.duration || "",
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("studentName", data.studentName);
      formData.append("courseName", data.courseName);
      formData.append("duration", data.duration);

      if (data.certificate && data.certificate.length > 0) {
        formData.append("certificates", data.certificate[0]);
      }

      const response = await fetch(
        `${Base_url}/certificates/${editData._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const res = await response.json();

      if (response.ok) {
        toast.success("Certificate updated successfully!");
        handleUpdate(true);
        handleClose();
      } else {
        toast.error(res.message || "Update failed");
      }

    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Student Name *"
            {...register("studentName")}
            error={!!errors.studentName}
            helperText={errors.studentName?.message}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Course Name *"
            {...register("courseName")}
            error={!!errors.courseName}
            helperText={errors.courseName?.message}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Duration *"
            {...register("duration")}
            error={!!errors.duration}
            helperText={errors.duration?.message}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            type="file"
            label="Certificate (optional)"
            InputLabelProps={{ shrink: true }}
            {...register("certificate")}
            fullWidth
          />
          {editData?.certificates && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Existing file:{" "}
              <Link href={editData.certificates} target="_blank">
                View Certificate
              </Link>
            </Typography>
          )}
        </Grid>

      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Update"}
        </Button>
      </Box>
    </form>
  );
};

export default EditCertificate;