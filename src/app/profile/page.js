'use client'
import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Layout from "@/components/Layout";
import CreateProfile from "@/components/Profile/Create/Create"; // Check path

const ProfileList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false); // Direct state for Dialog
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchProfiles = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${Base_url}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.status === "success") setRows(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Profile Management</Typography>
          {/* Button click par openCreate true hoga */}
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)} sx={{ bgcolor: "#072eb0" }}>
            Add Profile
          </Button>
        </Box>

        {/* Table structure same rahega */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center"><CircularProgress /></TableCell></TableRow>
              ) : rows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell align="center">Actions Here</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* AGAR openCreate TRUE HAI TOH DIALOG KHULEGA */}
        {openCreate && (
          <CreateProfile 
            onClose={() => setOpenCreate(false)} 
            onCreate={fetchProfiles} 
          />
        )}
      </Box>
    </Layout>
  );
};

export default ProfileList;