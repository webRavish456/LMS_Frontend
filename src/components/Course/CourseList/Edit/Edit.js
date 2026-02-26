"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";

const EditCourseList = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    courseDescription: "",
    duration: "",
    pricing: "",
    syllabus: null,
    assignedTeachers: "",
    createdAt: "",
    updatedAt: "",
    status: "Active",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        courseId: editData.courseId || "",
        courseName: editData.courseName || "",
        courseDescription: editData.courseDescription || "",
        duration: editData.duration || "",
        // pricing: editData.pricing ? editData.pricing.replace("₹", "") : "",
        syllabus: editData.syllabus || null,
        // assignedTeachers: editData.assignedTeachers?.join(", ") || "",
        createdAt: editData.createdAt || new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        status: editData.status || "Active",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, syllabus: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    if (!formData.courseId || !formData.courseName) {
      toast.error("Course ID and Course Name are required!");
      return;
    }

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }

    handleUpdate(payload);
    toast.success("Course updated successfully!");
    handleClose();
  };

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Course</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Course ID"
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Course Name"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Description"
          name="courseDescription"
          multiline
          minRows={3}
          value={formData.courseDescription}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Pricing"
          name="pricing"
          type="number"
          value={formData.pricing}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Assigned Teacher IDs (comma separated)"
          name="assignedTeachers"
          value={formData.assignedTeachers}
          onChange={handleChange}
        />
        <TextField
          type="file"
          fullWidth
          margin="dense"
          onChange={handleFileChange}
          // inputProps={{ accept: ".pdf" }}
        />
        <TextField
          select
          fullWidth
          margin="dense"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update Course
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCourseList;
