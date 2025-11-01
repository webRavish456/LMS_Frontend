'use client';

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from "@mui/material";

const Delete = ({ data, onClose, onConfirm }) => {
  if (!data) return null;

  return (
    <Dialog open={!!data} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Feature</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography>Are you sure you want to delete <strong>{data.feature}</strong>?</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Delete;
