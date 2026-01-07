"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

/* ================= VALIDATION ================= */
const schema = yup.object({
  staffName: yup.string().required("Staff Name is required"),
  designation: yup.string().required("Designation is required"),
  mobileNO: yup
    .string()
    .required("Mobile No is required")
    .matches(/^[0-9]{10}$/, "Mobile No must be 10 digits"),
  email: yup.string().email("Invalid email").required("Email is required"),
  address: yup.string().nullable(),
  salary: yup.number().nullable().typeError("Salary must be a number"),
  joiningDate: yup.string().nullable(),
  status: yup.string().required("Status is required"),
});

const CreateStaff = ({ onSuccess, handleClose }) => {
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token')
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      staffName: "",
      designation: "",
      mobileNO: "",
      email: "",
      address: "",
      salary: "",
      joiningDate: "",
      status: "Active",
    },
  });

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    setLoading(true);

    // ✅ clean payload (remove empty optional fields)
    const payload = {
      staffName: data.staffName,
      designation: data.designation,
      mobileNO: data.mobileNO,
      email: data.email,
      status: data.status,
      ...(data.address && { address: data.address }),
      ...(data.salary && { salary: data.salary }),
      ...(data.joiningDate && { joiningDate: data.joiningDate }),
    };

    try {
      const response = await fetch(`${Base_url}/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (res.status === "success") {
        toast.success("Staff added successfully!");
        reset();
        onSuccess?.();
        handleClose();
      } else {
        toast.error(res.message || "Failed to add staff");
      }
    } catch (error) {
      console.error(error);
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
            fullWidth
            label="Staff Name *"
            {...register("staffName")}
            error={!!errors.staffName}
            helperText={errors.staffName?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Designation *"
            {...register("designation")}
            error={!!errors.designation}
            helperText={errors.designation?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mobile No *"
            {...register("mobileNO")}
            error={!!errors.mobileNO}
            helperText={errors.mobileNO?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email *"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address (Optional)"
            {...register("address")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Salary (Optional)"
            type="number"
            {...register("salary")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Joining Date (Optional)"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("joiningDate")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel>Status *</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status *">
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Leave">On Leave</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.status?.message}</FormHelperText>
          </FormControl>
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
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateStaff;
