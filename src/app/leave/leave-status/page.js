"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Layout from "@/components/Layout";
import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import Create from "@/components/Leave/Leave-status/Create/Create";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveStatusPage = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit | view
  const [selected, setSelected] = useState(null);

  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  /* ================= FETCH ================= */
  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/leave-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (result.success) setLeaveData(result.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  /* ================= VIEW ================= */
  const handleView = (item) => {
    setSelected(item);
    setMode("view");
    setOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setSelected(item);
    setMode("edit");
    setOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/leave-status/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Deleted successfully");
        fetchLeaveData();
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Server error");
    }
  };

  /* ================= SEARCH ================= */
  const filteredData = leaveData.filter((i) =>
    i.profile?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box sx={{ p: 3, bgcolor: "#f5f7fb", minHeight: "100vh" }}>
        <ToastContainer position="top-right" autoClose={3000} />

        {/* HEADER */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Leave Status
          </Typography>

          <Search
            buttonText="Apply Leave"
            onAddClick={() => {
              setSelected(null);
              setMode("create");
              setOpen(true);
            }}
            onSearch={(v) => setSearchTerm(v)}
          />
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, idx) => (
                  <TableRow key={item._id} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{item.profile}</TableCell>
                    <TableCell>
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.leaveDuration}</TableCell>
                    <TableCell>{item.leaveType}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={item.activity}
                        sx={{
                          bgcolor:
                            item.activity === "Approved"
                              ? "#e8f5e9"
                              : item.activity === "Rejected"
                              ? "#ffebee"
                              : "#fff3e0",
                          color:
                            item.activity === "Approved"
                              ? "green"
                              : item.activity === "Rejected"
                              ? "red"
                              : "orange",
                        }}
                      />
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell align="center">
                      {/* VIEW */}
                      <IconButton
                        color="primary"
                        onClick={() => handleView(item)}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      {/* EDIT */}
                      <IconButton
                        color="warning"
                        onClick={() => handleEdit(item)}
                      >
                        <EditIcon />
                      </IconButton>

                      {/* DELETE */}
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* DIALOG: CREATE / EDIT / VIEW */}
        <CommonDialog
          open={open}
          onClose={() => setOpen(false)}
          dialogTitle={
            mode === "create"
              ? "Apply Leave"
              : mode === "edit"
              ? "Edit Leave"
              : "View Leave"
          }
          dialogContent={
            <Create
              mode={mode}           // create | edit | view
              initialData={selected} // prefill for edit/view
              onClose={() => setOpen(false)}
              onRefresh={fetchLeaveData}
            />
          }
        />
      </Box>
    </Layout>
  );
};

export default LeaveStatusPage;
