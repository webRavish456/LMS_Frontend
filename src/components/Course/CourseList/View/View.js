"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";

const ViewCourseList = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const handleDownloadSyllabus = async (syllabusUrl, courseName) => {
    try {
      const response = await fetch(syllabusUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${courseName}-syllabus.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>View Course Details</DialogTitle>
      <DialogContent dividers>
        <Box mb={1}>
          <Typography variant="subtitle2">Course ID:</Typography>
          <Typography>{viewData.courseId}</Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle2">Course Name:</Typography>
          <Typography>{viewData.courseName}</Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle2">Description:</Typography>
          <Typography>{viewData.courseDescription}</Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle2">Duration:</Typography>
          <Typography>{viewData.duration}</Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle2">Pricing:</Typography>
          <Typography>{viewData.pricing}</Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle2">Syllabus:</Typography>
          {viewData.syllabus ? (
            <Button
              variant="outlined"
              onClick={() => handleDownloadSyllabus(viewData.syllabus, viewData.courseName)}
            >
              Download PDF
            </Button>
          ) : (
            <Typography>Not uploaded</Typography>
          )}
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle2">Assigned Teacher IDs:</Typography>
          {viewData.assignedTeachers?.length ? (
            viewData.assignedTeachers.map((id, idx) => (
              <Chip
                key={idx}
                label={id}
                size="small"
                style={{ marginRight: 4, marginBottom: 4 }}
              />
            ))
          ) : (
            <Typography>None</Typography>
          )}
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle2">Created At:</Typography>
          <Typography>{new Date(viewData.createdAt).toLocaleString()}</Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle2">Updated At:</Typography>
          <Typography>{new Date(viewData.updatedAt).toLocaleString()}</Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle2">Status:</Typography>
          <Typography>{viewData.status}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCourseList;
