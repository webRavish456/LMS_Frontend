"use client";

import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "@/components/Layout";
import Search from "@/components/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";

import ViewCourseList from "@/components/Course/CourseList/View/View";
import CreateCourseList from "@/components/Course/CourseList/Create/Create";
import EditCourseList from "@/components/Course/CourseList/Edit/Edit";
import DeleteCourseList from "@/components/Course/CourseList/Delete/Delete";

const CourseList = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [token, setToken] = useState(null);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    "SI.No",
    "Course Name",
    "Description",
    "Duration",
    "Pricing",
    "Syllabus",
    "Status",
    "Action",
  ];

  /* ================= TOKEN ================= */
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  /* ================= FETCH COURSES ================= */
  const fetchCourses = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/courselist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (res.ok && json.status === "success") {
        setRows(json.data || []);
        setFilteredRows(json.data || []);
      }
    } catch {
      setRows([]);
      setFilteredRows([]);
    }
  }, [token, BASE_URL]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, refresh]);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const lower = searchTerm.toLowerCase();

    const filtered = rows.filter(
      (r) =>
        r.courseName?.toLowerCase().includes(lower) ||
        r.courseId?.toLowerCase().includes(lower)
    );

    setFilteredRows(filtered);
    setPage(0);
  }, [searchTerm, rows]);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const res = await fetch(`${BASE_URL}/courselist/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Course deleted successfully");
      setRefresh((p) => !p);
      setOpenDelete(false);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box p={3}>
        <Search onSearch={setSearchTerm} onAddClick={() => setOpenCreate(true)} />

        <Paper sx={{ mt: 2 }} elevation={3}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((c, i) => (
                    <TableCell key={i} sx={{ fontWeight: 700 }}>
                      {c}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.length ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row._id} hover>
                        <TableCell>
                          {page * rowsPerPage + index + 1}
                        </TableCell>

                        <TableCell>{row.courseName}</TableCell>

                        <TableCell>
                          {row.courseDescription?.substring(0, 30)}...
                        </TableCell>

                        <TableCell>{row.duration}</TableCell>

                        <TableCell>₹{row.pricing}</TableCell>

                        <TableCell align="center">
                          {row.syllabus && (
                            <IconButton onClick={() => window.open(row.syllabus)}>
                              <PictureAsPdfIcon color="error" fontSize="small" />
                            </IconButton>
                          )}
                          {row.video && (
                            <IconButton onClick={() => window.open(row.video)}>
                              <VideoFileIcon color="primary" fontSize="small" />
                            </IconButton>
                          )}
                          {!row.syllabus && !row.video && "N/A"}
                        </TableCell>

                        <TableCell align="center">
                          {row.status === "Active" ? (
                            <CheckCircleIcon sx={{ color: "green" }} />
                          ) : (
                            <CancelIcon sx={{ color: "red" }} />
                          )}
                        </TableCell>

                        <TableCell>
                          <IconButton
                            onClick={() => {
                              setViewData(row);
                              setOpenView(true);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              setEditData(row);
                              setOpenEdit(true);
                            }}
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              setDeleteId(row._id);
                              setOpenDelete(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                      No courses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </Paper>

        {/* ================= DIALOGS ================= */}

        <CommonDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          dialogTitle="Create Course"
          dialogContent={
            <CreateCourseList
              handleCreate={() => setRefresh((p) => !p)}
              handleClose={() => setOpenCreate(false)}
            />
          }
        />

        <CommonDialog
          open={openView}
          onClose={() => setOpenView(false)}
          dialogTitle="Course Details"
          dialogContent={
            viewData && (
              <ViewCourseList
                viewData={viewData}
                handleClose={() => setOpenView(false)}
              />
            )
          }
        />

        <CommonDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          dialogTitle="Edit Course"
          dialogContent={
            editData && (
              <EditCourseList
                editData={editData}
                handleUpdate={() => setRefresh((p) => !p)}
                handleClose={() => setOpenEdit(false)}
              />
            )
          }
        />

        <CommonDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          dialogTitle="Confirm Delete"
          dialogContent={
            <DeleteCourseList
              handleDelete={handleDelete}
              isDeleting={isDeleting}
              handleClose={() => setOpenDelete(false)}
            />
          }
        />
      </Box>
    </Layout>
  );
};

export default CourseList;
