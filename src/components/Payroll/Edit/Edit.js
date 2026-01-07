'use client'

import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const schema = yup.object().shape({
  employeeName: yup.string().required("Employee name is required"),
  salary: yup
    .number()
    .typeError("Salary must be a number")
    .required("Salary is required"),
});

const EditPayroll = ({ editData, handleUpdate, handleClose }) => {
  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Pre-fill form with existing payroll data
  useEffect(() => {
    if (editData) {
      setValue("employeeName", editData.employeeName || "");
      setValue("salary", editData.salary || "");
    }
  }, [editData, setValue]);

  const onSubmit = (data) => {
    setLoading(true);

    fetch(`${Base_url}/payroll/${editData._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          toast.success("Payroll updated successfully!");
          handleUpdate(true);
          handleClose();
        } else {
          toast.error(res.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("Something went wrong while updating!");
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Employee Name"
            fullWidth
            {...register("employeeName")}
            error={!!errors.employeeName}
            helperText={errors.employeeName?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Salary"
            type="number"
            fullWidth
            {...register("salary")}
            error={!!errors.salary}
            helperText={errors.salary?.message}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? (
            <>
              <CircularProgress size={18} style={{ marginRight: 8, color: "#fff" }} />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </form>
  );
};

export default EditPayroll;
