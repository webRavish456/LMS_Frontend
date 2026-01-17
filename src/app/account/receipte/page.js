"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Box, IconButton, Typography, Stack
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Modals
// ✅ अगर फोल्डर 'Receipt' है तो:
import CreateReceipt from "@/components/Account/Receipt/Create/Create";
import EditReceipt from "@/components/Account/Receipt/Edit/Edit";
import ViewReceipt from "@/components/Account/Receipt/View/View";
import DeleteReceipt from "@/components/Account/Receipt/Delete/Delete";
const ReceiptPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalMode, setModalMode] = useState(null); 
  const [selectedData, setSelectedData] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchReceipts = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/receipt`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.status === "success" || res.success) {
        setReceipts(res.data || []);
        setFilteredReceipts(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load receipts");
    }
  }, [Base_url]);

  useEffect(() => { fetchReceipts(); }, [fetchReceipts]);

  useEffect(() => {
    const filtered = receipts.filter(rec =>
      rec.number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReceipts(filtered);
    setPage(0);
  }, [searchTerm, receipts]);

  const handleClose = () => {
    setModalMode(null);
    setSelectedData(null);
  };

  const totalAmount = receipts.reduce((sum, rec) => sum + (Number(rec.amount) || 0), 0);

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box p={3}>
        <Typography variant="h5" fontWeight={700} mb={3}>Receipt Management</Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
           <Search
            onSearch={(term) => setSearchTerm(term)}
            onAddClick={() => setModalMode("create")}
            buttonText="Add Receipt"
          />
          <Typography variant="h6" color="primary" fontWeight={600}>
            Total: ₹{totalAmount.toFixed(2)}
          </Typography>
        </Stack>

        <Paper sx={{ marginTop: 3, borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>SI.No</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>Receipt Number</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>Amount (₹)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReceipts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rec, idx) => (
                  <TableRow key={rec._id} hover>
                    <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell align="center">{rec.number}</TableCell>
                    <TableCell align="center">₹{rec.amount}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton color="primary" onClick={() => { setSelectedData(rec); setModalMode("view"); }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="inherit" onClick={() => { setSelectedData(rec); setModalMode("edit"); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={() => { setSelectedData(rec); setModalMode("delete"); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredReceipts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          />
        </Paper>

        <CommonDialog
          open={!!modalMode}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          dialogTitle={
            <Typography component="span" variant="h6" fontWeight={700}>
              {modalMode === 'create' ? "Generate New Receipt" : 
               modalMode === 'edit' ? "Update Receipt" : 
               modalMode === 'view' ? "Receipt Details" : "Delete Receipt"}
            </Typography>
          }
          dialogContent={
            modalMode === 'create' ? <CreateReceipt handleCreate={fetchReceipts} handleClose={handleClose} /> :
            modalMode === 'edit' ? <EditReceipt editData={selectedData} handleUpdate={fetchReceipts} handleClose={handleClose} /> :
            modalMode === 'view' ? <ViewReceipt viewData={selectedData} handleClose={handleClose} /> :
            modalMode === 'delete' ? <DeleteReceipt deleteId={selectedData?._id} handleDelete={fetchReceipts} handleClose={handleClose} /> : null
          }
        />
      </Box>
    </Layout>
  );
};

export default ReceiptPage;