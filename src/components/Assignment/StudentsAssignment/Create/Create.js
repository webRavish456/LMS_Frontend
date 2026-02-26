"use client";

import React, { useState } from "react";
import {
  TextField,
  Grid,
  Button,
  Box,
  CircularProgress,
  MenuItem
} from "@mui/material";
import { toast } from "react-toastify";

export default function Create({ handleClose, handleCreate }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentName: "",
    assignmentTitle: "",
    dueDate: "",
    status: "Pending",
  });

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${Base_url}/studentsAssignment`, // ⚠️ backend route match hona chahiye
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        toast.success("Assignment Created Successfully!");
        handleCreate();   // table refresh
        handleClose();    // close modal
      } else {
        toast.error(data.message || "Create failed");
      }

    } catch (error) {
      console.error(error);
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
            label="Student Name"
            value={formData.studentName}
            onChange={(e) =>
              setFormData({ ...formData, studentName: e.target.value })
            }
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Assignment Title"
            value={formData.assignmentTitle}
            onChange={(e) =>
              setFormData({ ...formData, assignmentTitle: e.target.value })
            }
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            InputLabelProps={{ shrink: true }}
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Grid>

      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button type="submit" variant="contained">
          {loading ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1, color: "#fff" }} />
              Saving...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </Box>
    </Box>
  );
}