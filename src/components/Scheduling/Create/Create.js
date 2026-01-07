"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CreateSchedule = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({
    scheduleId: "",
    courseId: "",
    teacherId: "",
    startTime: "",
    endTime: "",
    status: "Scheduled",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.scheduleId ||
      !formData.courseId ||
      !formData.teacherId ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast.warning("Please fill all required fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${Base_url}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();

      if (res.status === "success") {
        toast.success("Schedule created successfully!");
        handleCreate();
        handleClose();
      } else {
        toast.error(res.message || "Failed to create schedule.");
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Schedule ID"
            name="scheduleId"
            value={formData.scheduleId}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Course ID"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Teacher ID"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Time"
            name="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="End Time"
            name="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Rescheduled">Rescheduled</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateSchedule;
