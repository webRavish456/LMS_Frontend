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
  CircularProgress
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
  const [loading, setLoading] = useState(true);
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

  // --- Fetch Logic (Optimized with useCallback) ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/documentsharing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      if (res.status === "success") {
        setRows(res.data);
        setFilteredRows(res.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  }, [Base_url, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Filter Logic ---
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

  // --- Handlers ---
  const handleClose = () => {
    setOpenData(false); setViewShow(false); setEditShow(false); setDeleteShow(false);
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
    } catch (error) { toast.error("Download failed"); }
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
        fetchData(); // Refresh table
        handleClose();
      }
    } catch (e) { toast.error("Error deleting"); }
    finally { setIsDeleting(false); }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Box sx={{ 
        minHeight: "100vh", 
        width: "100%",
        backgroundImage: `linear-gradient(rgba(240, 247, 255, 0.8), rgba(240, 247, 255, 0.8)), url('/images/study-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        py: 4, px: { xs: 2, md: 4 }
      }}>
        
        <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Search 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddClick={() => setOpenData(true)} 
            buttonText="Add Document" 
          />

          <Paper sx={{ 
            mt: 3, 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #e0e0e0'
          }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ 
                          fontWeight: 700, 
                          backgroundColor: "#f8f9fa !important", 
                          color: "#333",
                          fontSize: '0.9rem',
                          textTransform: 'uppercase'
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}>
                        <CircularProgress size={40} />
                      </TableCell>
                    </TableRow>
                  ) : filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="textSecondary">No documents found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, idx) => (
                        <TableRow hover key={row._id}>
                          <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.topic}</TableCell>
                          <TableCell sx={{ maxWidth: 250 }}>
                            {row.topicDescription.length > 50 ? row.topicDescription.slice(0, 50) + "..." : row.topicDescription}
                          </TableCell>
                          <TableCell align="center">
                             <Box sx={{ bgcolor: '#e3f2fd', color: '#1565c0', borderRadius: '4px', px: 1, py: 0.5, fontSize: '0.85rem' }}>{row.course}</Box>
                          </TableCell>
                          <TableCell align="center">{row.teacher}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Download PDF">
                              <IconButton onClick={() => handleDownload(row)}>
                                <img src="/pdf.png" alt="pdf" style={{ width: "24px", height: "24px" }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <IconButton onClick={() => { setViewData(row); setViewShow(true); }} sx={{ color: "#1565c0" }} size="small"><VisibilityIcon fontSize="small" /></IconButton>
                              <IconButton onClick={() => { setEditData(row); setEditShow(true); }} sx={{ color: "#455a64" }} size="small"><EditIcon fontSize="small" /></IconButton>
                              <IconButton onClick={() => { setDeleteId(row._id); setDeleteShow(true); }} sx={{ color: "#d32f2f" }} size="small"><DeleteIcon fontSize="small" /></IconButton>
                            </Box>
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
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
            />
          </Paper>
        </Box>

        {/* Dialog Section - Updated with maxWidth */}
        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          maxWidth={deleteShow ? "xs" : "md"} // Delete dialog smaller, others bigger
          fullWidth={true}
          dialogTitle={
            openData ? "Upload New Document" : viewShow ? "Document Information" : editShow ? "Modify Document" : "Confirm Deletion"
          }
          dialogContent={
            openData ? <CreateDocumentSharing handleCreate={() => { fetchData(); handleClose(); }} handleClose={handleClose} />
            : viewShow ? <ViewDocumentSharing viewData={viewData} handleClose={handleClose} />
            : editShow ? <EditDocumentSharing editData={editData} handleUpdate={() => { fetchData(); handleClose(); }} handleClose={handleClose} />
            : <DeleteDocumentSharing handleDelete={handleDelete} isDeleting={isDeleting} handleClose={handleClose} />
          }
        />
      </Box>
    </Layout>
  );
}

export default DocumentSharing;