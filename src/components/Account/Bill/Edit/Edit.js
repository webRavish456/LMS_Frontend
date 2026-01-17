"use client";
import React, { useState, useEffect } from "react";
import { Box, TextField, Grid, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";

const Edit = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    billName: "",
    amount: "",
    description: ""
  });

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // Pre-fill the form with existing data when the modal opens
  useEffect(() => {
    if (editData) {
      setFormData({
        billName: editData.billName || "",
        amount: editData.amount || "",
        description: editData.description || ""
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending update request to the specific bill ID
      const response = await fetch(`${Base_url}/bill/${editData._id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const res = await response.json();
      if (res.status === "success" || res.success) {
        toast.success("Bill Updated Successfully!");
        handleUpdate(); // Refresh the table list
        handleClose();  // Close the dialog
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      toast.error("Network Error: Could not update bill");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bill Name"
            name="billName"
            value={formData.billName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Amount (₹)"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained" color="primary">Update Bill</Button>
      </Box>
    </Box>
  );
};

export default Edit;