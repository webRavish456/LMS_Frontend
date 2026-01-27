"use client";

import React, { useEffect, useState, useCallback } from "react";
import Layout from "@/components/Layout";
import Search from "@/components/Search";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { ToastContainer, toast } from "react-toastify";

import CreateTeacher from "@/components/Teacher/Create/Create";
import EditTeacher from "@/components/Teacher/Edit/Edit";
import ViewTeacher from "@/components/Teacher/View/View";
import DeleteTeacher from "@/components/Teacher/Delete/Delete";

export default function TeacherPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalMode, setModalMode] = useState(null); // create | edit | view | delete
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  /* ================= FETCH TEACHERS ================= */
  const fetchTeachers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);

      const res = await fetch(`${BASE_URL}/teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      // ✅ SAFE RESPONSE HANDLING
      const list = Array.isArray(result?.data) ? result.data : [];

      setTeachers(list);
      setFilteredTeachers(list);
    } catch (error) {
      console.error(error);
      toast.error("Teacher data load nahi ho saka");
      setTeachers([]);
      setFilteredTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  /* ================= SEARCH ================= */
  const handleSearch = (term) => {
    if (!term) {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter((t) =>
        Object.values(t).some((val) =>
          String(val).toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredTeachers(filtered);
    }
    setPage(0);
  };

  /* ================= CLOSE MODAL ================= */
  const closeModal = () => {
    setModalMode(null);
    setSelectedTeacher(null);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box p={3}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Teacher Management
        </Typography>

        <Search
          buttonText="Add Teacher"
          onAddClick={() => setModalMode("create")}
          onSearch={handleSearch}
        />

        <Paper sx={{ mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell align="center">Sl.No</TableCell>
                  <TableCell>Teacher Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No teachers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row._id}>
                        <TableCell align="center">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{row.teacherName}</TableCell>
                        <TableCell>{row.courseName || "N/A"}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedTeacher(row);
                              setModalMode("view");
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              setSelectedTeacher(row);
                              setModalMode("edit");
                            }}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelectedTeacher(row);
                              setModalMode("delete");
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredTeachers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>

        {/* ================= MODALS ================= */}
        {modalMode === "create" && (
          <CreateTeacher
            handleClose={closeModal}
            handleCreate={fetchTeachers}
          />
        )}

        {modalMode === "view" && selectedTeacher && (
          <ViewTeacher
            teacher={selectedTeacher}
            onClose={closeModal}
          />
        )}

        {modalMode === "edit" && selectedTeacher && (
          <EditTeacher
            teacher={selectedTeacher}
            handleClose={closeModal}
            refreshData={fetchTeachers}
          />
        )}

        {modalMode === "delete" && selectedTeacher && (
          <DeleteTeacher
            data={selectedTeacher}
            onClose={closeModal}
            onConfirm={fetchTeachers}
          />
        )}
      </Box>
    </Layout>
  );
}
