"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Button,
  Box,
  Grid,
  FormControl,
  FormLabel,
  CircularProgress,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

/* ================= VALIDATION ================= */
const schema = yup.object().shape({
  mobileNo: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  email: yup.string().required("Email ID is required").email("Invalid email"),

  address: yup.string().required("Address is required"),
  dob: yup.string().required("Date of Birth is required"),
  name: yup.string().required("Name is required"),
  gender: yup.string().required("Gender is required"),

  password: yup.string(),
  confirmpassword: yup.string().oneOf(
    [yup.ref("password")],
    "Passwords must match"
  ),
});

/* ================= COMPONENT ================= */
const EditProfile = ({ editData, handleUpdate, handleClose }) => {
  const token = Cookies.get("token") || localStorage.getItem("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* ================= PREFILL DATA ================= */
  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name || "",
        email: editData.email || "",
        mobileNo: editData.mobileNo || "",
        address: editData.address || "",
        gender: editData.gender || "",
        dob: editData.dob
          ? new Date(editData.dob).toISOString().split("T")[0]
          : "",
        password: "",
        confirmpassword: "",
      });
    }
  }, [editData, reset]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();

    if (data.profilePhoto?.length > 0) {
      formData.append("profilePhoto", data.profilePhoto[0]);
    }

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("mobileNo", data.mobileNo);
    formData.append("address", data.address);
    formData.append("dob", data.dob);
    formData.append("gender", data.gender);

    if (data.password) {
      formData.append("password", data.password);
    }

    try {
      const res = await fetch(`${Base_url}/profile/${editData._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        toast.success("Profile Updated Successfully!");

        /* 🔥 IMPORTANT: HEADER PROFILE IMAGE SYNC */
        if (result.data?.profilePhoto) {
          localStorage.setItem("profilePhoto", result.data.profilePhoto);
        }

        handleUpdate(true);
        handleClose();
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* Name */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Full Name *"
            {...register("name")}
            error={!!errors.name}
            fullWidth
          />
          <Typography color="error" fontSize={12}>
            {errors.name?.message}
          </Typography>
        </Grid>

        {/* Gender */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.gender}>
            <FormLabel>Gender *</FormLabel>
            <RadioGroup row>
              <FormControlLabel
                value="male"
                control={<Radio {...register("gender")} />}
                label="Male"
              />
              <FormControlLabel
                value="female"
                control={<Radio {...register("gender")} />}
                label="Female"
              />
              <FormControlLabel
                value="others"
                control={<Radio {...register("gender")} />}
                label="Others"
              />
            </RadioGroup>
            <Typography color="error" fontSize={12}>
              {errors.gender?.message}
            </Typography>
          </FormControl>
        </Grid>

        {/* Mobile */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Mobile No *"
            {...register("mobileNo")}
            error={!!errors.mobileNo}
            fullWidth
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Email Id *"
            {...register("email")}
            error={!!errors.email}
            fullWidth
          />
        </Grid>

        {/* DOB */}
        <Grid item xs={12} md={6}>
          <TextField
            type="date"
            label="Date of Birth *"
            InputLabelProps={{ shrink: true }}
            {...register("dob")}
            error={!!errors.dob}
            fullWidth
          />
        </Grid>

        {/* Profile Photo */}
        <Grid item xs={12} md={6}>
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            {...register("profilePhoto")}
            fullWidth
          />
          {editData?.profilePhoto && (
            <Typography fontSize={13} mt={1}>
              Existing Photo:&nbsp;
              <a
                href={editData.profilePhoto}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </Typography>
          )}
        </Grid>

        {/* Password */}
        <Grid item xs={12} md={6}>
          <TextField
            type="password"
            label="New Password"
            {...register("password")}
            fullWidth
          />
        </Grid>

        {/* Confirm Password */}
        <Grid item xs={12} md={6}>
          <TextField
            type="password"
            label="Confirm Password"
            {...register("confirmpassword")}
            error={!!errors.confirmpassword}
            fullWidth
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <TextField
            label="Address *"
            multiline
            rows={3}
            {...register("address")}
            error={!!errors.address}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button onClick={handleClose} className="secondary_button">
          Cancel
        </Button>
        <Button type="submit" className="primary_button">
          {loading ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1, color: "#fff" }} />
              Saving
            </>
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </form>
  );
};

export default EditProfile;
