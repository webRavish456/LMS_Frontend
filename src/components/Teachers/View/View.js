"use client";
import React from "react";
import { Box, Typography, Divider, Button, Stack } from "@mui/material";

const ViewTeacher = ({ viewData, handleClose }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="caption" color="textSecondary">Full Name</Typography>
          <Typography variant="h6">{viewData?.name}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="textSecondary">Subject Specialty</Typography>
          <Typography variant="h6">{viewData?.subject}</Typography>
        </Box>
        <Divider />
        <Box>
          <Typography variant="body1"><b>Email:</b> {viewData?.email || "N/A"}</Typography>
          <Typography variant="body1"><b>Mobile:</b> {viewData?.mobile || "N/A"}</Typography>
        </Box>
      </Stack>
      <Box sx={{ mt: 4, textAlign: "right" }}>
        <Button onClick={handleClose} variant="contained">Close</Button>
      </Box>
    </Box>
  );
};

export default ViewTeacher;