'use client';

import React, { useEffect, useState, useCallback } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Search from "@/components/Search";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Box, IconButton, Chip
} from "@mui/material";


import CommonDialog from "@/components/CommonDialog/CommonDialog";
import DeleteAllStudent from "@/components/Student/AllStudents/Delete/Delete";
import EditAllStudent from "@/components/Student/AllStudents/Edit/Edit";
import ViewAllStudent from "@/components/Student/AllStudents/View/View";
import CreateAllStudent from "@/components/Student/AllStudents/Create/Create";
import Layout from "@/components/Layout";

import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllStudents = () => {
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);

  const [ViewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const columns = [
    { id: "si", label: "SI.No", align: "center" },
    { id: "studentName", label: "Student Name", align: "center" },
    { id: "gender", label: "Gender", align: "center" },
    { id: "mobileNumber", label: "Mobile", align: "center" },
    { id: "emailId", label: "Email", align: "center" },
    { id: "course", label: "Course", align: "center" },
    { id: "status", label: "Status", align: "center" },
    { id: "action", label: "Action", align: "center" },
  ];

 
  const fetchAllStudentsData = useCallback(async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/allstudents`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const res = await response.json();

      if (res.status === "success") {
        const formattedData = res.data.map((item, index) => ({
          ...item,
          si: index + 1,
          dob_formatted: new Date(item.dob).toLocaleDateString("en-IN"),
          enroll_formatted: new Date(item.enrollmentDate).toLocaleDateString("en-IN"),
        }));
        setRows(formattedData);
        setFilteredRows(formattedData);
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchAllStudentsData();
  }, [fetchAllStudentsData]);

 
  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.course?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

 
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (data) => { setEditData(data); setEditShow(true); };
  const handleShowDelete = (id) => { setDeleteId(id); setDeleteShow(true); };

  const handleClose = () => {
    setOpenData(false); setViewShow(false); setEditShow(false); setDeleteShow(false);
  };

  const handleDelete = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    setIsDeleting(true);
    try {
      const response = await fetch(`${Base_url}/allstudents/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Student deleted successfully!");
        fetchAllStudentsData();
        handleClose();
      }
    } catch (error) { toast.error("Delete failed"); }
    finally { setIsDeleting(false); }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(+e.target.value); setPage(0); };

  return (
    <Layout>
      <ToastContainer position="top-right" />
      <Box sx={{ p: 3 }}>
        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setOpenData(true)}
          buttonText="Add Student"
        />

        <Paper sx={{ width: "100%", overflow: "hidden", mt: 2, borderRadius: '12px', boxShadow: 3 }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} align="center">Loading...</TableCell></TableRow>
                ) : filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                  <TableRow hover key={row._id}>
                    <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell align="center">{row.studentName}</TableCell>
                    <TableCell align="center">{row.gender}</TableCell>
                    <TableCell align="center">{row.mobileNumber}</TableCell>
                    <TableCell align="center">{row.emailId}</TableCell>
                    <TableCell align="center">{row.course}</TableCell>
                    <TableCell align="center">
                      <Chip label={row.status} size="small" color={row.status === "Active" ? "success" : "default"} />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleView(row)}><VisibilityIcon /></IconButton>
                      <IconButton sx={{ color: "#ed6c02" }} onClick={() => handleEdit(row)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleShowDelete(row._id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openData ? "Create New Student" : viewShow ? "View Student Details" : editShow ? "Edit Student Details" : "Delete Student"
          }
          dialogContent={
            openData ? (
              <CreateAllStudent handleCreate={() => { fetchAllStudentsData(); handleClose(); }} handleClose={handleClose} />
            ) : viewShow ? (
              <ViewAllStudent viewData={ViewData} />
            ) : editShow ? (
              <EditAllStudent editData={editData} handleUpdate={() => { fetchAllStudentsData(); handleClose(); }} handleClose={handleClose} />
            ) : deleteShow ? (
              <DeleteAllStudent handleDelete={handleDelete} isDeleting={isDeleting} handleClose={handleClose} />
            ) : null
          }
        />
      </Box>
    </Layout>
  );
};

export default AllStudents;