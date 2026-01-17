"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, IconButton,
  Chip, Menu, MenuItem, Typography, Button, Stack, Divider
} from "@mui/material";

// Components
import Layout from "@/components/Layout"; 
import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import Create from "@/components/Leave/Leave-status/Create/Create"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveRequest = () => {
  // ✅ Initialized as an empty array to remove random/mock data
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All"); 

  const [openCreate, setOpenCreate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // --- 1. Fetch Data (Loads ONLY from Database) ---
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${Base_url}/leave-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      
      // ✅ Set rows only with the data returned from the backend
      if (res.success) {
        setRows(res.data || []); 
      } else {
        setRows([]); // Clear table if fetch is not successful
      }
    } catch (error) {
      toast.error("Failed to load data from server");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => { 
    fetchLeaves(); 
  }, [fetchLeaves]);

  // --- 2. Search & Filter Logic ---
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = 
        row.profile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === "Rejected") {
        return matchesSearch && row.activity === "Rejected";
      }
      return matchesSearch;
    });
  }, [searchTerm, rows, filterType]);

  const handleOpen = () => setOpenCreate(true);
  
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  // --- 3. CRUD Handlers ---
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Base_url}/leave-status/${selectedRow._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const res = await response.json();
        if (res.success) {
          toast.success("Deleted successfully!");
          fetchLeaves(); // Refresh list from DB
        }
      } catch (error) {
        toast.error("Delete failed");
      }
      handleMenuClose();
    }
  };

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

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ p: 3, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
        
        <Box sx={{ mb: 4 }}>
           <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#072eb0", textTransform: 'uppercase' }}>
             Leave Request
           </Typography>
           
           <Search 
             buttonText="Apply Leave" 
             onAddClick={handleOpen} 
             onSearch={(term) => setSearchTerm(term)}
           />
        </Box>

        {/* Filter Buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button 
            variant={filterType === "Department" ? "contained" : "outlined"} 
            onClick={() => setFilterType("Department")}
            sx={{ borderRadius: "20px", textTransform: "none", bgcolor: filterType === "Department" ? "" : "#fff" }}
          >
            Department
          </Button>
          <Button 
            variant={filterType === "Users" ? "contained" : "outlined"} 
            onClick={() => setFilterType("Users")}
            sx={{ borderRadius: "20px", textTransform: "none", bgcolor: filterType === "Users" ? "" : "#fff" }}
          >
            Users
          </Button>
          <Button 
            variant={filterType === "Rejected" ? "contained" : "outlined"} 
            onClick={() => setFilterType(filterType === "Rejected" ? "All" : "Rejected")}
            color="error"
            sx={{ borderRadius: "20px", textTransform: "none", bgcolor: filterType === "Rejected" ? "" : "#fff" }}
          >
            Rejected
          </Button>
        </Stack>

        {/* Table Container */}
        <Paper sx={{ width: "100%", borderRadius: "12px", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f4f9", color: "#555", fontSize: "12px" }}>PROFILE</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f4f9", color: "#555", fontSize: "12px" }}>DATE & TIME</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f4f9", color: "#555", fontSize: "12px" }}>LEAVE DURATION</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f4f9", color: "#555", fontSize: "12px" }}>LEAVE TYPE</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f1f4f9", color: "#555", fontSize: "12px" }}>ATTACHMENTS</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f1f4f9", color: "#555", fontSize: "12px" }}>STATUS</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f1f4f9", color: "#555", fontSize: "12px" }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center">Loading...</TableCell></TableRow>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row) => (
                    <TableRow hover key={row._id}>
                      <TableCell sx={{ fontWeight: 500 }}>{row.profile}</TableCell>
                      <TableCell>
                        {new Date(row.date).toLocaleDateString()} <br/> 
                        <Typography variant="caption" color="textSecondary">{row.time || ""}</Typography>
                      </TableCell>
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
                        <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No records found. Please add a new leave request.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleStatusUpdate("Approved")}>Approve</MenuItem>
          <MenuItem onClick={() => handleStatusUpdate("Rejected")}>Reject</MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete} sx={{ color: "error.main", fontWeight: 600 }}>Delete</MenuItem>
        </Menu>

        <CommonDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          dialogTitle="Apply Leave"
          maxWidth="md"
          fullWidth={true}
          dialogContent={<Create onClose={() => setOpenCreate(false)} onRefresh={fetchLeaves} />}
        />
      </Box>
    </Layout>
  );
};

export default LeaveRequest;