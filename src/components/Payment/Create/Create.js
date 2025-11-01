'use client';

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";

const Create = ({ onClose, onCreate }) => {
  const [feature, setFeature] = useState("");

  const handleSubmit = () => {
    if (feature.trim() === "") return;
    onCreate({ feature });
    setFeature("");
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Feature</DialogTitle>
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
        <Button variant="contained" onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Create;
