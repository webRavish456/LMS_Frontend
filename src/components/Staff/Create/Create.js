"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CreateStaff = ({ handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({
    staffName: "",
    designation: "",
    mobile: "",
    email: "",
    address: "",
    salary: "",
    joiningDate: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${Base_url}/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();

      if (res.status === "success") {
        toast.success("Staff added successfully!");
        handleCreate(true); // tell parent to reload staff list
      } else {
        toast.error(res.message || "Failed to add staff");
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      toast.error("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="staffName"
            label="Staff Name"
            value={formData.staffName}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="designation"
            label="Designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="mobile"
            label="Mobile No."
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="address"
            label="Address"
            multiline
            rows={2}
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="salary"
            label="Salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="joiningDate"
            label="Joining Date"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="status"
            label="Availability Status"
            value={formData.status}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateStaff;
