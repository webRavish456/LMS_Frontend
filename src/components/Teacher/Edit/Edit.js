"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button } from "@mui/material";

export default function Edit({ open, onClose, teacher, onUpdate }) {
  const [updatedTeacher, setUpdatedTeacher] = useState({ ...teacher });

  useEffect(() => {
    setUpdatedTeacher({ ...teacher });
  }, [teacher]);

  const handleSave = () => {
    onUpdate(updatedTeacher);
  };

  if (!teacher) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Teacher</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {Object.keys(updatedTeacher).map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                label={key.replace(/([A-Z])/g, " $1")}
                value={updatedTeacher[key]}
                onChange={(e) => setUpdatedTeacher({ ...updatedTeacher, [key]: e.target.value })}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}
