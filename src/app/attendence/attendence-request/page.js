"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AttendanceDetails() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit | view
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    employee: "",
    punchIn: "",
    punchOut: "",
    note: "",
  });

  /* ================= FETCH FROM DB ================= */
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/attendance-request`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRows(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    setFilteredRows(
      rows.filter((r) =>
        r.employee?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, rows]);

  /* ================= OPEN MODALS ================= */
  const openAdd = () => {
    setMode("add");
    setSelectedId(null);
    setForm({ employee: "", punchIn: "", punchOut: "", note: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setSelectedId(row._id);
    setForm(row);
    setOpen(true);
  };

  const openView = (row) => {
    setMode("view");
    setForm(row);
    setOpen(true);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/attendance-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Server error");
    }

    toast.success("Attendance saved successfully");
    setOpen(false);
    fetchAttendance();

  } catch (error) {
    console.error(error);
    toast.error("Server error");
  }
};


  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/attendance-request/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Attendance deleted");
        fetchAttendance();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ p: 3 }}>
        {/* SEARCH + ADD (same place) */}
        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
          <TextField
            size="small"
            placeholder="Search Employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton size="small">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
            Add Attendance
          </Button>
        </Box>

        {/* TABLE */}
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>SI</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Punch In</TableCell>
                  <TableCell>Punch Out</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length ? (
                  filteredRows.map((row, i) => (
                    <TableRow key={row._id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{row.employee}</TableCell>
                      <TableCell>{row.punchIn}</TableCell>
                      <TableCell>{row.punchOut}</TableCell>
                      <TableCell>{row.note}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => openView(row)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => openEdit(row)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* DIALOG */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>
            {mode === "view" ? "Attendance Details" : "Add Attendance"}
          </DialogTitle>

          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Employee"
              value={form.employee}
              onChange={(e) => setForm({ ...form, employee: e.target.value })}
              disabled={mode === "view"}
            />
            <TextField
              label="Punch In"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={form.punchIn}
              onChange={(e) => setForm({ ...form, punchIn: e.target.value })}
              disabled={mode === "view"}
            />
            <TextField
              label="Punch Out"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={form.punchOut}
              onChange={(e) => setForm({ ...form, punchOut: e.target.value })}
              disabled={mode === "view"}
            />
            <TextField
              label="Note"
              multiline
              rows={3}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              disabled={mode === "view"}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            {mode !== "view" && (
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
