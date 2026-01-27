"use client";

import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";

const ViewStaff = ({ viewData }) => {
  if (!viewData) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography fontWeight={600}>Staff Name</Typography>
          <Typography>{viewData.staffName}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight={600}>Designation</Typography>
          <Typography>{viewData.designation}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight={600}>Mobile No</Typography>
          <Typography>{viewData.mobile}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight={600}>Email</Typography>
          <Typography>{viewData.email}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography fontWeight={600}>Address</Typography>
          <Typography>{viewData.address}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight={600}>Salary</Typography>
          <Typography>{viewData.salary}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight={600}>Joining Date</Typography>
          <Typography>{viewData.joiningDate}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight={600}>Status</Typography>
          <Typography>{viewData.status}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default ViewStaff;
