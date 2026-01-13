"use client";

import React, { useEffect, useState, useCallback } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, IconButton,
  Button, Menu, MenuItem, Typography, Stack, Tabs, Tab
} from "@mui/material";

import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import Create from "@/components/Leave/Leave-status/Create/Create"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const HolidayPage = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0); // 0: Weekly Holiday, 1: Holiday, 2: Leave Type

  const [openCreate, setOpenCreate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // --- Data Fetching ---
  const fetchHolidayData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Base_url}/leave-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.success) {
        setRows(res.data);
      }
    } catch (error) {
      // Dummy data for initial view matching the photo
      setRows([
        { _id: "1", id: "01", dayName: "Sunday", type: "Weekly" },
        { _id: "2", id: "02", dayName: "Saturday", type: "Weekly" },
      ]);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchHolidayData();
  }, [fetchHolidayData]);

  // --- Tabs & Search Filter ---
  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.dayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows, tabValue]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleMenuOpen = (event, row) => { setAnchorEl(event.currentTarget); setSelectedRow(row); };

  const columns = [
    { id: "id", label: "ID" },
    { id: "dayName", label: "DAY NAME" },
    { id: "actions", label: "ACTION", align: "right" },
  ];

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ p: 4, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
        
        {/* Title */}
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#2c3e50" }}>
          Holiday
        </Typography>

        {/* --- Photo Style Tabs --- */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '25px',
                minHeight: '40px',
                marginRight: '15px',
                bgcolor: '#fff',
                color: '#666',
                px: 3,
                border: '1px solid #f0f0f0'
              },
              '& .Mui-selected': {
                bgcolor: '#007bff !important',
                color: '#fff !important',
                boxShadow: '0 4px 10px rgba(0,123,255,0.3)'
              }
            }}
          >
            <Tab label="Weekly Holiday" />
            <Tab label="Holiday" />
            <Tab label="Leave Type" />
          </Tabs>
        </Box>

        {/* --- Main Table Card --- */}
        <Paper sx={{ borderRadius: "12px", border: "1px solid #ebebeb", boxShadow: "none", overflow: "hidden" }}>
          
          {/* Header Inside Card */}
          <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px" }}>
              {tabValue === 0 ? "Weekly Holiday" : tabValue === 1 ? "Holiday" : "Leave Type"}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Search Bar */}
              <Box sx={{ width: "280px" }}>
                {/* <Search onSearch={(term) => setSearchTerm(term)} /> */}
              </Box>
              {/* Add Day Button */}
              <Button 
                variant="contained" 
                startIcon={<span style={{fontSize: '20px'}}>+</span>}
                onClick={() => setOpenCreate(true)}
                sx={{ 
                  bgcolor: "#007bff", 
                  textTransform: "none", 
                  borderRadius: "6px",
                  px: 3,
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#0069d9' }
                }}
              >
                Add Day
              </Button>
            </Stack>
          </Box>

          {/* --- The Table --- */}
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f1f4f9" }}>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell 
                      key={col.id} 
                      align={col.align} 
                      sx={{ fontWeight: 800, fontSize: "12px", color: "#5f6368", py: 2 }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, index) => (
                  <TableRow hover key={row._id || index} sx={{ '& td': { borderBottom: '1px solid #f0f0f0' } }}>
                    <TableCell sx={{ color: "#888", fontWeight: 600 }}>{row.id || index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#333" }}>{row.dayName}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                        <MoreVertIcon sx={{ color: "#aaa" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Menu & Dialog */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>Edit</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>Delete</MenuItem>
        </Menu>

        <CommonDialog
  open={openCreate}
  onClose={() => setOpenCreate(false)}
  dialogTitle="Add Weekly Holiday" // Image ke mutabiq title
  dialogContent={
    <Create 
      onClose={() => setOpenCreate(false)} 
      onRefresh={fetchHolidayData} 
    />
  }
/>
      </Box>
    </Layout>
  );
};

export default HolidayPage;