"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditStaff = ({ editData, handleUpdate, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editData) {
      reset({
        staffName: editData.staffName,
        designation: editData.designation,
        mobileNO: editData.mobile,
        email: editData.email,
        address: editData.address,
        salary: editData.salary,
        joiningDate: editData.joiningDate,
        status: editData.status,
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      staffName: data.staffName,
      designation: data.designation,
      mobileNO: Number(data.mobileNO),
      email: data.email,
      address: data.address,
      salary: Number(data.salary),
      joiningDate: data.joiningDate,
      status: data.status,
    };

    try {
      const response = await fetch(`${Base_url}/staff/${editData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (res.status === "success") {
        toast.success("Staff updated successfully!");
        handleUpdate(true);
        handleClose();
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Staff Name"
            fullWidth
            {...register("staffName", { required: true })}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Designation"
            fullWidth
            {...register("designation", { required: true })}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Mobile No"
            fullWidth
            {...register("mobileNO", { required: true })}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            fullWidth
            {...register("email", { required: true })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Address"
            fullWidth
            {...register("address")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Salary"
            type="number"
            fullWidth
            {...register("salary")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Joining Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            {...register("joiningDate")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Status"
            fullWidth
            {...register("status")}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Leave">On Leave</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditStaff;
