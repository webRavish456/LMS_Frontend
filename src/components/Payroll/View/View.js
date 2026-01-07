"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
} from "@mui/material";

const ViewPayroll = ({ viewData, handleClose }) => {
  if (!viewData) {
    return (
      <Typography variant="body1" color="text.secondary">
        No payroll data available
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Payroll Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Employee Name:</Typography>
          <Typography variant="body1">{viewData.name}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Work Days:</Typography>
          <Typography variant="body1">{viewData.workDays}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Month:</Typography>
          <Typography variant="body1">{viewData.month}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Year:</Typography>
          <Typography variant="body1">{viewData.year}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Basic Salary:</Typography>
          <Typography variant="body1">₹ {viewData.basicSalary}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Bonus:</Typography>
          <Typography variant="body1">₹ {viewData.bonus}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Total Salary:</Typography>
          <Typography variant="body1">₹ {viewData.totalSalary}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Status:</Typography>
          <Typography
            variant="body1"
            color={viewData.status === "Paid" ? "green" : "red"}
          >
            {viewData.status}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="flex-end">
        <Button onClick={handleClose} variant="contained" color="primary">
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default ViewPayroll;
