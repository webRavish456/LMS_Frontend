import React from "react";
import { Button, Typography, Box } from "@mui/material";

const ViewVideoClass = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>View Recorded Class Details</Typography>
      <Typography><strong>Student Name:</strong> {viewData.studentName}</Typography>
      <Typography><strong>Enrollment No:</strong> {viewData.enrollmentNo}</Typography>
      <Typography><strong>Subject Name:</strong> {viewData.subjectName}</Typography>
      <Typography><strong>Teacher Name:</strong> {viewData.teacherName}</Typography>
      
      <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>
        Close
      </Button>
    </Box>
  );
};

export default ViewVideoClass;
