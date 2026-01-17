'use client';

import React, { useEffect, useState, useCallback, useMemo } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, IconButton,
  Button, Menu, MenuItem, Typography, Stack, Tabs, Tab, Divider
} from "@mui/material";

import Layout from "@/components/Layout";
import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import Create from "@/components/Leave/Leave-status/Create/Create"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HolidayPage = () => {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0); 

  const [openCreate, setOpenCreate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // --- 1. Fetch Holiday Data ---
  const fetchHolidayData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // कंट्रोलर getAllHolidays को कॉल करेगा
      const response = await fetch(`${Base_url}/holiday`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.status === "success") {
        setRows(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load holidays");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => { fetchHolidayData(); }, [fetchHolidayData]);

  // --- 2. Filter Logic ---
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, rows]);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  // --- 3. Delete Logic ---
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Base_url}/holiday/${selectedRow._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const res = await response.json();
        if (res.status === "success") {
          toast.success("Holiday deleted successfully!");
          fetchHolidayData();
        }
      } catch (error) {
        toast.error("Delete failed");
      }
      handleMenuClose();
    }
  };

  const columns = [
    { id: "id", label: "SI.NO" },
    { id: "name", label: "HOLIDAY NAME" },
    { id: "date", label: "DATE" },
    { id: "actions", label: "ACTION", align: "right" },
  ];

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ p: 4, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
        
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#072eb0", textTransform: 'uppercase' }}>
          Holiday Management
        </Typography>

        {/* Tabs for Categories */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none', borderRadius: '25px', minHeight: '40px',
                marginRight: '15px', bgcolor: '#fff', color: '#666', px: 3, border: '1px solid #f0f0f0'
              },
              '& .Mui-selected': { bgcolor: '#007bff !important', color: '#fff !important' }
            }}
          >
            <Tab label="Weekly Holiday" />
            <Tab label="Public Holiday" />
          </Tabs>
        </Box>

        <Paper sx={{ borderRadius: "12px", border: "1px solid #ebebeb", boxShadow: "none" }}>
          <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px" }}>
              {tabValue === 0 ? "Weekly Holiday" : "Public Holiday"}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Search onSearch={(term) => setSearchTerm(term)} hideButton />
              <Button 
                variant="contained" 
                onClick={() => setOpenCreate(true)}
                sx={{ bgcolor: "#007bff", textTransform: "none", borderRadius: "6px", px: 3 }}
              >
                + Add Holiday
              </Button>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f1f4f9" }}>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align} sx={{ fontWeight: 700, color: "#555", fontSize: "12px" }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} align="center">Loading...</TableCell></TableRow>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, index) => (
                    <TableRow hover key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                      <TableCell>{new Date(row.date).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuOpen(e, row)}><MoreVertIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} align="center">No holidays found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Action Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main', fontWeight: 600 }}>Delete</MenuItem>
        </Menu>

        {/* Dialog Component */}
        <CommonDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          dialogTitle="Add New Holiday"
          dialogContent={<Create onClose={() => setOpenCreate(false)} onRefresh={fetchHolidayData} />}
        />
      </Box>
    </Layout>
  );
};

export default HolidayPage;