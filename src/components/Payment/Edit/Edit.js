'use client';

import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";

const Edit = ({ data, onClose, onUpdate }) => {
  const [feature, setFeature] = useState("");

  useEffect(() => {
    if (data) setFeature(data.feature);
  }, [data]);

  const handleSubmit = () => {
    if (feature.trim() === "") return;
    onUpdate({ ...data, feature });
  };

  return (
    <Dialog open={!!data} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Feature</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Feature Name"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Edit;
