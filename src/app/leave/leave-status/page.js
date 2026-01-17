"use client";

import React, { useState } from "react";
import { 
  Box, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton 
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import Layout from "@/components/Layout";
import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";

// ✅ Import path as per your directory
import Create from "@/components/Leave/Leave-status/Create/Create"; 

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveStatus = () => {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpen = () => setIsApplyOpen(true);
  const handleClose = () => setIsApplyOpen(false);

  // Sample Data for Table
  const [rows] = useState([
    { id: 1, name: "Arjun", date: "Jan 10, 2026 10:30 AM", duration: "2 Days", leaveType: "Sick", status: "Approved" },
    { id: 2, name: "Ravi", date: "Jan 12, 2026 09:00 AM", duration: "1 Day", leaveType: "Casual", status: "Pending" },
  ]);

  const columns = [
    { id: "name", label: "PROFILE" },
    { id: "date", label: "DATE & TIME" },
    { id: "duration", label: "LEAVE DURATION" },
    { id: "leaveType", label: "LEAVE TYPE" },
    { id: "attachments", label: "ATTACHMENTS" },
    { id: "status", label: "STATUS" },
    { id: "actions", label: "ACTIONS" },
  ];

  return (
    <Layout>
      <Box sx={{ p: 3, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
        <ToastContainer position="top-right" autoClose={3000} />

        {/* --- Header Section --- */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a2035" }}>
            Leave Status
          </Typography>
          <Search 
          buttonText="Apply Leave" 
          onAddClick={handleOpen} 
          onSearch={(term) => setSearchTerm(term)}
        />
        </Box>

        {/* --- Filter & Search Section --- */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" sx={{ borderRadius: "20px", textTransform: "none", color: "#888", borderColor: "#ddd", bgcolor: "white" }}>Department</Button>
            <Button variant="outlined" sx={{ borderRadius: "20px", textTransform: "none", color: "#888", borderColor: "#ddd", bgcolor: "white" }}>Users</Button>
          </Box>
          <Box sx={{ width: "300px" }}>
            {/* <Search onSearch={(term) => setSearchTerm(term)} /> */}
          </Box>
        </Box>
        

        {/* --- Date Filter Header (Image Style) --- */}
        <Paper sx={{ p: 2, mb: 0, borderRadius: "12px 12px 0 0", boxShadow: "none", border: "1px solid #eee", borderBottom: "none" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ color: "#007bff", fontWeight: 500 }}>January 2026</Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              {["Today", "This week", "Last week", "This month", "Last month", "This year"].map((item) => (
                <Typography key={item} sx={{ cursor: "pointer", fontSize: "13px", color: item === "This month" ? "#007bff" : "#666", fontWeight: item === "This month" ? 600 : 400 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* --- Table Section --- */}
        <TableContainer component={Paper} sx={{ borderRadius: "0 0 12px 12px", boxShadow: "none", border: "1px solid #eee" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f1f4f9" }}>
                {columns.map((col) => (
                  <TableCell key={col.id} sx={{ fontWeight: 700, color: "#555", fontSize: "12px" }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.leaveType}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <PictureAsPdfIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small" 
                      sx={{ bgcolor: row.status === "Approved" ? "#e8f5e9" : "#fff3e0", color: row.status === "Approved" ? "green" : "orange", borderRadius: "4px" }} 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ CommonDialog with Create Component */}
        <CommonDialog
          open={isApplyOpen}
          onClose={handleClose}
          dialogTitle="Apply For Leave"
          dialogContent={<Create onClose={handleClose} />}
        />
      </Box>
    </Layout>
  );
};

export default LeaveStatus;