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
  Tooltip,
} from "@mui/material";

import CommonDialog from "@/components/CommonDialog/CommonDialog";
import CreateDocumentSharing from "@/components/Course/DocumentSharing/Create/Create";
import ViewDocumentSharing from "@/components/Course/DocumentSharing/View/View";
import EditDocumentSharing from "@/components/Course/DocumentSharing/Edit/Edit";
import DeleteDocumentSharing from "@/components/Course/DocumentSharing/Delete/Delete";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const DocumentSharing = () => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const columns = [
    { id: "si", label: "SI.No", align: "center" },
    { id: "topic", label: "Topic", align: "left" },
    { id: "topicDescription", label: "Description", align: "left" },
    { id: "course", label: "Course", align: "center" },
    { id: "teacher", label: "Teacher", align: "center" },
    { id: "document", label: "Download", align: "center" },
    { id: "action", label: "Action", align: "center" },
  ];

  /* ================= FETCH ================= */
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${Base_url}/documentsharing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      if (res.status === "success") {
        setRows(res.data);
        setFilteredRows(res.data);
      }
    } catch (error) {
      toast.error("Failed to fetch documents");
    }
  }, [Base_url, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= FILTER ================= */
  useEffect(() => {
    const filtered = rows.filter(
      (row) =>
        row.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.teacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.course?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
    setPage(0);
  }, [searchTerm, rows]);

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
  };

  const handleDownload = async (row) => {
    try {
      if (!row.document) return toast.error("No file available");
      const response = await fetch(row.document);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${row.course}-${row.topic}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("Download failed");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${Base_url}/documentsharing/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      if (res.status === "success") {
        toast.success("Document deleted!");
        fetchData();
        handleClose();
      }
    } catch {
      toast.error("Error deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddClick={() => setOpenData(true)}
          buttonText="Add Document"
        />

        <Paper sx={{ mt: 3 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} sx={{ fontWeight: 700 }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                      <Typography>No documents found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, idx) => (
                      <TableRow hover key={row._id}>
                        <TableCell align="center">
                          {page * rowsPerPage + idx + 1}
                        </TableCell>
                        <TableCell>{row.topic}</TableCell>
                        <TableCell>
                          {row.topicDescription?.length > 50
                            ? row.topicDescription.slice(0, 50) + "..."
                            : row.topicDescription}
                        </TableCell>
                        <TableCell align="center">{row.course}</TableCell>
                        <TableCell align="center">{row.teacher}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Download PDF">
                            <IconButton onClick={() => handleDownload(row)}>
                              <img src="/pdf.png" alt="pdf" width={24} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => { setViewData(row); setViewShow(true); }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => { setEditData(row); setEditShow(true); }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => { setDeleteId(row._id); setDeleteShow(true); }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
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

        {/* ================= DIALOG ================= */}
        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openData
              ? "Upload New Document"
              : viewShow
              ? "Document Details"
              : editShow
              ? "Edit Document"
              : "Confirm Delete"
          }
          dialogContent={
            openData ? (
              <CreateDocumentSharing handleCreate={() => { fetchData(); handleClose(); }} />
            ) : viewShow ? (
              <ViewDocumentSharing viewData={viewData} />
            ) : editShow ? (
              <EditDocumentSharing
                editData={editData}
                handleUpdate={() => { fetchData(); handleClose(); }}
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
