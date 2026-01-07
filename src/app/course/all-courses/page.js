'use client';

import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, CircularProgress, IconButton
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

  // ================= STATE =================
  const [token, setToken] = useState(null);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // ================= COLUMNS =================
  const columns = [
    { id: "si", label: "SI.No" },
    { id: "courseId", label: "Course ID" },
    { id: "courseName", label: "Course Name" },
    { id: "courseDescription", label: "Description" },
    { id: "duration", label: "Duration" },
    { id: "pricing", label: "Pricing" },
    { id: "materials", label: "Materials" },
    { id: "teachers", label: "Teachers" },
    { id: "createdAt", label: "Created At" },
    { id: "status", label: "Status" },
    { id: "action", label: "Action" },
  ];

  // ================= TOKEN =================
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  // ================= FETCH =================
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/courselist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      const formatted = json.data.map((item, i) => ({
        si: i + 1,
        courseId: item.courseId ?? "N/A",
        courseName: item.courseName ?? "N/A",
        courseDescription:
          item.courseDescription?.length > 30
            ? item.courseDescription.slice(0, 30) + "..."
            : item.courseDescription ?? "N/A",
        duration: item.duration ?? "N/A",
        pricing: item.pricing ? `₹${item.pricing}` : "₹0",
        materials: (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {item.syllabus && (
              <IconButton onClick={() => window.open(item.syllabus)}>
                <PictureAsPdfIcon color="error" />
              </IconButton>
            )}
            {item.video && (
              <IconButton onClick={() => window.open(item.video)}>
                <VideoFileIcon color="primary" />
              </IconButton>
            )}
            {!item.syllabus && !item.video && "N/A"}
          </Box>
        ),
        teachers: item.assignedTeachers?.join(", ") ?? "Not Assigned",
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-IN")
          : "N/A",
        status:
          item.status === "active" ? (
            <CheckCircleIcon sx={{ color: "green" }} />
          ) : (
            <CancelIcon sx={{ color: "red" }} />
          ),
        action: (
          <>
            <IconButton onClick={() => { setViewData(item); setOpenView(true); }}>
              <VisibilityIcon />
            </IconButton>
            <IconButton onClick={() => { setEditData(item); setOpenEdit(true); }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => { setDeleteId(item._id); setOpenDelete(true); }}>
              <DeleteIcon />
            </IconButton>
          </>
        ),
      }));

      setRows(formatted);
      setFilteredRows(formatted);
    } catch (e) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCourses();
  }, [token, refresh]);

  useEffect(() => {
    const f = rows.filter(
      r =>
        r.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.courseId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(f);
    setPage(0);
  }, [searchTerm, rows]);

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await fetch(`${BASE_URL}/courselist/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted");
      setRefresh(!refresh);
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
      setOpenDelete(false);
    }
  };

  // ================= UI =================
  return (
    <Layout>
      <ToastContainer />
      <Box p={3}>
        <Search onSearch={setSearchTerm} onAddClick={() => setOpenCreate(true)} />

        <Paper sx={{ mt: 2 }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map(c => (
                    <TableCell key={c.id} sx={{ fontWeight: 700 }}>
                      {c.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow key={i}>
                        {columns.map(c => (
                          <TableCell key={c.id}>{row[c.id]}</TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      No courses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
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

        {/* Dialogs */}
        <CommonDialog open={openCreate} onClose={() => setOpenCreate(false)}
          dialogTitle="Create Course"
          dialogContent={<CreateCourseList handleCreate={() => setRefresh(!refresh)} />}
        />

        <CommonDialog open={openView} onClose={() => setOpenView(false)}
          dialogTitle="View Course"
          dialogContent={viewData && <ViewCourseList viewData={viewData} />}
        />

        <CommonDialog open={openEdit} onClose={() => setOpenEdit(false)}
          dialogTitle="Edit Course"
          dialogContent={editData && <EditCourseList editData={editData} handleUpdate={() => setRefresh(!refresh)} />}
        />

        <CommonDialog open={openDelete} onClose={() => setOpenDelete(false)}
          dialogTitle="Delete Course"
          dialogContent={<DeleteCourseList handleDelete={handleDelete} isDeleting={isDeleting} />}
        />
      </Box>
    </Layout>
  );
};

export default CourseList;
