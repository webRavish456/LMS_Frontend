'use client';

import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const ViewStudent = ({ viewData }) => {
  if (!viewData) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography><b>Name:</b> {viewData.studentName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><b>Email:</b> {viewData.emailId}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><b>Mobile:</b> {viewData.mobileNumber}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><b>Course:</b> {viewData.course}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><b>Status:</b> {viewData.status}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography><b>Address:</b> {viewData.address}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewStudent;
