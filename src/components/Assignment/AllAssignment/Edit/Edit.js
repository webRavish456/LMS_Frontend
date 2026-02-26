"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { toast } from "react-toastify";

export default function EditAllAssignment({
  editData,
  handleClose,
  handleUpdate,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    assignmentTitle: "",
    course: "",
    teacher: "",
    dueDate: "",
    status: "Active",
  });

  /* ================= SET DEFAULT VALUES ================= */
  useEffect(() => {
    if (editData) {
      setFormData({
        assignmentTitle: editData.assignmentTitle || "",
        course: editData.course || "",
        teacher: editData.teacher || "",
        dueDate: editData.dueDate
          ? editData.dueDate.split("T")[0]
          : "",
        status: editData.status || "Active",
      });
    }
  }, [editData]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

    if (!editData?._id) {
      toast.error("Assignment ID missing!");
      return;
    }

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    if (!Base_url) {
      toast.error("Base URL missing. Check .env file.");
      return;
    }

    const finalUrl = `${Base_url}/allAssignment/${editData._id}`;

    try {
      setLoading(true);

      const response = await fetch(finalUrl, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        toast.error("Backend route not found (404)");
        setLoading(false);
        return;
      }

      if (response.ok) {
        toast.success("Assignment Updated Successfully!");
        handleUpdate();
        handleClose();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Assignment Title"
            name="assignmentTitle"
            value={formData.assignmentTitle}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            name="dueDate"
            InputLabelProps={{ shrink: true }}
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 3,
          gap: 2,
        }}
      >
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ bgcolor: "#ed6c02" }}
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
            "UPDATE DATA"
          )}
        </Button>
      </Box>
    </Box>
  );
}