'use client';

import React, { useEffect, useState, useCallback } from "react";
import Layout from "@/components/Layout";
import Search from "@/components/Search"; 
import CommonDialog from "@/components/CommonDialog/CommonDialog";

import ViewAllAssignment from "@/components/Assignment/AllAssignment/View/View";
import CreateAllAssignment from "@/components/Assignment/AllAssignment/Create/Create";
import EditAllAssignment from "@/components/Assignment/AllAssignment/Edit/Edit";
import DeleteAllAssignment from "@/components/Assignment/AllAssignment/Delete/Delete";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  IconButton,
  Chip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllAssignment = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  /* ================= FETCH ASSIGNMENTS (Database Sync) ================= */
  const fetchAssignments = useCallback(async () => {
    const token = localStorage.getItem("token"); // Token hamesha fresh lein refresh issue fix karne ke liye
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/allAssignment`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await response.json();

      if (res.status === "success" && Array.isArray(res.data)) {
        setRows(res.data);
        setFilteredRows(res.data);
      }
    } catch (error) {
      toast.error("Failed to load assignments from database");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  /* ================= SEARCH LOGIC ================= */
  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.assignmentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.teacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
    setPage(0);
  }, [searchTerm, rows]);

  /* ================= DELETE ACTION ================= */
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    setIsDeleting(true);
    try {
      const res = await fetch(`${Base_url}/allAssignment/${selectedData?._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json());

      if (res.status === "success") {
        toast.success("Assignment deleted successfully");
        fetchAssignments(); // Refresh table data
        handleClose();
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch {
      toast.error("Delete request failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setOpenCreate(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setSelectedData(null);
  };

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Assignment Management</Typography>
        
        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setOpenCreate(true)}
          buttonText="Add Assignment"
        />

        <Paper sx={{ mt: 2, borderRadius: "12px", overflow: "hidden", boxShadow: 3 }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ "& th": { backgroundColor: "#f5f5f5", fontWeight: 700 } }}>
                  <TableCell align="center">SI.No</TableCell>
                  <TableCell align="center">Assignment Title</TableCell>
                  <TableCell align="center">Course</TableCell>
                  <TableCell align="center">Teacher</TableCell>
                  <TableCell align="center">Due Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Loading data from database...</TableCell>
                  </TableRow>
                ) : filteredRows.length > 0 ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover key={row._id || index}>
                        <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>
                        <TableCell align="center">{row.assignmentTitle || "N/A"}</TableCell>
                        <TableCell align="center">{row.course || "N/A"}</TableCell>
                        <TableCell align="center">{row.teacher || "N/A"}</TableCell>
                        <TableCell align="center">
                          {row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-IN") : "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={row.status || "Pending"} 
                            size="small" 
                            color={row.status === "Completed" ? "success" : "primary"} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            {/* VIEW ICON */}
                            <IconButton onClick={() => { setSelectedData(row); setViewShow(true); }}>
                              <VisibilityIcon color="primary" />
                            </IconButton>
                            {/* EDIT ICON */}
                            <IconButton onClick={() => { setSelectedData(row); setEditShow(true); }}>
                              <EditIcon sx={{ color: "#ed6c02" }} />
                            </IconButton>
                            {/* DELETE ICON */}
                            <IconButton onClick={() => { setSelectedData(row); setDeleteShow(true); }} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No assignments found</TableCell>
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

        {/* ================= COMMON DIALOG ================= */}
        <CommonDialog
          open={openCreate || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openCreate ? "Create Assignment"
              : viewShow ? "View Assignment"
              : editShow ? "Edit Assignment"
              : "Delete Assignment"
          }
          dialogContent={
            openCreate ? (
              <CreateAllAssignment handleClose={handleClose} handleCreate={fetchAssignments} />
            ) : viewShow ? (
              <ViewAllAssignment viewData={selectedData} />
            ) : editShow ? (
              <EditAllAssignment
                editData={selectedData}
                handleClose={handleClose}
                handleUpdate={fetchAssignments}
              />
            ) : (
              <DeleteAllAssignment
                handleDelete={handleDelete}
                isDeleting={isDeleting}
                handleClose={handleClose}
              />
            )
          }
        />
      </Box>
    </Layout>
  );
};

export default AllAssignment;