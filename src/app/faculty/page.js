"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  CircularProgress,
  Typography,
  Button,
  TextField,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Layout from "@/components/Layout";
import Search from "@/components/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import DeleteFaculty from "@/components/Faculty/Delete/Delete";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 🔹 dialog states
  const [selected, setSelected] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= FETCH ================= */
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/faculty`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.status === "success") {
        setRows(json.data || []);
      }
    } catch {
      toast.error("Failed to load faculty");
    } finally {
      setLoading(false);
    }
  };

  /* ================= USE EFFECT ================= */
  useEffect(() => {
    fetchData();

    if (searchParams.get("success") === "created") {
      toast.success("Faculty created successfully");
      router.replace("/faculty");
    }
  }, [token, searchParams]);

  /* ================= SEARCH ================= */
  const filteredRows = useMemo(() => {
    return rows.filter(
      (r) =>
        r.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.emailId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/faculty/${selected._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
    teacherName: selected.teacherName,
    emailId: selected.emailId,
    mobileNumber: selected.mobileNumber,
    companyDetails: selected.companyDetails,
    bankDetails: selected.bankDetails,
  }),
      });

      const json = await res.json();
      if (json.status === "success") {
        toast.success("Faculty updated successfully");
        setOpenEdit(false);
        fetchData();
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!selected) return;
    try {
      await fetch(`${BASE_URL}/faculty/${selected._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Faculty deleted successfully");
      setOpenDelete(false);
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" />

      <Box sx={{ p: 3 }}>
        <Search
          onSearch={setSearchTerm}
          onAddClick={() => router.push("/createfaculty")}
          buttonText="Add Teacher"
        />

        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "SI.No",
                    "Teacher Name",
                    "Course",
                    "Email",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <TableCell key={h} align="center" sx={{ fontWeight: "bold" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length > 0 ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow key={row._id}>
                        <TableCell align="center">
                          {page * rowsPerPage + i + 1}
                        </TableCell>
                        <TableCell align="center">{row.teacherName}</TableCell>
                        <TableCell align="center">
                          {row.companyDetails?.courseName || "-"}
                        </TableCell>
                        <TableCell align="center">{row.emailId}</TableCell>
                        <TableCell align="center">{row.status}</TableCell>
                        <TableCell align="center">
                          {/* VIEW */}
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelected(row);
                              setOpenView(true);
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>

                          {/* EDIT */}
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              setSelected({ ...row });
                              setOpenEdit(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>

                          {/* DELETE */}
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelected(row);
                              setOpenDelete(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No Teacher Found
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
            onRowsPerPageChange={(e) =>
              setRowsPerPage(+e.target.value)
            }
          />
        </Paper>
      </Box>

      {/* ================= VIEW DIALOG ================= */}
      <CommonDialog
        open={openView}
        onClose={() => setOpenView(false)}
        dialogTitle="Faculty Details"
        dialogContent={
          <Box>
            <Typography><b>Name:</b> {selected?.teacherName}</Typography>
            <Typography><b>Email:</b> {selected?.emailId}</Typography>
            <Typography><b>Course:</b> {selected?.companyDetails?.courseName}</Typography>
            <Typography><b>Status:</b> {selected?.status}</Typography>
          </Box>
        }
      />

      {/* ================= EDIT DIALOG ================= */}
      <CommonDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        dialogTitle="Edit Faculty"
        dialogContent={
          <Box>
            <TextField
              fullWidth
              label="Teacher Name"
              value={selected?.teacherName || ""}
              onChange={(e) =>
                setSelected({ ...selected, teacherName: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={selected?.emailId || ""}
              onChange={(e) =>
                setSelected({ ...selected, emailId: e.target.value })
              }
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={saving}
            >
              Save Changes
            </Button>
          </Box>
        }
      />

      {/* ================= DELETE DIALOG ================= */}
      <CommonDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        dialogTitle="Delete Faculty"
        dialogContent={
          <DeleteFaculty
            onConfirm={handleDelete}
            onClose={() => setOpenDelete(false)}
          />
        }
      />
    </Layout>
  );
};

export default FacultyPage;
