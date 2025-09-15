"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

const ViewVideoClass = ({ viewData }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography><b>Student Name:</b> {viewData?.studentName}</Typography>
      <Typography><b>Enrollment No:</b> {viewData?.enrollmentNo}</Typography>
      <Typography><b>Subject Name:</b> {viewData?.subjectName}</Typography>
      <Typography><b>Teacher Name:</b> {viewData?.teacherName}</Typography>
    </Box>
  );
};

export default ViewVideoClass;
