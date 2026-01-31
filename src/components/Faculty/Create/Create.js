"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateFaculty() {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    teacherName: "",
    emailId: "",
    mobileNumber: "",

    branchName: "",
    courseName: "",
    salary: "",

    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",

    resumeCertificate: null,
    highestQualificationCertificate: null,
    panCard: null,
    aadharCard: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Login required");

    const fd = new FormData();

    fd.append("teacherName", formData.teacherName);
    fd.append("emailId", formData.emailId);
    fd.append("mobileNumber", formData.mobileNumber);

    fd.append(
      "companyDetails",
      JSON.stringify({
        branchName: formData.branchName,
        courseName: formData.courseName,
        salary: formData.salary,
      })
    );

    fd.append(
      "bankDetails",
      JSON.stringify({
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
      })
    );

    fd.append("resumeCertificate", formData.resumeCertificate);
    fd.append(
      "highestQualificationCertificate",
      formData.highestQualificationCertificate
    );
    fd.append("panCard", formData.panCard);
    fd.append("aadharCard", formData.aadharCard);

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/faculty`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        // ✅ ONLY REDIRECT (NO SUCCESS TOAST HERE)
        router.push("/faculty?success=created");
      } else {
        toast.error(result.message || "Save failed");
      }
    } catch {
      toast.error("Server / Network error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = () => {
    router.push("/faculty");
  };

  const fileStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "4px",
    width: "100%",
    marginBottom: "12px",
  };

  return (
    <>
      {/* ❌ Success toast yahan use nahi hoga */}
      <ToastContainer position="top-right" />

      <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f4f6f8" }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Add New Faculty
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(450px, 1fr))",
              gap: 3,
            }}
          >
            {/* PERSONAL */}
            <Card>
              <CardContent>
                <Typography fontWeight={600} mb={2}>
                  Personal Details
                </Typography>

                <TextField
                  fullWidth
                  label="Faculty Name"
                  name="teacherName"
                  required
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="emailId"
                  required
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobileNumber"
                  required
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    ),
                  }}
                />
              </CardContent>
            </Card>

            {/* DOCUMENTS */}
            <Card>
              <CardContent>
                <Typography fontWeight={600} mb={2}>
                  Document Details
                </Typography>

                <input type="file" name="resumeCertificate" onChange={handleChange} style={fileStyle} required />
                <input type="file" name="highestQualificationCertificate" onChange={handleChange} style={fileStyle} required />
                <input type="file" name="panCard" onChange={handleChange} style={fileStyle} required />
                <input type="file" name="aadharCard" onChange={handleChange} style={fileStyle} required />
              </CardContent>
            </Card>

            {/* BANK */}
            <Card>
              <CardContent>
                <Typography fontWeight={600} mb={2}>
                  Bank Details
                </Typography>

                <TextField
                  fullWidth
                  label="Account Holder Name"
                  name="accountHolderName"
                  required
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Account Number"
                  name="accountNumber"
                  required
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="IFSC Code"
                  name="ifscCode"
                  onChange={handleChange}
                />
              </CardContent>
            </Card>

            {/* COMPANY */}
            <Card>
              <CardContent>
                <Typography fontWeight={600} mb={2}>
                  Company Details
                </Typography>

                <TextField
                  fullWidth
                  label="Branch Name"
                  name="branchName"
                  required
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Course Name"
                  name="courseName"
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Salary"
                  name="salary"
                  onChange={handleChange}
                />
              </CardContent>
            </Card>
          </Box>

          {/* ACTION BUTTONS */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              onClick={handleCancel}
              disabled={loading}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                backgroundColor: "#2e7d32",
                "&:hover": { backgroundColor: "#1b5e20" },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Save Faculty"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}
