'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI Components
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, IconButton, Typography, Tooltip, Chip, TablePagination
} from "@mui/material";

// MUI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Layout & UI Components
import Layout from "@/components/Layout"; 
import Search from "@/components/Search/Search"; 
import CommonDialog from "@/components/CommonDialog/CommonDialog";

// Students Assignment Components
import Create from "@/components/Assignment/StudentsAssignment/Create/Create";
import View from "@/components/Assignment/StudentsAssignment/View/View";
import Edit from "@/components/Assignment/StudentsAssignment/Edit/Edit"; 
import Delete from "@/components/Assignment/StudentsAssignment/Delete/Delete";

export default function StudentsAssignmentPage() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal States
  const [modalMode, setModalMode] = useState(null); 
  const [selectedData, setSelectedData] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  /* ================= FETCH DATA (Token & Refresh Fix) ================= */
  const fetchAssignmentData = useCallback(async () => {
    // Refresh par data na jaye isliye localStorage se token check
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/studentsAssignment`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const res = await response.json();
      
      // Agar backend success bhej raha hai toh rows update karein
      if (res.status === "success" || Array.isArray(res.data)) {
        const data = res.data || [];
        setRows(data);
        setFilteredRows(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Database se assignments load nahi ho saki");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchAssignmentData();
  }, [fetchAssignmentData]);

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.assignmentTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
    setPage(0);
  }, [searchTerm, rows]);

  /* ================= DELETE ACTION ================= */
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/studentsAssignment/${selectedData._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const res = await response.json();
      if (res.status === "success") {
        toast.success("Assignment deleted successfully!");
        closeModals();
        fetchAssignmentData(); // Table refresh
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Server connection failed during delete");
    }
  };

  const closeModals = () => {
    setModalMode(null);
    setSelectedData(null);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#072eb0" }}>
          STUDENT ASSIGNMENTS MANAGEMENT
        </Typography>
        
        {/* Search & Add Button */}
        <Search 
          buttonText="Add Assignment" 
          onAddClick={() => setModalMode('create')} 
          onSearch={(term) => setSearchTerm(term)}
        />

        <TableContainer component={Paper} sx={{ mt: 3, borderRadius: "12px", boxShadow: 3 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ "& th": { backgroundColor: "#f5f5f5", fontWeight: 700 } }}>
                <TableCell align="center">SI.No</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Assignment Title</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center">Loading data from database...</TableCell></TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No assignments found</TableCell></TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                  <TableRow key={row._id || index} hover>
                    <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.studentName || "N/A"}</TableCell>
                    <TableCell>{row.assignmentTitle || "N/A"}</TableCell>
                    <TableCell>{row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-IN") : "N/A"}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status || "Pending"} 
                        size="small" 
                        color={row.status === "Completed" ? "success" : "primary"} 
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <IconButton color="primary" onClick={() => { setSelectedData(row); setModalMode('view'); }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton sx={{ color: "#ed6c02" }} onClick={() => { setSelectedData(row); setModalMode('edit'); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={() => { setSelectedData(row); setModalMode('delete'); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>

        {/* --- Dialog Management --- */}
        <CommonDialog
          open={!!modalMode}
          onClose={closeModals}
          dialogTitle={
            modalMode === 'create' ? "Add New Assignment" : 
            modalMode === 'view' ? "Assignment Details" : 
            modalMode === 'edit' ? "Modify Assignment" : "Confirm Deletion"
          }
          dialogContent={
            <Box sx={{ pt: 1 }}>
               {modalMode === 'create' && <Create handleClose={closeModals} handleCreate={fetchAssignmentData} />}
               {modalMode === 'view' && <View data={selectedData} handleClose={closeModals} />}
               {modalMode === 'edit' && <Edit data={selectedData} handleClose={closeModals} handleUpdate={fetchAssignmentData} />}
               {modalMode === 'delete' && <Delete data={selectedData} handleClose={closeModals} onConfirm={handleConfirmDelete} />}
            </Box>
          }
        />
      </Box>
    </Layout>
  );
}