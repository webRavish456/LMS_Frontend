'use client';

import React, { useEffect, useState, useCallback } from "react";
import Layout from "@/components/Layout";
import Search from "@/components/Search"; 
import CommonDialog from "@/components/CommonDialog/CommonDialog";

import CreateStudent from "@/components/Student/Studentlist/Create/Create";
import ViewStudent from "@/components/Student/Studentlist/View/View";
import EditStudent from "@/components/Student/Studentlist/Edit/Edit";
import DeleteStudent from "@/components/Student/Studentlist/Delete/Delete";

import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Box, IconButton, Chip
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentList = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const columns = [
    { id: "si", label: "SI.No", align: "center" },
    { id: "studentName", label: "Student Name", align: "center" },
    { id: "emailId", label: "Email", align: "center" },
    { id: "course", label: "Course", align: "center" },
    { id: "status", label: "Status", align: "center" },
    { id: "action", label: "Actions", align: "center" },
  ];

  /* ================= FETCH STUDENTS (Logic Updated) ================= */
  const fetchStudents = useCallback(async () => {
    // Check token in both locations
    const token = Cookies.get("token") || localStorage.getItem("token");

    if (!token) {
      toast.error("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/allstudents`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`, // ✅ Crucial for 401 Fix
          "Content-Type": "application/json" 
        },
      });

      const res = await response.json();

      if (response.status === 401) {
        toast.error("Unauthorized access. Redirecting to login...");
        return;
      }

      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item, index) => ({
          ...item,
          si: index + 1,
          // Extract plain values for rendering in table cells
          statusChip: <Chip label={item.status} size="small" color={item.status === "Ongoing" ? "primary" : "success"} />
        }));
        setRows(formatted);
        setFilteredRows(formatted);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /* ================= SEARCH LOGIC ================= */
  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.course?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleClose = () => {
    setOpenCreate(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
  };

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ p: 3 }}>
        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setOpenCreate(true)}
          buttonText="Add Student"
        />

        <Paper sx={{ mt: 2, borderRadius: "12px", overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell key={col.id} align={col.align} sx={{ fontWeight: 700, bgcolor: '#f5f5f5' }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center">Loading Data...</TableCell></TableRow>
                ) : filteredRows.length ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow hover key={row._id || i}>
                        <TableCell align="center">{page * rowsPerPage + i + 1}</TableCell>
                        <TableCell align="center">{row.studentName}</TableCell>
                        <TableCell align="center">{row.emailId}</TableCell>
                        <TableCell align="center">{row.course}</TableCell>
                        <TableCell align="center">{row.statusChip}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <IconButton onClick={() => { setViewData(row); setViewShow(true); }}>
                              <VisibilityIcon color="primary" fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => { setEditData(row); setEditShow(true); }}>
                              <EditIcon sx={{ color: "#ed6c02" }} fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => { setDeleteData(row); setDeleteShow(true); }} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">No students found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </Paper>

        <CommonDialog
          open={openCreate || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openCreate ? "Create Student"
              : viewShow ? "View Student Details"
              : editShow ? "Edit Student Details"
              : "Confirm Delete"
          }
          dialogContent={
            <Box sx={{ mt: 1 }}>
              {openCreate && <CreateStudent onClose={handleClose} handleCreate={fetchStudents} />}
              {viewShow && <ViewStudent viewData={viewData} />}
              {editShow && <EditStudent editData={editData} onClose={handleClose} handleUpdate={fetchStudents} />}
              {deleteShow && <DeleteStudent deleteData={deleteData} onClose={handleClose} handleDelete={fetchStudents} />}
            </Box>
          }
        />
      </Box>
    </Layout>
  );
};

export default StudentList;