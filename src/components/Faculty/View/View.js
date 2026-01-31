"use client";

import { Box, Typography } from "@mui/material";

const ViewFaculty = ({ data }) => {
  if (!data) return null;

  return (
    <Box>
      <Typography><b>Name:</b> {data.teacherName}</Typography>
      <Typography><b>Email:</b> {data.emailId}</Typography>
      <Typography><b>Mobile:</b> {data.mobileNumber}</Typography>
      <Typography><b>Course:</b> {data.companyDetails?.courseName}</Typography>
      <Typography><b>Branch:</b> {data.companyDetails?.branchName}</Typography>
      <Typography><b>Status:</b> {data.status}</Typography>
    </Box>
  );
};

export default ViewFaculty;
