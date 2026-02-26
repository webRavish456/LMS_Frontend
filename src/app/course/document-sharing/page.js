"use client";

import { useState, useEffect, useCallback } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Search from "@/components/Search";
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
  Typography,
} from "@mui/material";

import CommonDialog from "@/components/CommonDialog/CommonDialog";
import CreateDocumentSharing from "@/components/Course/DocumentSharing/Create/Create";
import ViewDocumentSharing from "@/components/Course/DocumentSharing/View/View";
import EditDocumentSharing from "@/components/Course/DocumentSharing/Edit/Edit";
import DeleteDocumentSharing from "@/components/Course/DocumentSharing/Delete/Delete";
import { toast, ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";

const DocumentSharing = () => {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= FETCH DATA ================= */
  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${Base_url}/documentsharing`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await response.json();

      if (response.ok && res.status === "success") {
        setRows(res.data || []);
        setFilteredRows(res.data || []);
      } else {
        toast.error(res.message || "Failed to fetch documents");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error while fetching data");
    }
  }, [Base_url, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const lower = searchTerm.toLowerCase();

    const filtered = rows.filter(
      (row) =>
        row.topic?.toLowerCase().includes(lower) ||
        row.teacher?.toLowerCase().includes(lower) ||
        row.course?.toLowerCase().includes(lower)
    );

    setFilteredRows(filtered);
    setPage(0);
  }, [searchTerm, rows]);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(
        `${Base_url}/documentsharing/${deleteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const res = await response.json();

      if (response.ok && res.status === "success") {
        toast.success("Document deleted successfully!");
        fetchData();
        handleClose();
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setOpenCreate(false);
    setOpenView(false);
    setOpenEdit(false);
    setOpenDelete(false);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ py: 4, px: 3 }}>
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddClick={() => setOpenCreate(true)}
          buttonText="Add Document"
        />

        <Paper sx={{ mt: 3 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center">SI.No</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Course</TableCell>
                  <TableCell align="center">Teacher</TableCell>
                  <TableCell align="center">Download</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography>No documents found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, idx) => {
                      const description =
                        row.topicDescription ||
                        row.topic_description ||
                        row.description ||
                        "";

                      const documentUrl =
                        row.document ||
                        row.file ||
                        row.documentUrl ||
                        "";

                      return (
                        <TableRow hover key={row._id}>
                          <TableCell align="center">
                            {page * rowsPerPage + idx + 1}
                          </TableCell>

                          <TableCell>{row.topic || "-"}</TableCell>

                          <TableCell>
                            {description
                              ? description.length > 60
                                ? description.substring(0, 60) + "..."
                                : description
                              : "-"}
                          </TableCell>

                          <TableCell align="center">
                            {row.course || "-"}
                          </TableCell>

                          <TableCell align="center">
                            {row.teacher || "-"}
                          </TableCell>

                          <TableCell align="center">
                            {documentUrl ? (
                              <a
                                href={documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#1976d2",
                                  fontWeight: 500,
                                  textDecoration: "none",
                                }}
                              >
                                Download
                              </a>
                            ) : (
                              <Typography color="text.secondary">
                                N/A
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell align="center">
                            <IconButton
                              onClick={() => {
                                setViewData(row);
                                setOpenView(true);
                              }}
                            >
                              <VisibilityIcon
                                fontSize="small"
                                sx={{ color: "#1976d2" }}
                              />
                            </IconButton>

                            <IconButton
                              onClick={() => {
                                setEditData(row);
                                setOpenEdit(true);
                              }}
                            >
                              <EditIcon
                                fontSize="small"
                                sx={{ color: "green" }}
                              />
                            </IconButton>

                            <IconButton
                              onClick={() => {
                                setDeleteId(row._id);
                                setOpenDelete(true);
                              }}
                            >
                              <DeleteIcon
                                fontSize="small"
                                sx={{ color: "red" }}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
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
          open={openCreate || openView || openEdit || openDelete}
          onClose={handleClose}
          dialogTitle={
            openCreate
              ? "Upload Document"
              : openView
              ? "Document Details"
              : openEdit
              ? "Edit Document"
              : "Confirm Delete"
          }
          dialogContent={
            openCreate ? (
              <CreateDocumentSharing
                handleCreate={() => {
                  fetchData();
                  handleClose();
                }}
                handleClose={handleClose}
              />
            ) : openView ? (
              <ViewDocumentSharing viewData={viewData} />
            ) : openEdit ? (
              <EditDocumentSharing
                editData={editData}
                handleUpdate={() => {
                  fetchData();
                  handleClose();
                }}
                handleClose={handleClose}
              />
            ) : (
              <DeleteDocumentSharing
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

export default DocumentSharing;