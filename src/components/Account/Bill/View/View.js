"use client";
import React from "react";
import { Box, Typography, Grid, Divider, Button } from "@mui/material";

const View = ({ viewData, handleClose }) => {
  if (!viewData) return <Typography>No Data Available</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="overline" color="textSecondary">Bill Name</Typography>
          <Typography variant="h6" fontWeight={600}>{viewData.billName}</Typography>
        </Grid>
        
        <Grid item xs={6}>
          <Typography variant="overline" color="textSecondary">Amount</Typography>
          <Typography variant="h6" color="primary">₹{viewData.amount}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="overline" color="textSecondary">Created Date</Typography>
          <Typography variant="body1">
            {viewData.createdAt ? new Date(viewData.createdAt).toLocaleDateString() : "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="overline" color="textSecondary">Description</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {viewData.description || "No description provided for this bill."}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button onClick={handleClose} variant="contained" color="inherit">
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default View;