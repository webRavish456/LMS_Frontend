"use client";

import React, { useEffect, useState, useCallback } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, IconButton,
  Chip, Menu, MenuItem, Typography, Button, Stack
} from "@mui/material";

import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import Create from "@/components/Leave/Leave-status/Create/Create"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const LeaveRequest = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [openCreate, setOpenCreate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // --- 1. Fetch Data ---
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${Base_url}/leave-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.success) {
        setRows(res.data);
        setFilteredRows(res.data);
      }
    } catch (error) {
      toast.error("Failed to load data from server");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // --- 2. Search Logic ---
  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.profile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Base_url}/leave-status/${selectedRow._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ activity: newStatus })
      });
      const res = await response.json();
      if (res.success) {
        toast.success(`Leave ${newStatus} successfully`);
        fetchLeaves();
      }
    } catch (error) {
      toast.error("Update failed");
    }
    handleMenuClose();
  };

  const columns = [
    { id: "profile", label: "PROFILE" },
    { id: "date", label: "DATE & TIME" },
    { id: "leaveDuration", label: "LEAVE DURATION" },
    { id: "leaveType", label: "LEAVE TYPE" },
    { id: "attachments", label: "ATTACHMENTS", align: "center" },
    { id: "status", label: "STATUS", align: "center" },
    { id: "activity", label: "ACTIVITY", align: "center" },
    { id: "actions", label: "ACTIONS", align: "center" },
  ];

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ p: 3, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
        
        {/* --- Header Section --- */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a2035" }}>Leave Status</Typography>
          <Button 
            variant="contained" 
            onClick={() => setOpenCreate(true)}
            sx={{ bgcolor: "#007bff", textTransform: "none", borderRadius: "8px", px: 3 }}
          >
            Apply Leave
          </Button>
        </Box>

        {/* --- Filters & Search --- */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" sx={{ borderRadius: "20px", textTransform: "none", color: "#666", borderColor: "#ddd", bgcolor: "#fff" }}>Department</Button>
            <Button variant="outlined" sx={{ borderRadius: "20px", textTransform: "none", color: "#666", borderColor: "#ddd", bgcolor: "#fff" }}>Users</Button>
            <Button variant="outlined" sx={{ borderRadius: "20px", textTransform: "none", color: "error.main", borderColor: "error.main", bgcolor: "#fff" }}>Rejected</Button>
          </Stack>
          <Box sx={{ width: "300px" }}>
            {/* <Search onSearch={(term) => setSearchTerm(term)} /> */}
          </Box>
        </Box>

        {/* --- Table Container --- */}
        <Paper sx={{ width: "100%", borderRadius: "12px", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align} sx={{ fontWeight: 700, bgcolor: "#f1f4f9", color: "#555", fontSize: "12px" }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} align="center">Loading...</TableCell></TableRow>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row) => (
                    <TableRow hover key={row._id}>
                      <TableCell sx={{ fontWeight: 500 }}>{row.profile}</TableCell>
                      <TableCell>{new Date(row.date).toLocaleDateString()} {new Date(row.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</TableCell>
                      <TableCell>{row.leaveDuration}</TableCell>
                      <TableCell>{row.leaveType}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <PictureAsPdfIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.activity}
                          size="small"
                          sx={{ 
                            bgcolor: row.activity === "Approved" ? "#e8f5e9" : row.activity === "Rejected" ? "#ffebee" : "#fff3e0",
                            color: row.activity === "Approved" ? "#2e7d32" : row.activity === "Rejected" ? "#d32f2f" : "#ed6c02",
                            fontWeight: 600, borderRadius: "6px"
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                         <Typography variant="body2" color="textSecondary">{row.activity === "Approved" ? "Done" : "Pending"}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={8} align="center">No results found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Menu & Dialog */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleStatusUpdate("Approved")}>Approve</MenuItem>
          <MenuItem onClick={() => handleStatusUpdate("Rejected")}>Reject</MenuItem>
        </Menu>

        <CommonDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          dialogTitle="Apply Leave Request"
          dialogContent={<Create onClose={() => setOpenCreate(false)} onRefresh={fetchLeaves} />}
        />
      </Box>
    </Layout>
  );
};

export default LeaveRequest;