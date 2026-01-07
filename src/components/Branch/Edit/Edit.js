"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const Edit = ({ data, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    branchId: "",
    branchName: "",
    location: "",
    contact: "",
    status: "Active",
    createdAt: "",
    id: null,
  });

  // Initialize form with data when modal opens
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onClose();
  };

  if (!data) return null;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Branch</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Branch ID"
          name="branchId"
          value={formData.branchId}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Branch Name"
          name="branchName"
          value={formData.branchName}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Location Address"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Contact Info"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
        />
        <TextField
          select
          fullWidth
          margin="dense"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Edit;
