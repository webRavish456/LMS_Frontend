"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Grid,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";

const schema = yup.object().shape({
  topic: yup.string().required("Topic is required"),
  topicDescription: yup.string().required("Topic Description is required"),
  course: yup.string().required("Course is required"),
  teacher: yup.string().required("Teacher is required"),
  document: yup.mixed(),
});

const EditDocumentSharing = ({ handleUpdate, editData, handleClose }) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* ================= SET DEFAULT VALUES ================= */
  useEffect(() => {
    if (editData) {
      reset({
        topic: editData.topic || "",
        topicDescription: editData.topicDescription || "",
        course: editData.course || "",
        teacher: editData.teacher || "",
      });
    }
  }, [editData, reset]);

  /* ================= SUBMIT ================= */
 const onSubmit = async (data) => {
  if (!token) {
    toast.error("Session expired. Please login again.");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("topic", data.topic);
    formData.append("topicDescription", data.topicDescription);
    formData.append("course", data.course);
    formData.append("teacher", data.teacher);

    if (data.document && data.document.length > 0) {
      formData.append("document", data.document[0]);
    }

    const response = await fetch(
      `${Base_url}/documentsharing/${editData._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Server error");
    }

    const result = await response.json().catch(() => null);

    if (result?.status === "success") {
      toast.success("Document Updated Successfully!");

      handleUpdate?.(true);
      handleClose?.();
      reset();
    } else {
      toast.error(result?.message || "Update failed");
    }

  } catch (error) {
    console.error("Update error:", error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Topic *"
            {...register("topic")}
            error={!!errors.topic}
            helperText={errors.topic?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Topic Description *"
            {...register("topicDescription")}
            error={!!errors.topicDescription}
            helperText={errors.topicDescription?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Course Name *"
            {...register("course")}
            error={!!errors.course}
            helperText={errors.course?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Teacher Name *"
            {...register("teacher")}
            error={!!errors.teacher}
            helperText={errors.teacher?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            type="file"
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Document (Optional)"
            {...register("document")}
          />

          <Typography variant="body2" sx={{ mt: 1 }}>
            View existing document:&nbsp;
            {editData?.document ? (
              <Link
                href={editData.document}
                target="_blank"
                rel="noopener noreferrer"
              >
                Document
              </Link>
            ) : (
              <span style={{ color: "gray" }}>
                No document available
              </span>
            )}
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 3,
        }}
      >
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress
                size={18}
                sx={{ mr: 1, color: "#fff" }}
              />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </form>
  );
};

export default EditDocumentSharing;