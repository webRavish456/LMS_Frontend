"use client";

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Chip,
} from "@mui/material";

const ViewSchedule = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  return (
    <Box sx={{ p: 2, minWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Schedule Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Schedule ID
          </Typography>
          <Typography variant="body1">{viewData.scheduleId}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Course ID
          </Typography>
          <Typography variant="body1">{viewData.courseId}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Teacher ID
          </Typography>
          <Typography variant="body1">{viewData.teacherId}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Start Time
          </Typography>
          <Typography variant="body1">
            {new Date(viewData.startTime).toLocaleString()}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            End Time
          </Typography>
          <Typography variant="body1">
            {new Date(viewData.endTime).toLocaleString()}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Status
          </Typography>
          <Chip
            label={viewData.status?.props?.label || viewData.status}
            color={
              viewData.status === "Cancelled"
                ? "error"
                : viewData.status === "Rescheduled"
                ? "warning"
                : "success"
            }
            size="small"
          />
        </Grid>

        {viewData.createdAt && (
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {new Date(viewData.createdAt).toLocaleString()}
            </Typography>
          </Grid>
        )}

        {viewData.updatedAt && (
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Updated At
            </Typography>
            <Typography variant="body1">
              {new Date(viewData.updatedAt).toLocaleString()}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 3,
        }}
      >
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default ViewSchedule;
