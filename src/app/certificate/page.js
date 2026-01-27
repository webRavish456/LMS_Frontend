"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

import Layout from "@/components/Layout";
import Create from "@/components/Certificate/Create/Create";
import Edit from "@/components/Certificate/Edit/Edit";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CertificatePage() {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const certRef = useRef(null);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE}/certificates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRows(data.data);
    } catch {
      toast.error("Failed to load certificates");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete certificate?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE}/certificates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted successfully");
        fetchData();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= DOWNLOAD ================= */
  const downloadPDF = async () => {
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 297, 210);
    pdf.save(`${viewData.name}_certificate.pdf`);
  };

  const filteredRows = rows.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <ToastContainer position="top-right" />

      <Box p={3} bgcolor="#fff" minHeight="100vh">
        {/* TOP BAR */}
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <TextField
            size="small"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setOpenCreate(true)}
          >
            Add Certificate
          </Button>
        </Stack>

        {/* TABLE */}
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SI</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Issuer</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row, i) => (
                <TableRow key={row._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.issuer}</TableCell>

                  <TableCell align="center">
                    {/* VIEW */}
                    <IconButton onClick={() => setViewData(row)}>
                      <VisibilityIcon />
                    </IconButton>

                    {/* EDIT */}
                    <IconButton onClick={() => setEditData(row)}>
                      <EditIcon />
                    </IconButton>

                    {/* DELETE */}
                    <IconButton onClick={() => handleDelete(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No certificates found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* CREATE */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Add Certificate</DialogTitle>
          <Create onClose={() => setOpenCreate(false)} onSuccess={fetchData} />
        </Dialog>

        {/* EDIT */}
        <Dialog open={!!editData} onClose={() => setEditData(null)} maxWidth="xs" fullWidth>
          <DialogTitle>Edit Certificate</DialogTitle>
          {editData && (
            <Edit data={editData} onClose={() => setEditData(null)} onSuccess={fetchData} />
          )}
        </Dialog>

        {/* VIEW CERTIFICATE TEMPLATE */}
        <Dialog open={!!viewData} onClose={() => setViewData(null)} maxWidth="xl" fullWidth>
          <DialogTitle>Certificate Preview</DialogTitle>

          {viewData && (
            <Box p={2}>
              <Box
                ref={certRef}
                sx={{
                  width: "900px",
                  height: "635px",
                  backgroundImage: "url(/sidebar/certification.png)",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                  mx: "auto",
                }}
              >
                <Typography
                  sx={{
                    position: "absolute",
                    top: "48%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "42px",
                    fontWeight: 700,
                    color: "#000",
                  }}
                >
                  {viewData.name}
                </Typography>

                <Typography
                  sx={{
                    position: "absolute",
                    top: "56%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "20px",
                    color: "#000",
                  }}
                >
                  {viewData.course}
                </Typography>

                <Typography
                  sx={{
                    position: "absolute",
                    bottom: "18%",
                    right: "15%",
                    fontSize: "16px",
                    color: "#000",
                  }}
                >
                  Issued by {viewData.issuer}
                </Typography>
              </Box>

              <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
                <Button startIcon={<DownloadIcon />} onClick={downloadPDF} variant="contained">
                  Download PDF
                </Button>
                <Button variant="outlined" onClick={() => setViewData(null)}>
                  Close
                </Button>
              </Stack>
            </Box>
          )}
        </Dialog>
      </Box>
    </Layout>
  );
}
