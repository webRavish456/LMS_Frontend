"use client";
import React, { useState } from "react";
import { Box, TextField, Grid, Button } from "@mui/material";
import { toast } from "react-toastify";

const Create = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    mobileNo: "",
    courseAsssigned: "",
    admissionDate: new Date().toISOString().split('T')[0],
    tax: 0,
    discount: 0,
    paidAmount: 0,
    totalAmount: 0
  });
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 

    try {
      const response = await fetch(`${Base_url}/bill`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();
      
      if (res.status === "success" || res.success) {
        toast.success("Bill saved to database!");
        handleCreate(); 
        handleClose();  
      } else {
        toast.error(res.message || "Failed to save");
      }
    } catch (error) {
      toast.error("Network error: Server is not reachable");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Student Name" name="studentName" onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Mobile" name="mobileNo" onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth type="number" label="Total Amount" name="totalAmount" onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth type="number" label="Paid Amount" name="paidAmount" onChange={handleChange} required />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">Save Bill</Button>
      </Box>
    </Box>
  );
};

export default Create;