"use client";

import Layout from "@/components/Layout";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Search from "@/components/Search/Search";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDialog from "@/components/CommonDialog/CommonDialog";

import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Box, IconButton, Typography, 
  Stack 
} from "@mui/material";
import ViewVideoClass from "@/components/Video-Class/Live-Class/View/View";
import CreateVideoClass from "@/components/Video-Class/Live-Class/Create/Create";
import EditVideoClass from "@/components/Video-Class/Live-Class/Edit/Edit";
import DeleteVideoClass from "@/components/Video-Class/Live-Class/Delete/Delete";

const LiveClass = () => {
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // --- Fetch Logic with LocalStorage Token ---
  const fetchLiveClassData = useCallback(async () => {
    const token = localStorage.getItem("token"); // ✅ Get token from LocalStorage

    if (!token) {
      toast.error("Invalid Token: Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${Base_url}/live-class`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      const res = await response.json();

      if (response.status === 401) {
        toast.error("Invalid Token or Session Expired");
        return;
      }

      if (res.success || res.status === "success") {
        setRows(res.data || []);
        setFilteredRows(res.data || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchLiveClassData();
  }, [fetchLiveClassData]);

  // --- Search Filter ---
  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleClose = () => {
    setOpenData(false); setViewShow(false); setEditShow(false); setDeleteShow(false);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    setIsDeleting(true);
    try {
      const response = await fetch(`${Base_url}/live-class/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      if (res.status === "success" || res.success) {
        toast.success("Deleted successfully!");
        fetchLiveClassData();
        handleClose();
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ p: 3, bgcolor: "#f4f7fe", minHeight: "100vh" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#072eb0" }}>LIVE CLASS LIST</Typography>
        
        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setOpenData(true)}
          buttonText="Add Live-Class"
        />

        <Paper sx={{ width: "100%", overflow: "hidden", mt: 3, borderRadius: "15px", boxShadow: "0px 10px 30px rgba(0,0,0,0.05)" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["SI.No", "Student Name", "Enrollment No", "Subject Name", "Teacher Name", "Action"].map((label) => (
                    <TableCell key={label} align="center" sx={{ fontWeight: 700, bgcolor: "#f8f9fa", color: "#444" }}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, idx) => (
                    <TableRow hover key={row._id}>
                      <TableCell align="center">{idx + 1}</TableCell>
                      <TableCell align="center">{row.studentName}</TableCell>
                      <TableCell align="center">{row.enrollmentNo}</TableCell>
                      <TableCell align="center">{row.subjectName}</TableCell>
                      <TableCell align="center">{row.teacherName}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton color="primary" onClick={() => {setViewData(row); setViewShow(true);}}><VisibilityIcon fontSize="small" /></IconButton>
                          <IconButton color="inherit" onClick={() => {setEditData(row); setEditShow(true);}}><EditIcon fontSize="small" /></IconButton>
                          <IconButton color="error" onClick={() => {setDeleteId(row._id); setDeleteShow(true);}}><DeleteIcon fontSize="small" /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={6} align="center">No data found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          dialogTitle={openData ? "Create Live Class" : viewShow ? "View Details" : editShow ? "Edit Class" : "Delete Confirmation"}
          dialogContent={
            openData ? <CreateVideoClass handleCreate={fetchLiveClassData} handleClose={handleClose} /> :
            viewShow ? <ViewVideoClass viewData={viewData} /> :
            editShow ? <EditVideoClass editData={editData} handleUpdate={fetchLiveClassData} handleClose={handleClose} /> :
            <DeleteVideoClass handleDelete={handleDelete} isDeleting={isDeleting} handleClose={handleClose} />
          }
        />
      </Box>
    </Layout>
  );
};

export default LiveClass;