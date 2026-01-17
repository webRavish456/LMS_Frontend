"use client";

import React, { useEffect, useState, useCallback } from "react";
import Layout from "@/components/Layout"; 
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Search from "@/components/Search";
import { toast, ToastContainer } from "react-toastify";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Box, IconButton, Typography, Stack } from "@mui/material";

import ViewVideoClass from "@/components/Video-Class/Recorded-Class/View/View";
import CreateVideoClass from "@/components/Video-Class/Recorded-Class/Create/Create";
import EditVideoClass from "@/components/Video-Class/Recorded-Class/Edit/Edit";
import DeleteVideoClass from "@/components/Video-Class/Recorded-Class/Delete/Delete";

const RecordedClass = () => {
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Base_url}/recorded-class`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.status === "success") {
        setRows(res.data || []);
        setFilteredRows(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  useEffect(() => {
    const filtered = rows.filter(row => 
      row.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleClose = () => { setOpenData(false); setViewShow(false); setEditShow(false); setDeleteShow(false); };

  return (
    <Layout>
      <ToastContainer position="top-right" />
      <Box sx={{ p: 3 }}>
        <Search onSearch={setSearchTerm} onAddClick={() => setOpenData(true)} buttonText="Add Recorded-Class" />

        <Paper sx={{ width: "100%", mt: 2, borderRadius: "12px", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["SI.No", "Student Name", "Enrollment No", "Subject Name", "Teacher Name", "Action"].map((col) => (
                    <TableCell key={col} align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, index) => (
                  <TableRow key={row._id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{row.studentName}</TableCell>
                    <TableCell align="center">{row.enrollmentNo}</TableCell>
                    <TableCell align="center">{row.subjectName}</TableCell>
                    <TableCell align="center">{row.teacherName}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton onClick={() => { setViewData(row); setViewShow(true); }} color="primary"><VisibilityIcon fontSize="small" /></IconButton>
                        <IconButton onClick={() => { setEditData(row); setEditShow(true); }} color="inherit"><EditIcon fontSize="small" /></IconButton>
                        <IconButton onClick={() => { setDeleteId(row._id); setDeleteShow(true); }} color="error"><DeleteIcon fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          maxWidth="md" // चौड़ाई बढ़ाई गई
          fullWidth
          PaperProps={{ sx: { minHeight: "60vh", borderRadius: "15px" } }} // लंबाई बढ़ाई गई
          dialogTitle={
            <Typography component="div" variant="h5" sx={{ fontWeight: 700 }}>
              {openData ? "Create Recorded Class" : viewShow ? "View Details" : "Manage Class"}
            </Typography>
          }
          dialogContent={
            openData ? <CreateVideoClass handleCreate={fetchClasses} handleClose={handleClose} /> : null
            // बाकी components (View, Edit, Delete) यहाँ जोड़ें
          }
        />
      </Box>
    </Layout>
  );
};

export default RecordedClass;