'use client'
import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Layout from "@/components/Layout";
import CreateProfile from "@/components/Profile/Create/Create"; 
import { toast } from "react-toastify";

const ProfileList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false); 
  
  
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api";

  const fetchProfiles = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`${Base_url}/profile`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json" 
        }
      });

      
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const result = await res.json();
        if (result.status === "success") {
          setRows(Array.isArray(result.data) ? result.data : [result.data]);
        }
      } else {
        console.error("Failed to fetch or received non-JSON response (404/500)");
        // toast.error("Profile list not found. Check API Route.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => { 
    fetchProfiles(); 
  }, [fetchProfiles]);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Profile Management</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setOpenCreate(true)} 
            sx={{ bgcolor: "#072eb0" }}
          >
            Add Profile
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Mobile</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No Profiles Found</TableCell>
                </TableRow>
              ) : rows.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.mobileNo}</TableCell>
                  <TableCell align="center">
                    <Button size="small" color="primary">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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