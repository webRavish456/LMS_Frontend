"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Layout from "@/components/Layout";
import CreateProfile from "@/components/Profile/Create/Create";
import { toast } from "react-toastify";

const ProfileList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // 🔐 SAFE FETCH
  const fetchProfiles = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setRows([]);
      return;
    }

    const res = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();

    // HTML response protection
    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
      setRows([]);
      return;
    }

    const result = JSON.parse(text);

    // 🔥 IMPORTANT CHANGE
    // ❌ error throw hata diya
    if (!res.ok) {
      setRows([]);     // bas empty rakho
      return;
    }

    setRows(Array.isArray(result.data) ? result.data : []);
  } catch (error) {
    console.error(error);
    setRows([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Profile Management
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: "#072eb0" }}
            onClick={() => setOpenCreate(true)}
          >
            Add Profile
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
<TableBody>
  {loading && (
    <TableRow>
      <TableCell colSpan={3} align="center">
        <CircularProgress />
      </TableCell>
    </TableRow>
  )}

  {!loading &&
    rows.length > 0 &&
    rows.map((row, index) => (
      <TableRow key={row?._id || index}>
        <TableCell>{row?.name}</TableCell>
        <TableCell>{row?.email}</TableCell>
        <TableCell>{row?.mobileNo}</TableCell>
      </TableRow>
    ))}
</TableBody>

          </Table>
        </TableContainer>

        {/* Create Dialog */}
        {openCreate && (
         <CreateProfile
  onClose={() => setOpenCreate(false)}
  onCreate={async () => {
    setOpenCreate(false);
    await fetchProfiles();
    toast.success("Profile created successfully");
  }}
/>

        )}
      </Box>
    </Layout>
  );
};

export default ProfileList;
