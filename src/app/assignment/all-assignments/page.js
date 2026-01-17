'use client';

import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllAssignment = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { id: "si", label: "SI.No", align: "center" },
    { id: "assignmentTitle", label: "Assignment Title", align: "center" },
    { id: "course", label: "Course", align: "center" },
    { id: "teacher", label: "Teacher", align: "center" },
    { id: "dueDate", label: "Due Date", align: "center" },
    { id: "status", label: "Status", align: "center" },
    { id: "action", label: "Actions", align: "center" },
  ];

  /* ================= FETCH ASSIGNMENTS ================= */
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${Base_url}/allAssignment`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = await response.json();

        if (res.status === "success" && Array.isArray(res.data)) {
          const formatted = res.data.map((item, index) =>
            createRow(index + 1, item)
          );
          setRows(formatted);
          setFilteredRows(formatted);
        }
      } catch (error) {
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    if (loading) fetchAssignments();
  }, [loading, Base_url, token]);

  /* ================= ROW FORMAT ================= */
  const createRow = (si, row) => ({
    si,
    assignmentTitle: row.assignmentTitle,
    course: row.course,
    teacher: row.teacher,
    dueDate: new Date(row.dueDate).toLocaleDateString("en-IN"),
    status: <Chip label={row.status} size="small" color="primary" />,
    action: (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton onClick={() => { setViewData(row); setViewShow(true); }}>
          <VisibilityIcon color="primary" />
        </IconButton>
        <IconButton onClick={() => { setEditData(row); setEditShow(true); }}>
          <EditIcon sx={{ color: "#ed6c02" }} />
        </IconButton>
        <IconButton
          onClick={() => { setDeleteId(row._id); setDeleteShow(true); }}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  });

  /* ================= SEARCH ================= */
  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.assignmentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.teacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${Base_url}/allAssignment/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json());

      if (res.status === "success") {
        toast.success("Assignment deleted successfully");
        setLoading(true);
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch {
      toast.error("Delete request failed");
    } finally {
      setIsDeleting(false);
      handleClose();
    }
  };

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
          buttonText="Add Assignment"
        />

        <Paper sx={{ mt: 2, borderRadius: "12px" }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell key={col.id} align={col.align} sx={{ fontWeight: 700 }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.length ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow hover key={i}>
                        {columns.map(col => (
                          <TableCell key={col.id} align={col.align}>
                            {row[col.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No assignments found
                    </TableCell>
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
              <CreateAllAssignment handleClose={handleClose} handleCreate={() => setLoading(true)} />
            ) : viewShow ? (
              <ViewAllAssignment viewData={viewData} />
            ) : editShow ? (
              <EditAllAssignment
                editData={editData}
                handleClose={handleClose}
                handleUpdate={() => setLoading(true)}
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
