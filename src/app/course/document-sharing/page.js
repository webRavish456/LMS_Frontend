"use client";

import { useState, useEffect } from "react";
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
  Tooltip
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
  // ... (States logic remains exactly same as your code)
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
    { id: "topic", label: "Course Title", align: "left" },
    { id: "topicDescription", label: "Description", align: "left" },
    { id: "course", label: "Course", align: "center" },
    { id: "teacher", label: "Teacher", align: "center" },
    { id: "document", label: "Download", align: "center" },
    { id: "action", label: "Action", align: "center" },
  ];

  // --- Fetch Logic ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${Base_url}/documentsharing`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await response.json();
        if (res.status === "success") {
          setRows(res.data);
          setFilteredRows(res.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (loading) fetchData();
  }, [loading, Base_url, token]);

  // --- Filter Logic ---
  useEffect(() => {
    const filtered = rows.filter(
      (row) =>
        row.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  // --- Handlers ---
  const handleClose = () => {
    setOpenData(false); setViewShow(false); setEditShow(false); setDeleteShow(false);
  };

  const handleClick = async (row) => {
    try {
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
        setLoading(true);
      }
      handleClose();
    } catch (e) { toast.error("Error deleting"); }
    finally { setIsDeleting(false); }
  };

  const handleCreate = (shouldRefresh) => {
    if (shouldRefresh) {
      setLoading(true);  // ✅ Data को refetch करेगा
      setOpenData(false);  // ✅ Dialog close करेगा
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Background Wrapper */}
      <Box sx={{ 
        minHeight: "100vh", 
        width: "100%",
        backgroundImage: `linear-gradient(rgba(187, 222, 251, 0.75), rgba(187, 222, 251, 0.75)), url('/images/study-bg.jpg')`,
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

          {/* Premium Table Paper */}
          <Paper sx={{ 
            mt: 3, 
            backgroundColor: 'rgba(255, 255, 255, 0.85)', 
            backdropFilter: 'blur(12px)', 
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <TableContainer sx={{ maxHeight: 550 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ 
                          fontWeight: 800, 
                          backgroundColor: "#e3f2fd !important", 
                          color: "#1565c0",
                          borderBottom: '2px solid #bbdefb',
                          fontSize: '0.95rem'
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="textSecondary">No documents found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, idx) => (
                        <TableRow hover key={row._id} sx={{ '&:hover': { backgroundColor: 'rgba(227, 242, 253, 0.4)' } }}>
                          <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>{row.topic}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            {row.topicDescription.length > 60 ? row.topicDescription.slice(0, 60) + "..." : row.topicDescription}
                          </TableCell>
                          <TableCell align="center">
                             <Box sx={{ bgcolor: '#fff', border: '1px solid #bbdefb', borderRadius: '4px', px: 1 }}>{row.course}</Box>
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 500 }}>{row.teacher}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Download PDF">
                              <img
                                onClick={() => handleClick(row)}
                                src="/pdf.png"
                                alt="pdf"
                                style={{ width: "28px", height: "28px", cursor: "pointer", filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <IconButton onClick={() => { setViewData(row); setViewShow(true); }} sx={{ color: "#1565c0", bgcolor: 'rgba(21, 101, 192, 0.1)' }} size="small"><VisibilityIcon fontSize="small" /></IconButton>
                              <IconButton onClick={() => { setEditData(row); setEditShow(true); }} sx={{ color: "#455a64", bgcolor: 'rgba(69, 90, 100, 0.1)' }} size="small"><EditIcon fontSize="small" /></IconButton>
                              <IconButton onClick={() => { setDeleteId(row._id); setDeleteShow(true); }} sx={{ color: "#d32f2f", bgcolor: 'rgba(211, 47, 47, 0.1)' }} size="small"><DeleteIcon fontSize="small" /></IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
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
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
            />
          </Paper>
        </Box>

        {/* Dialog Section */}
        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openData ? "Create New Document" : viewShow ? "View Document Details" : editShow ? "Edit Document" : "Delete Confirmation"
          }
          dialogContent={
            openData ? <CreateDocumentSharing handleCreate={handleCreate} handleClose={handleClose} />
            : viewShow ? <ViewDocumentSharing viewData={viewData} />
            : editShow ? <EditDocumentSharing editData={editData} handleUpdate={(v) => { setLoading(v); handleClose(); }} handleClose={handleClose} />
            : <DeleteDocumentSharing handleDelete={handleDelete} isDeleting={isDeleting} handleClose={handleClose} />
          }
        />
      </Box>
    </Layout>
  );
}

export default DocumentSharing;                                                   