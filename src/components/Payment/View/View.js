'use client';

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from "@mui/material";

const View = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <Dialog open={!!data} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>View Feature</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography><strong>Feature Name:</strong> {data.feature}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default View;
