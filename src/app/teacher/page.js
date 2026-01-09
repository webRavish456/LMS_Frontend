'use client'

import React, { useEffect, useState, useCallback } from "react";
import Search from "@/components/Search"; 
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Box, IconButton, 
  Typography, Tooltip
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

// मॉडल्स इम्पोर्ट
import CreateTeacher from "@/components/Teacher/Create/Create"; 
import Edit from "@/components/Teacher/Edit/Edit";
import View from "@/components/Teacher/View/View";
import Delete from "@/components/Teacher/Delete/Delete";

export default function TeacherPage() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // मॉडल्स कंट्रोल के लिए States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // 1. डेटा फेच फंक्शन
  const fetchFacultyData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/teacher`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const res = await response.json();
      if (res.status === "success") {
        setRows(res.data);
        setFilteredRows(res.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchFacultyData();
  }, [fetchFacultyData]);

  // 2. ✅ Final Save Teacher Function (Payload Correction के साथ)
  const handleCreateTeacher = async (formData) => {
    const token = localStorage.getItem("token");
    
    // बैकएंड की डिमांड के हिसाब से पेलोड तैयार करना
    const payload = {
      ...formData,
      mobileNumber: formData.mobileNo, // मोबाइल की की (Key) सही की गई
      dob: formData.dob || "1990-01-01", // डिफ़ॉल्ट DOB अगर फॉर्म में नहीं है
      address: formData.address || "Not Provided",
      companyDetails: {
        branchName: "Main",
        courseName: formData.courseName || "General",
        salary: "0",
        joiningDate: new Date().toISOString()
      },
      bankDetails: {
        accountHolderName: formData.teacherName,
        accountNumber: "NA",
        bankName: "NA",
        ifscCode: "NA",
        branch: "NA",
        branchLocation: "NA"
      }
    };

    try {
      const response = await fetch(`${Base_url}/teacher`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      if (res.status === "success") {
        toast.success("Teacher saved successfully!");
        setIsCreateOpen(false);
        fetchFacultyData();
      } else {
        toast.error(res.message || "Failed to save");
      }
    } catch (error) {
      toast.error("Network connection error!");
    }
  };

  // 3. अपडेट और डिलीट के फंक्शन्स (पहले की तरह)
  // ...

  const handleSearch = (term) => {
    const filtered = rows.filter((row) =>
      Object.values(row).some(val => String(val).toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredRows(filtered);
    setPage(0);
  };

  return (
    <Layout>
      <ToastContainer />
      <Box sx={{ width: "100%", p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Teacher Management</Typography>
        <Box sx={{ mb: 3 }}>
          <Search buttonText="Add Teacher" onAddClick={() => setIsCreateOpen(true)} onSearch={handleSearch} />
        </Box>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">Sl.No</TableCell>
                <TableCell>Teacher Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center">Loading...</TableCell></TableRow>
              ) : (
                filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={row._id} hover>
                    <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{row.teacherName}</TableCell>
                    <TableCell>{row.courseName || row.companyDetails?.courseName}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => { setSelectedTeacher(row); setIsViewOpen(true); }}><VisibilityIcon /></IconButton>
                      <IconButton color="action" onClick={() => { setSelectedTeacher(row); setIsEditOpen(true); }}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => { setSelectedTeacher(row); setIsDeleteOpen(true); }}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {isCreateOpen && <CreateTeacher handleClose={() => setIsCreateOpen(false)} handleCreate={handleCreateTeacher} />}
        {isViewOpen && <View open={isViewOpen} onClose={() => setIsViewOpen(false)} teacher={selectedTeacher} />}
        {/* ... बाकी मॉडल्स */}
      </Box>
    </Layout>
  );
}