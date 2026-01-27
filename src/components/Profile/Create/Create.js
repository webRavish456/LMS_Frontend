"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { toast } from "react-toastify";

const CreateProfile = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    address: "",
    dob: "",
    gender: "male",
    password: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async () => {
    if (loading) return;

    const { name, email, mobileNo, address, dob, password } = formData;

    // ✅ Validation
    if (!name || !email || !mobileNo || !address || !dob || !password) {
      toast.error("All fields are required");
      return;
    }

    if (mobileNo.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    setLoading(true);

    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) =>
      dataToSend.append(key, formData[key])
    );

    const fileInput = document.getElementById("profile-img");
    if (fileInput?.files[0]) {
      dataToSend.append("profilePhoto", fileInput.files[0]);
    }

    try {
      const response = await fetch(`${BASE_URL}/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: dataToSend,
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Create failed");
      }

      // ✅ ONLY callback
      onCreate();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Profile</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Profile Image */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar src={preview} sx={{ width: 80, height: 80 }} />

            <input
              accept="image/*"
              id="profile-img"
              type="file"
              hidden
              onChange={(e) =>
                setPreview(URL.createObjectURL(e.target.files[0]))
              }
            />

            <label htmlFor="profile-img">
              <IconButton component="span">
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Box>

          {/* Name */}
          <TextField
            label="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          {/* Email */}
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {/* Mobile Number (FINAL FIX) */}
          <TextField
            label="Mobile Number"
            type="tel"
            value={formData.mobileNo}
            inputProps={{
              maxLength: 10,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setFormData({ ...formData, mobileNo: value });
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* DOB */}
          <TextField
            label="DOB"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.dob}
            onChange={(e) =>
              setFormData({ ...formData, dob: e.target.value })
            }
          />

          {/* Address */}
          <TextField
            label="Address"
            multiline
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProfile;
