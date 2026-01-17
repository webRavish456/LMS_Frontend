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
import CreateExpense from "@/components/Account/Expense/Create/Create";
import EditExpense from "@/components/Account/Expense/Edit/Edit";
import ViewExpense from "@/components/Account/Expense/View/View";
import DeleteExpense from "@/components/Account/Expense/Delete/Delete";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal states
  const [modalMode, setModalMode] = useState(null); // 'create', 'edit', 'view', 'delete'
  const [selectedData, setSelectedData] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // --- API: Fetch Data ---
  const fetchExpenses = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/expense`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.status === "success" || res.success) {
        setExpenses(res.data || []);
        setFilteredExpenses(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load expenses");
    }
  }, [Base_url]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // --- Search Logic ---
  useEffect(() => {
    const filtered = expenses.filter(exp =>
      exp.item?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExpenses(filtered);
    setPage(0);
  }, [searchTerm, expenses]);

  const handleClose = () => {
    setModalMode(null);
    setSelectedData(null);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box p={3}>
        <Typography variant="h5" fontWeight={700} mb={3}>Expense Management</Typography>

        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setModalMode("create")}
          buttonText="Add Expense"
        />

        <Paper sx={{ marginTop: 3, borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>SI.No</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>Expense Item</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>Cost (₹)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((exp, idx) => (
                  <TableRow key={exp._id} hover>
                    <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell align="center">{exp.item}</TableCell>
                    <TableCell align="center">₹{exp.cost}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton color="primary" onClick={() => { setSelectedData(exp); setModalMode("view"); }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="inherit" onClick={() => { setSelectedData(exp); setModalMode("edit"); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={() => { setSelectedData(exp); setModalMode("delete"); }}>
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
            count={filteredExpenses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          />
        </Paper>

        {/* --- Enlarged Dialog Manager --- */}
        <CommonDialog
          open={!!modalMode}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { minHeight: "50vh", borderRadius: "15px" } }}
          dialogTitle={
            <Typography component="span" variant="h6" fontWeight={700}>
              {modalMode === 'create' ? "Add New Expense" : 
               modalMode === 'edit' ? "Update Expense" : 
               modalMode === 'view' ? "Expense Details" : "Delete Expense"}
            </Typography>
          }
          dialogContent={
            modalMode === 'create' ? <CreateExpense handleCreate={fetchExpenses} handleClose={handleClose} /> :
            modalMode === 'edit' ? <EditExpense editData={selectedData} handleUpdate={fetchExpenses} handleClose={handleClose} /> :
            modalMode === 'view' ? <ViewExpense viewData={selectedData} handleClose={handleClose} /> :
            modalMode === 'delete' ? <DeleteExpense deleteId={selectedData?._id} handleDelete={fetchExpenses} handleClose={handleClose} /> : null
          }
        />
      </Box>
    </Layout>
  );
};

export default ExpensePage;