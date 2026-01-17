'use client';
import React from "react";
import { Grid, Typography, Box, Divider, Button } from "@mui/material";

export default function View({ data, handleClose }) {
  if (!data) return null;

  const infoStyle = { mb: 2 };
  const labelStyle = { fontWeight: 700, color: "#555", display: "block" };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={infoStyle}>
            <Typography sx={labelStyle}>Student Name</Typography>
            <Typography>{data.studentName}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={infoStyle}>
            <Typography sx={labelStyle}>Assignment Title</Typography>
            <Typography>{data.assignmentTitle}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={infoStyle}>
            <Typography sx={labelStyle}>Due Date</Typography>
            <Typography>{new Date(data.dueDate).toLocaleDateString("en-IN")}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={infoStyle}>
            <Typography sx={labelStyle}>Status</Typography>
            <Typography>{data.status}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleClose} variant="contained">Close</Button>
      </Box>
    </Box>
  );
}