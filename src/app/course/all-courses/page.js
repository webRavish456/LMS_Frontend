'use client';

import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, CircularProgress, IconButton, Tooltip
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

 
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  
  const fetchCourses = useCallback(async () => {
    if (!token) {
        setLoading(false); 
        return;
    }

   
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 

    try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/courselist`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal 
        });

        clearTimeout(timeoutId); 

        const json = await res.json();
        if (res.ok && json.status === "success") {
            const formatted = json.data.map((item, i) => ({
                ...item,
                si: i + 1,
                displayDescription: item.courseDescription?.substring(0, 30) || "N/A",
                displayPricing: `₹${item.pricing || 0}`,
                displayTeachers: Array.isArray(item.assignedTeachers) 
                    ? item.assignedTeachers.join(", ") 
                    : (item.assignedTeachers || "N/A"),
                displayDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
            }));
            setRows(formatted);
            setFilteredRows(formatted);
        }
    } catch (e) {
        console.error("Fetch Error:", e.name === "AbortError" ? "Request Timed Out" : e.message);
        setRows([]); 
        setFilteredRows([]);
    } finally {
        setLoading(false); 
    }
}, [token, BASE_URL]);

  
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = rows.filter(r =>
      r.courseName.toLowerCase().includes(lowerSearch) ||
      r.courseId.toLowerCase().includes(lowerSearch)
    );
    setFilteredRows(filtered);
    setPage(0);
  }, [searchTerm, rows]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`${BASE_URL}/courselist/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Course deleted successfully");
      setRefresh(prev => !prev);
      setOpenDelete(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box p={3}>
        <Search onSearch={setSearchTerm} onAddClick={() => setOpenCreate(true)} />

        <Paper sx={{ mt: 2, width: '100%', overflow: 'hidden' }} elevation={3}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="course table">
              <TableHead>
                <TableRow>
                  {columns.map(c => (
                    <TableCell key={c.id} sx={{ bgcolor: '#f5f5f5', fontWeight: 700 }}>
                      {c.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row._id} hover>
                        <TableCell>{row.si}</TableCell>
                        <TableCell>{row.courseId}</TableCell>
                        <TableCell>{row.courseName}</TableCell>
                        <TableCell>{row.displayDescription}</TableCell>
                        <TableCell>{row.duration}</TableCell>
                        <TableCell>{row.displayPricing}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                            {row.syllabus ? (
                              <Tooltip title="View Syllabus">
                                <IconButton onClick={() => window.open(row.syllabus)} size="small">
                                  <PictureAsPdfIcon color="error" fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                            {row.video ? (
                              <Tooltip title="Watch Video">
                                <IconButton onClick={() => window.open(row.video)} size="small">
                                  <VideoFileIcon color="primary" fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                            {!row.syllabus && !row.video && "N/A"}
                          </Box>
                        </TableCell>
                        <TableCell>{row.displayTeachers}</TableCell>
                        <TableCell>{row.displayDate}</TableCell>
                        <TableCell align="center">
                          {row.status === "Active" ? (
                            <CheckCircleIcon sx={{ color: "green" }} />
                          ) : (
                            <CancelIcon sx={{ color: "red" }} />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => { setViewData(row); setOpenView(true); }}>
                                <VisibilityIcon fontSize="small" color="action" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Course">
                              <IconButton size="small" onClick={() => { setEditData(row); setOpenEdit(true); }}>
                                <EditIcon fontSize="small" color="primary" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Course">
                              <IconButton size="small" onClick={() => { setDeleteId(row._id); setOpenDelete(true); }}>
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                            </Tooltip>
                          </Box>
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

        
        <CommonDialog 
          open={openCreate} 
          onClose={() => setOpenCreate(false)}
          dialogTitle="Create New Course"
          dialogContent={
            <CreateCourseList 
              handleCreate={() => setRefresh(prev => !prev)} 
              handleClose={() => setOpenCreate(false)} 
            />
          }
        />

        <CommonDialog 
          open={openView} 
          onClose={() => setOpenView(false)}
          dialogTitle="Course Details"
          dialogContent={viewData && <ViewCourseList viewData={viewData} handleClose={() => setOpenView(false)} />}
        />

      
        <CommonDialog 
          open={openEdit} 
          onClose={() => setOpenEdit(false)}
          dialogTitle="Edit Course"
          dialogContent={
            editData && (
              <EditCourseList 
                editData={editData} 
                handleUpdate={() => setRefresh(prev => !prev)} 
                handleClose={() => setOpenEdit(false)} 
              />
            )
          }
        />

        <CommonDialog 
          open={openDelete} 
          onClose={() => setOpenDelete(false)}
          dialogTitle="Are you sure?"
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