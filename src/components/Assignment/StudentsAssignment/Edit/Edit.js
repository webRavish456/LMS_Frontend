'use client';
import React, { useState } from "react";
import { Box, TextField, Button, Grid, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Edit({ data, handleClose, handleUpdate }) {
  const [formData, setFormData] = useState({
    studentName: data?.studentName || "",
    assignmentTitle: data?.assignmentTitle || "",
    dueDate: data?.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : "",
    status: data?.status || "Pending",
  });
  const [loading, setLoading] = useState(false);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/studentsAssignment/${data._id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();
      if (response.ok && res.status === "success") {
        toast.success("Assignment updated successfully");
        handleUpdate(); // Refresh table
        handleClose();  // Close Modal
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form">
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
          {loading ? "Updating..." : "Update Assignment"}
        </Button>
      </Box>
    </Box>
  );
}