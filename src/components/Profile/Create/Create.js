"use client";

import React, { useState } from "react";
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

const schema = yup.object().shape({
  profilePhoto: yup
    .mixed()
    .test("required", "Profile Photo is required", (value) => {
      return value && value.length > 0;
    }),
  mobileNo: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  email: yup.string().required("Email ID is required").email("Invalid email"),
  address: yup.string().required("Address is required"),
  dob: yup.string().required("Date of Birth is required"),
  name: yup.string().required("Name is required"),
  gender: yup.string().required("Gender is required"),
  password: yup.string().required("Password is required"),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const CreateProfile = ({ handleCreate, handleClose }) => {
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

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("profilePhoto", data.profilePhoto[0]);
    formData.append("mobileNo", data.mobileNo);
    formData.append("address", data.address);
    formData.append("dob", data.dob);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("gender", data.gender);
    formData.append("password", data.password);

    try {
      const response = await fetch(`${Base_url}/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const res = await response.json();

      if (res.status === "success") {
        toast.success("Profile Created Successfully!");

        // ✅ profileId save
        localStorage.setItem("profileId", JSON.stringify(res.id));

        // 🔥 HEADER PROFILE IMAGE UPDATE
        if (res.data?.profilePhoto) {
          localStorage.setItem(
            "profilePhoto",
            JSON.stringify(res.data.profilePhoto)
          );
          window.dispatchEvent(new Event("profile-updated"));
        }

        handleCreate(true);
        handleClose();
        reset();
      } else {
        toast.error(res.message || "Create failed");
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container columnSpacing={2}>
        {/* Name */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Full Name *"
            {...register("name")}
            error={!!errors.name}
            fullWidth
            margin="normal"
          />
          <Typography color="error" fontSize={12}>
            {errors.name?.message}
          </Typography>
        </Grid>

        {/* Gender */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal" error={!!errors.gender}>
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
            margin="normal"
          />
          <Typography color="error" fontSize={12}>
            {errors.mobileNo?.message}
          </Typography>
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Email Id *"
            {...register("email")}
            error={!!errors.email}
            fullWidth
            margin="normal"
          />
          <Typography color="error" fontSize={12}>
            {errors.email?.message}
          </Typography>
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
            margin="normal"
          />
          <Typography color="error" fontSize={12}>
            {errors.dob?.message}
          </Typography>
        </Grid>

        {/* Profile Photo */}
        <Grid item xs={12} md={6}>
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            {...register("profilePhoto")}
            error={!!errors.profilePhoto}
            fullWidth
            margin="normal"
          />
          <Typography color="error" fontSize={12}>
            {errors.profilePhoto?.message}
          </Typography>
        </Grid>

        {/* Password */}
        <Grid item xs={12} md={6}>
          <TextField
            type="password"
            label="Enter New Password *"
            {...register("password")}
            error={!!errors.password}
            fullWidth
            margin="normal"
          />
          <Typography color="error" fontSize={12}>
            {errors.password?.message}
          </Typography>
        </Grid>

        {/* Confirm Password */}
        <Grid item xs={12} md={6}>
          <TextField
            type="password"
            label="Confirm New Password *"
            {...register("confirmpassword")}
            error={!!errors.confirmpassword}
            fullWidth
            margin="normal"
          />
          <Typography color="error" fontSize={12}>
            {errors.confirmpassword?.message}
          </Typography>
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
            margin="normal"
          />
          <Typography color="error" fontSize={12}>
            {errors.address?.message}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button onClick={handleClose} className="secondary_button">
          Cancel
        </Button>
        <Button type="submit" className="primary_button">
          {loading ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1, color: "#fff" }} />
              Submitting
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </form>
  );
};

export default CreateProfile;
