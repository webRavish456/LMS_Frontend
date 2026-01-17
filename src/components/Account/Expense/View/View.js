"use client";
import React from "react";
import { Box, Typography, Grid, Divider, Button } from "@mui/material";

const ViewExpense = ({ viewData, handleClose }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="overline" color="textSecondary">Item Name</Typography>
          <Typography variant="h6">{viewData?.item}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="overline" color="textSecondary">Amount</Typography>
          <Typography variant="h6" color="primary">₹{viewData?.cost}</Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleClose} variant="contained">Close</Button>
      </Box>
    </Box>
  );
};

export default ViewExpense;