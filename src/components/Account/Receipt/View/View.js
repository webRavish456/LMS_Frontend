"use client";
import React from "react";
import { Box, Typography, Grid, Divider, Button } from "@mui/material";

const ViewReceipt = ({ viewData, handleClose }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="overline" color="textSecondary">Receipt ID</Typography>
          <Typography variant="h6">{viewData?.number || "N/A"}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="overline" color="textSecondary">Amount</Typography>
          <Typography variant="h6" color="primary">₹{viewData?.amount || 0}</Typography>
        </Grid>
        <Grid item xs={12}>
           <Divider sx={{ my: 1 }} />
           <Typography variant="overline" color="textSecondary">Created At</Typography>
           <Typography variant="body1">
             {viewData?.createdAt ? new Date(viewData.createdAt).toLocaleString() : "N/A"}
           </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleClose} variant="contained">Close</Button>
      </Box>
    </Box>
  );
};

export default ViewReceipt;