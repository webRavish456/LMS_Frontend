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
import CreateIncome from "@/components/Account/Income/Create/Create";
import EditIncome from "@/components/Account/Income/Edit/Edit";
import ViewIncome from "@/components/Account/Income/View/View";
import DeleteIncome from "@/components/Account/Income/Delete/Delete";

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalMode, setModalMode] = useState(null); 
  const [selectedData, setSelectedData] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchIncomes = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/income`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.status === "success" || res.success) {
        setIncomes(res.data || []);
        setFilteredIncomes(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load incomes");
    }
  }, [Base_url]);

  useEffect(() => { fetchIncomes(); }, [fetchIncomes]);

  useEffect(() => {
    const filtered = incomes.filter(inc =>
      inc.source?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIncomes(filtered);
    setPage(0);
  }, [searchTerm, incomes]);

  const handleClose = () => {
    setModalMode(null);
    setSelectedData(null);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box p={3}>
        <Typography variant="h5" fontWeight={700} mb={3}>Income Management</Typography>

        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setModalMode("create")}
          buttonText="Add Income"
        />

        <Paper sx={{ marginTop: 3, borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>SI.No</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>Income Source</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>Amount (₹)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIncomes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((inc, idx) => (
                  <TableRow key={inc._id} hover>
                    <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell align="center">{inc.source}</TableCell>
                    <TableCell align="center">₹{inc.amount}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton color="primary" onClick={() => { setSelectedData(inc); setModalMode("view"); }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="inherit" onClick={() => { setSelectedData(inc); setModalMode("edit"); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={() => { setSelectedData(inc); setModalMode("delete"); }}>
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
            count={filteredIncomes.length}
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
              {modalMode === 'create' ? "Add New Income" : 
               modalMode === 'edit' ? "Update Income" : 
               modalMode === 'view' ? "Income Details" : "Delete Income"}
            </Typography>
          }
          dialogContent={
            modalMode === 'create' ? <CreateIncome handleCreate={fetchIncomes} handleClose={handleClose} /> :
            modalMode === 'edit' ? <EditIncome editData={selectedData} handleUpdate={fetchIncomes} handleClose={handleClose} /> :
            modalMode === 'view' ? <ViewIncome viewData={selectedData} handleClose={handleClose} /> :
            modalMode === 'delete' ? <DeleteIncome deleteId={selectedData?._id} handleDelete={fetchIncomes} handleClose={handleClose} /> : null
          }
        />
      </Box>
    </Layout>
  );
};

export default IncomePage;