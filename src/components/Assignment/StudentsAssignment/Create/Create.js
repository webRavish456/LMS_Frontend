'use client';

import React, { useState } from "react";
import { Box, TextField, Button, Grid, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

export default function Create({ handleClose, handleCreate }) {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const [formData, setFormData] = useState({
    studentName: "",
    assignmentTitle: "",
    dueDate: "",
    status: "Pending",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.studentName || !formData.assignmentTitle) {
      toast.error("All fields are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const finalUrl = `${Base_url}/studentsAssignment`;
      console.log("Fetching from:", finalUrl);

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Response check
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Server Error Response:", text);
        throw new Error("Backend did not return JSON");
      }

      const res = await response.json();

      if (response.ok && (res.status === "success" || res.success)) {
        toast.success("Assignment created successfully");
        handleClose();
        handleCreate();
      } else {
        toast.error(res.message || "Failed to create assignment");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Connection failed. Check if Server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Student Name" name="studentName" value={formData.studentName} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Assignment Title" name="assignmentTitle" value={formData.assignmentTitle} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth type="date" label="Due Date" name="dueDate" InputLabelProps={{ shrink: true }} value={formData.dueDate} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth select label="Status" name="status" value={formData.status} onChange={handleChange}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Create"}
        </Button>
      </Box>
    </Box>
  );
}