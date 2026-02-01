"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Box,
  Grid,
  Avatar,
  FormControl,
  FormLabel,
} from "@mui/material";

import Layout from "@/components/Layout";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CommonDialog from "@/components/CommonDialog/CommonDialog";
import CreateProfile from "@/components/Profile/Create/Create";
import EditProfile from "@/components/Profile/Edit/Edit";

export default function ProfilePage() {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const [token, setToken] = useState(null);
  const [profileId, setProfileId] = useState(null);

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  /* ================= CLIENT SIDE STORAGE ================= */
  useEffect(() => {
    const t =
      Cookies.get("token") ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    const pid =
      typeof window !== "undefined"
        ? localStorage.getItem("profileId")
        : null;

    setToken(t);
    setProfileId(pid && pid !== "undefined" ? JSON.parse(pid) : null);
  }, []);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = useCallback(async () => {
    if (!token || !profileId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${Base_url}/profile/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (result.status === "success") {
        setProfile(result.data);
        setEditMode(true);

        // 🔥 HEADER PROFILE SYNC
        localStorage.setItem(
          "profilePhoto",
          JSON.stringify(result.data.profilePhoto || "")
        );
        window.dispatchEvent(new Event("profile-updated"));
      }
    } catch (err) {
      console.error("Profile fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [profileId, token, Base_url]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) return null;

  return (
    <Layout>
      <ToastContainer position="top-right" />

      <Box sx={{ p: 3 }}>
        {/* ================= TOP CARD ================= */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={profile.profilePhoto || ""}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                  <Box>
                    <Typography fontWeight="bold">Super Admin</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        fontSize: "12px",
                        mt: 1,
                      }}
                    >
                      Active
                    </Button>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight="bold">
                      ☎ Mobile No.: {profile.mobileNo || ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight="bold">
                      📧 Email Id: {profile.email || ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight="bold">
                      📍 Address: {profile.address || ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight="bold">
                      📅 DOB:{" "}
                      {profile.dob
                        ? new Date(profile.dob).toLocaleDateString("en-IN")
                        : ""}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ================= PERSONAL DETAILS ================= */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Personal Details:</Typography>

              {!editMode ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpenCreate(true)}
                >
                  Create
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpenEdit(true)}
                >
                  Edit
                </Button>
              )}
            </Box>

            <TextField label="Full Name" value={profile.name || ""} fullWidth margin="normal" />

            <FormControl fullWidth margin="normal">
              <FormLabel>Gender</FormLabel>
              <RadioGroup row value={profile.gender || ""}>
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="others" control={<Radio />} label="Others" />
              </RadioGroup>
            </FormControl>

            <TextField label="Date of Birth" value={profile.dob || ""} fullWidth margin="normal" />
            <TextField label="Mobile No" value={profile.mobileNo || ""} fullWidth margin="normal" />
            <TextField label="Email Id" value={profile.email || ""} fullWidth margin="normal" />
            <TextField label="Address" value={profile.address || ""} fullWidth margin="normal" />
          </CardContent>
        </Card>

        {/* ================= DIALOG ================= */}
        <CommonDialog
          open={openCreate || openEdit}
          onClose={() => {
            setOpenCreate(false);
            setOpenEdit(false);
          }}
          dialogTitle={openCreate ? "Create Profile" : "Edit Profile"}
          dialogContent={
            openCreate ? (
              <CreateProfile
                handleCreate={fetchProfile}
                handleClose={() => setOpenCreate(false)}
              />
            ) : (
              <EditProfile
                editData={profile}
                handleUpdate={fetchProfile}
                handleClose={() => setOpenEdit(false)}
              />
            )
          }
        />
      </Box>
    </Layout>
  );
}
