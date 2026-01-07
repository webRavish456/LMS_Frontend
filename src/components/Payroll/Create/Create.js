"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Grid } from "@mui/material";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const CreatePayroll = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    month: "",
    year: "",
    workDays: "",
    basicSalary: "",
    bonus: "",
    status: "Unpaid",
  });

  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${Base_url}/payroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // auth token
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.status === "success") {
        toast.success("Payroll created successfully!");
        handleCreate(true); // parent ko notify karo
        handleClose(); // dialog close
      } else {
        toast.error(result.message || "Failed to create payroll");
      }
    } catch (err) {
      console.error("Error creating payroll:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 2, minWidth: "400px" }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Employee Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            label="Month"
            name="month"
            value={formData.month}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            label="Work Days"
            name="workDays"
            type="number"
            value={formData.workDays}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            label="Basic Salary"
            name="basicSalary"
            type="number"
            value={formData.basicSalary}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Bonus"
            name="bonus"
            type="number"
            value={formData.bonus}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          color="secondary"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePayroll;
