"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const CreateCourseList = ({ handleClose, handleCreate }) => {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
const token =
  typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;


  const [uploadMethod, setUploadMethod] = useState("file");

  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    courseDescription: "",
    duration: "",
    pricing: "",
    assignedTeachers: "",
    syllabus: null,
    video: null,
    videoUrl: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;
    setFormData({ ...formData, [name]: files[0] });
  };

  // ✅ MAIN SUBMIT
  const handleSubmit = async () => {
    if (!token) {
      toast.error("❌ Token missing. Please login again.");
      return;
    }

    if (!formData.courseId || !formData.courseName) {
      toast.error("Course ID & Course Name are required");
      return;
    }

    try {
      const payload = new FormData();

      // TEXT FIELDS
      payload.append("courseId", formData.courseId);
      payload.append("courseName", formData.courseName);
      payload.append("courseDescription", formData.courseDescription);
      payload.append("duration", formData.duration);
      payload.append("pricing", formData.pricing);
      payload.append("assignedTeachers", formData.assignedTeachers);
      payload.append("status", formData.status);

      // PDF
      if (formData.syllabus instanceof File) {
        payload.append("syllabus", formData.syllabus);
      }

      // VIDEO
      if (uploadMethod === "file" && formData.video instanceof File) {
        payload.append("video", formData.video);
      }

      if (uploadMethod === "url" && formData.videoUrl) {
        payload.append("video", formData.videoUrl);
      }

      const res = await fetch(`${Base_url}/courselist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ❌ Content-Type mat do
        },
        body: payload,
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        toast.success("✅ Course created successfully");
        handleCreate(); 
        handleClose();  
      } else {
        toast.error(result.message || "❌ Failed to create course");
      }
    } catch (error) {
      console.error("Create Course Error:", error);
      toast.error("❌ Server error");
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Create Course</DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Course ID"
              name="courseId"
              fullWidth
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Course Name"
              name="courseName"
              fullWidth
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="courseDescription"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Duration"
              name="duration"
              fullWidth
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Pricing"
              name="pricing"
              type="number"
              fullWidth
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Assigned Teachers (comma separated)"
              name="assignedTeachers"
              fullWidth
              onChange={handleChange}
            />
          </Grid>

          {/* PDF Upload */}
          <Grid item xs={12}>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<CloudUploadIcon />}
            >
              Upload Syllabus PDF
              <input
                hidden
                type="file"
                accept=".pdf"
                name="syllabus"
                onChange={handleFileChange}
              />
            </Button>

            {formData.syllabus && (
              <Typography variant="caption">
                {formData.syllabus.name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box border="1px solid #ddd" p={2} borderRadius={1}>
              <Typography variant="subtitle1">Video</Typography>

              <Box mt={1}>
                <Button
                  size="small"
                  variant={uploadMethod === "file" ? "contained" : "outlined"}
                  onClick={() => setUploadMethod("file")}
                >
                  Upload File
                </Button>

                <Button
                  size="small"
                  sx={{ ml: 1 }}
                  variant={uploadMethod === "url" ? "contained" : "outlined"}
                  onClick={() => setUploadMethod("url")}
                >
                  Use URL
                </Button>
              </Box>

              {uploadMethod === "file" && (
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Upload Video
                  <input
                    hidden
                    type="file"
                    accept="video/*"
                    name="video"
                    onChange={handleFileChange}
                  />
                </Button>
              )}

              {uploadMethod === "url" && (
                <TextField
                  label="Video URL"
                  name="videoUrl"
                  fullWidth
                  sx={{ mt: 2 }}
                  onChange={handleChange}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create Course
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCourseList;
