'use client'

import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import DeleteCertificate from "@/components/Student/Certificates/Delete/Delete";
import EditCertificate from "@/components/Student/Certificates/Edit/Edit";
import ViewCertificates from "@/components/Student/Certificates/View/View";
import CreateCertificate from "@/components/Student/Certificates/Create/Create";
import Layout from "@/components/Layout";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Certificates = () => {
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

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const columns = [
    { id: "si", label: "SI.No", align: "center" },
    { id: "studentName", label: "Student Name", align: "center" },
    { id: "courseName", label: "Course Name", align: "center" },
    { id: "duration", label: "Duration", align: "center" },
    { id: "certificate", label: "Certificate", align: "center" },
    { id: "status", label: "Status", align: "center" },
    { id: "action", label: "Action", align: "center" },
  ];

  useEffect(() => {
    const fetchCertificatesData = async () => {
      try {
        const response = await fetch(`${Base_url}/certificates`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        
        const res = await response.json();

        if (res.status === "success") {
          setLoading(false);
          const formattedData = res.data.map((item, index) =>
            createData(
              index + 1,
              item,
              item.studentName,
              item.courseName,
              item.duration,
              item.certificates,
              item.status
            )
          );
          setRows(formattedData);
          setFilteredRows(formattedData);
        }
      } catch (error) {
        console.error("Error fetching certificate data:", error);
      }
    };

    if (loading) {
      fetchCertificatesData();
    }
  }, [loading]);

  const createData = (si, row, studentName, courseName, duration, certificates, status) => ({
    si,
    row,
    studentName,
    courseName,
    duration,
    status,
    certificate: (
      <IconButton onClick={() => handleDownload(row)}>
        <img
          src="/pdf.png"
          alt="PDF Icon"
          style={{ width: "24px", height: "24px", cursor: "pointer" }}
          onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/337/337946.png"}
        />
      </IconButton>
    ),
    action: (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton
          style={{ color: "#072eb0", padding: "4px", transform: "scale(0.8)" }}
          onClick={() => handleView(row)}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          style={{ color: "#6b6666", padding: "4px", transform: "scale(0.8)" }}
          onClick={() => handleEdit(row)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          style={{ color: "#e6130b", padding: "4px", transform: "scale(0.8)" }}
          onClick={() => handleShowDelete(row._id)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  });

  const handleDownload = async (rowData) => {
    try {
      const response = await fetch(rowData.certificates);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${rowData.studentName}-${rowData.courseName}-certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download PDF", error);
      toast.error("Could not download certificate");
    }
  };

  useEffect(() => {
    const filtered = rows.filter((row) =>
      (row.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.courseName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.status || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (data) => { setEditData(data); setEditShow(true); };
  const handleShowDelete = (id) => { setDeleteId(id); setDeleteShow(true); };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${Base_url}/certificates/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      if (res.status === "success") {
        toast.success("Certificate deleted successfully!");
        setLoading(true);
      } else {
        toast.error(res.message);
      }
      handleClose();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setOpenData(false); setViewShow(false); setEditShow(false); setDeleteShow(false);
  };

  const handleCreate = (refresh = true) => { if (refresh) setLoading(true); setOpenData(false); };
  const handleUpdate = (refresh = true) => { if (refresh) setLoading(true); setEditShow(false); };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(+e.target.value); setPage(0); };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ p: 3 }}>
        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setOpenData(true)}
          buttonText="Add Certificate"
        />

        <Paper sx={{ width: "100%", overflow: "hidden", mt: 2, borderRadius: '12px' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ fontWeight: 700, backgroundColor: "#f5f5f5" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, idx) => (
                      <TableRow hover key={idx}>
                        {columns.map((column) => (
                          <TableCell key={column.id} align={column.align}>
                            {row[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No certificates found
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
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openData ? "Create New Certificate" : viewShow ? "View Certificate" : editShow ? "Edit Certificate" : "Delete Certificate"
          }
          dialogContent={
            openData ? (
              <CreateCertificate handleCreate={handleCreate} handleClose={handleClose} />
            ) : viewShow ? (
              <ViewCertificates viewData={viewData} />
            ) : editShow ? (
              <EditCertificate editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} />
            ) : deleteShow ? (
              <DeleteCertificate handleDelete={handleDelete} isDeleting={isDeleting} handleClose={handleClose} />
            ) : null
          }
        />
      </Box>
    </Layout>
  );
};

export default Certificates;