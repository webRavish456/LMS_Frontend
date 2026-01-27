"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography,
  Stack,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";

import Layout from "@/components/Layout";
import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import Create from "@/components/Leave/Leave-Holiday/Create/Create";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HolidayPage() {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const [openCreate, setOpenCreate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchHolidayData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${Base_url}/holiday`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.status === "success") {
        setRows(data.data || []);
      }
    } catch (err) {
      toast.error("Failed to load holidays");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchHolidayData();
  }, [fetchHolidayData]);

  /* ================= FILTER ================= */
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);

  /* ================= MENU ================= */
  const handleMenuOpen = (e, row) => {
    setAnchorEl(e.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!selectedRow) return;

    if (!confirm("Are you sure you want to delete this holiday?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${Base_url}/holiday/${selectedRow._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.status === "success") {
        toast.success("Holiday deleted successfully");
        fetchHolidayData();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
    handleMenuClose();
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ p: 4, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 3, color: "#072eb0" }}
        >
          HOLIDAY MANAGEMENT
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          sx={{ mb: 3 }}
        >
          <Tab label="Weekly Holiday" />
          <Tab label="Public Holiday" />
        </Tabs>

        <Paper sx={{ borderRadius: 2 }}>
          {/* Header */}
          <Box
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Holiday List
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Search onSearch={(t) => setSearchTerm(t)} hideButton />

              {/* ✅ PLUS ICON REMOVED */}
              <Button
                variant="contained"
                onClick={() => setOpenCreate(true)}
                sx={{ textTransform: "none", px: 3 }}
              >
                Add Holiday
              </Button>
            </Stack>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f1f4f9" }}>
                <TableRow>
                  <TableCell><b>SI.NO</b></TableCell>
                  <TableCell><b>HOLIDAY NAME</b></TableCell>
                  <TableCell><b>DATE</b></TableCell>
                  <TableCell align="right"><b>ACTION</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, i) => (
                    <TableRow key={row._id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        {new Date(row.date).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No holidays found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
            Delete
          </MenuItem>
        </Menu>

        {/* Dialog */}
        <CommonDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          dialogTitle="Add New Holiday"
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
}
