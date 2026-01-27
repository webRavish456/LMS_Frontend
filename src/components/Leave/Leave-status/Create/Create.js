"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

const Create = ({ onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    profile: "",
    leaveType: "",
    startDate: new Date().toISOString().split("T")[0],
    reason: "",
    attachments: null,
  });

  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  /* ================= FILE CHANGE ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // ✅ File size limit (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    setFormData({ ...formData, attachments: file });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (!formData.profile.trim()) {
      return toast.error("Employee name is required");
    }
    if (!formData.leaveType) {
      return toast.error("Leave type is required");
    }
    if (!formData.startDate) {
      return toast.error("Start date is required");
    }
    if (!formData.reason.trim()) {
      return toast.error("Reason is required");
    }
    if (!formData.attachments) {
      return toast.error("Attachment is required");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return toast.error("Unauthorized, please login again");
    }

    const data = new FormData();
    data.append("profile", formData.profile.trim());
    data.append("date", formData.startDate);
    data.append("leaveType", formData.leaveType);
    data.append("reason", formData.reason.trim());
    data.append("leaveDuration", "1 Day");
    data.append("activity", "Pending");
    data.append("attachments", formData.attachments);

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/leave-status`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Leave Applied Successfully");
        onRefresh && onRefresh();
        onClose && onClose();
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        {/* Employee Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Employee Name"
            required
            value={formData.profile}
            onChange={(e) =>
              setFormData({ ...formData, profile: e.target.value })
            }
          />
        </Grid>

        {/* Leave Type */}
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={formData.leaveType}
              label="Leave Type"
              onChange={(e) =>
                setFormData({ ...formData, leaveType: e.target.value })
              }
            >
              <MenuItem value="Paid Casual">Paid Casual</MenuItem>
              <MenuItem value="Paid Sick">Paid Sick</MenuItem>
              <MenuItem value="Unpaid Casual">Unpaid Casual</MenuItem>
              <MenuItem value="Unpaid Sick">Unpaid Sick</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Start Date */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
        </Grid>

        {/* Reason */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Reason"
            required
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
        </Grid>

        {/* Attachment */}
        <Grid item xs={12}>
          <Typography variant="body2" fontWeight={500} mb={1}>
            Upload Attachment (PDF / Image, max 2MB)
          </Typography>

          <Box
            component="label"
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { borderColor: "#1976d2" },
            }}
          >
            <input
              type="file"
              hidden
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />

            <CloudUploadIcon sx={{ fontSize: 30, color: "#777" }} />
            <Typography variant="body2">Click to upload</Typography>

            {formData.attachments && (
              <Typography
                variant="caption"
                color="green"
                fontWeight={600}
                display="block"
                mt={1}
              >
                {formData.attachments.name}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12} sx={{ textAlign: "right" }}>
          <Button onClick={onClose} sx={{ mr: 2 }} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Create;
