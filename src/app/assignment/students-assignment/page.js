'use client';

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI Components
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, IconButton, Typography, Tooltip, Chip
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
  const { branch } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [modalMode, setModalMode] = useState(null); 
  const [selectedData, setSelectedData] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // --- 1. Fetch Data Logic ---
  const fetchAssignmentData = useCallback(async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Backend route /api/studentsAssignment ko call karega
      const response = await fetch(`${Base_url}/studentsAssignment`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const res = await response.json();
      if (res.status === "success") {
        setRows(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchAssignmentData();
  }, [fetchAssignmentData]);

  // --- 2. Search Filter Logic ---
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.assignmentTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, rows]);

  // --- 3. Delete Logic ---
  const handleConfirmDelete = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/studentsAssignment/${selectedData._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const res = await response.json();
      if (response.ok && res.status === "success") {
        toast.success("Assignment deleted successfully!");
        closeModals();
        fetchAssignmentData(); // List Refresh
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Network error while deleting");
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
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#072eb0", textTransform: 'uppercase' }}>
          Student Assignments List
        </Typography>
        
        {/* Search & Add Button */}
        <Search 
          buttonText="Add Assignment" 
          onAddClick={() => setModalMode('create')} 
          onSearch={(term) => setSearchTerm(term)}
        />

        <TableContainer component={Paper} sx={{ mt: 3, borderRadius: "12px", border: "1px solid #eee", overflow: 'hidden' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 700 }}>SI.No</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Assignment Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center">Loading assignments...</TableCell></TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No assignments found</TableCell></TableRow>
              ) : (
                filteredRows.map((row, index) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.studentName}</TableCell>
                    <TableCell>{row.assignmentTitle}</TableCell>
                    <TableCell>{row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-IN") : "N/A"}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        size="small" 
                        color={row.status === "Completed" ? "success" : "warning"} 
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton color="primary" onClick={() => { setSelectedData(row); setModalMode('view'); }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Assignment">
                        <IconButton sx={{ color: "#ed6c02" }} onClick={() => { setSelectedData(row); setModalMode('edit'); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Assignment">
                        <IconButton color="error" onClick={() => { setSelectedData(row); setModalMode('delete'); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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