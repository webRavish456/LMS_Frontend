'use client';

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, IconButton, Typography, Tooltip, Chip
} from "@mui/material";

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

import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentsAssignmentPage() {
  const { branch } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States (Exact Branch Page Logic)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // 1. Fetch Data Logic (SSR Safe)
  const fetchAssignmentData = useCallback(async () => {
    // Client-side check for token
    const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    
    if (!token) {
      toast.error("Authentication token not found!");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/studentsAssignment?branch=${branch}`, {
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
  }, [Base_url, branch]);

  useEffect(() => {
    fetchAssignmentData();
  }, [fetchAssignmentData]);

  // 2. Search Filter Logic
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.assignmentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.course?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, rows]);

  // 3. Delete Handler
  const handleConfirmDelete = async () => {
    const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    try {
      const response = await fetch(`${Base_url}/studentsAssignment/${selectedData._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Assignment deleted!");
        setIsDeleteOpen(false);
        fetchAssignmentData();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#072eb0", textTransform: 'uppercase' }}>
          Assignment List ({branch || 'General'})
        </Typography>
        
        <Search 
          buttonText="Add Assignment" 
          onAddClick={() => setIsCreateOpen(true)} 
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
                <TableRow><TableCell colSpan={6} align="center">Loading Assignments...</TableCell></TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No records found</TableCell></TableRow>
              ) : (
                filteredRows.map((row, index) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>{row.assignmentTitle}</TableCell>
                    <TableCell>{row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-IN") : "N/A"}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        size="small" 
                        color={row.status === "Completed" ? "success" : "warning"} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton color="primary" onClick={() => { setSelectedData(row); setIsViewOpen(true); }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton sx={{ color: "#ed6c02" }} onClick={() => { setSelectedData(row); setIsEditOpen(true); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => { setSelectedData(row); setIsDeleteOpen(true); }}>
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

        {/* --- Dialog Modals --- */}
        <CommonDialog
          open={isCreateOpen || isViewOpen || isEditOpen || isDeleteOpen}
          onClose={() => { setIsCreateOpen(false); setIsViewOpen(false); setIsEditOpen(false); setIsDeleteOpen(false); }}
          dialogTitle={isCreateOpen ? "Create Assignment" : isViewOpen ? "View Assignment" : isEditOpen ? "Edit Assignment" : "Delete Assignment"}
          dialogContent={
            <Box sx={{ pt: 1 }}>
               {isCreateOpen && <Create onClose={() => setIsCreateOpen(false)} onCreate={fetchAssignmentData} />}
               {isViewOpen && <View data={selectedData} onClose={() => setIsViewOpen(false)} />}
               {isEditOpen && <Edit data={selectedData} onClose={() => setIsEditOpen(false)} onUpdate={fetchAssignmentData} />}
               {isDeleteOpen && <Delete data={selectedData} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} />}
            </Box>
          }
        />
      </Box>
    </Layout>
  );
}