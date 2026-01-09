"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, MenuItem } from "@mui/material";

const Edit = ({ data, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    branchName: "",
    branchLocation: "",
    Contact: "",
    status: "Active",
  });

  // जब 'data' प्रॉप आए, तो फॉर्म में डेटा भरें
  useEffect(() => {
    if (data) {
      setFormData({
        _id: data._id,
        branchName: data.branchName || "",
        branchLocation: data.branchLocation || "",
        Contact: data.Contact || "",
        status: data.status || "Active",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(formData); // Parent के handleUpdate फंक्शन को कॉल करेगा
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, color: "#ed6c02" }}>Edit Branch Details</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Branch Name" name="branchName" fullWidth value={formData.branchName} onChange={handleChange} />
          <TextField label="Location" name="branchLocation" fullWidth value={formData.branchLocation} onChange={handleChange} />
          <TextField label="Contact" name="Contact" fullWidth value={formData.Contact} onChange={handleChange} />
          <TextField select label="Status" name="status" fullWidth value={formData.status} onChange={handleChange}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} color="warning">Update Branch</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Edit;