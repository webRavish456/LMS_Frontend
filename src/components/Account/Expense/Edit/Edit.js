"use client";
import React, { useState, useEffect } from "react";
import { Box, TextField, Grid, Button } from "@mui/material";
import { toast } from "react-toastify";

const EditExpense = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({ item: "", cost: "" });
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (editData) setFormData({ item: editData.item, cost: editData.cost });
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/expense/${editData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const res = await response.json();
      if (res.status === "success" || res.success) {
        toast.success("Expense updated!");
        handleUpdate();
        handleClose();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}><TextField fullWidth label="Expense Item" required value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Cost" type="number" required value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} /></Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained">Update</Button>
      </Box>
    </Box>
  );
};

export default EditExpense;