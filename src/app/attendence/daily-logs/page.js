'use client'

import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Box, IconButton, TextField, Button,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Layout from "@/components/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendanceTable = () => {
  const [openData, setOpenData] = useState(false);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null); // Track which row to update

  const [formData, setFormData] = useState({
    profile: "", punchedIn: "", punchedOut: "", behavior: "",
    breakTime: "", totalHours: "", entry: "",
  });

  // Search logic
  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.profile?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Dialog for Add
  const handleOpenAdd = () => {
    setEditIndex(null);
    setFormData({ profile: "", punchedIn: "", punchedOut: "", behavior: "", breakTime: "", totalHours: "", entry: "" });
    setOpenData(true);
  };

  // Open Dialog for Edit
  const handleEditClick = (index, row) => {
    setEditIndex(index);
    setFormData(row);
    setOpenData(true);
  };

  const handleSaveSubmit = () => {
    if (!formData.profile) {
      toast.error("Profile name is required!");
      return;
    }

    if (editIndex !== null) {
      // --- Update Logic ---
      const updatedRows = [...rows];
      updatedRows[editIndex] = formData;
      setRows(updatedRows);
      toast.success("Attendance updated successfully!");
    } else {
      // --- Create Logic ---
      setRows([...rows, formData]);
      toast.success("Attendance added successfully!");
    }

    setOpenData(false);
  };

  const handleDelete = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    toast.info("Record deleted");
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap="20px" mb={3}>
          <TextField
            size="small" variant="outlined" placeholder="Search Profile..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ endAdornment: <IconButton size="small"><SearchIcon /></IconButton> }}
            sx={{ backgroundColor: "white", borderRadius: "6px", width: "250px" }}
          />

          <Button
            variant="contained" startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ backgroundColor: "#0d1b75", color: "white", fontWeight: "bold", textTransform: "none", px: 3, borderRadius: "6px" }}
          >
            Add Attendance
          </Button>
        </Box>

        <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: '12px' }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {["SI.No", "Profile", "Punched In", "Punched Out", "Behavior", "Break Time", "Total Hours", "Entry", "Actions"].map((label) => (
                    <TableCell key={label} align="center" style={{ fontWeight: 700, backgroundColor: "#f5f5f5" }}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                    <TableRow hover key={idx}>
                      <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell align="center">{row.profile}</TableCell>
                      <TableCell align="center">{row.punchedIn}</TableCell>
                      <TableCell align="center">{row.punchedOut}</TableCell>
                      <TableCell align="center">{row.behavior}</TableCell>
                      <TableCell align="center">{row.breakTime}</TableCell>
                      <TableCell align="center">{row.totalHours}</TableCell>
                      <TableCell align="center">{row.entry}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary"><VisibilityIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="success" onClick={() => handleEditClick(idx, row)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(idx)}><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={9} align="center" sx={{ py: 3 }}>No records found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25]} component="div"
            count={filteredRows.length} rowsPerPage={rowsPerPage} page={page}
            onPageChange={(_, n) => setPage(n)} onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          />
        </Paper>

        <Dialog open={openData} onClose={() => setOpenData(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {editIndex !== null ? "Update Attendance" : "Add New Attendance"}
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Profile" name="profile" value={formData.profile} onChange={handleChange} fullWidth size="small" />
            <TextField label="Punched In" name="punchedIn" value={formData.punchedIn} onChange={handleChange} fullWidth size="small" />
            <TextField label="Punched Out" name="punchedOut" value={formData.punchedOut} onChange={handleChange} fullWidth size="small" />
            <TextField label="Behavior" name="behavior" value={formData.behavior} onChange={handleChange} fullWidth size="small" />
            <TextField label="Break Time" name="breakTime" value={formData.breakTime} onChange={handleChange} fullWidth size="small" />
            <TextField label="Total Hours" name="totalHours" value={formData.totalHours} onChange={handleChange} fullWidth size="small" />
            <TextField label="Entry Type" name="entry" value={formData.entry} onChange={handleChange} fullWidth size="small" />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenData(false)} color="inherit">Cancel</Button>
            <Button variant="contained" onClick={handleSaveSubmit} sx={{ bgcolor: "#0d1b75" }}>
              {editIndex !== null ? "Update Changes" : "Save Attendance"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default AttendanceTable;