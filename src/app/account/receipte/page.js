"use client";
import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Box,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "@/components/Layout";
import Search from "@/components/Search/Search";

const ReceiptPage = () => {
  const initialData = [
    { id: 1, number: "R1001", amount: 1500 },
    { id: 2, number: "R1002", amount: 2700 },
  ];

  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [errors, setErrors] = useState({ number: "", amount: "" });

  useEffect(() => {
    setReceipts(initialData);
    setFilteredReceipts(initialData);
  }, []);

  useEffect(() => {
    const filtered = receipts.filter((rec) =>
      rec.number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReceipts(filtered);
    setPage(0);
  }, [searchTerm, receipts]);

  const validate = () => {
    let valid = true;
    const newErrors = { number: "", amount: "" };

    if (!numberInput.trim()) {
      newErrors.number = "Receipt Number is required";
      valid = false;
    }
    if (!amountInput) {
      newErrors.amount = "Amount is required";
      valid = false;
    } else if (isNaN(amountInput) || Number(amountInput) <= 0) {
      newErrors.amount = "Enter a valid positive amount";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAdd = () => {
    if (!validate()) return;

    const newReceipt = {
      id: receipts.length ? receipts[receipts.length - 1].id + 1 : 1,
      number: numberInput.trim(),
      amount: parseFloat(amountInput),
    };
    setReceipts((prev) => [...prev, newReceipt]);
    setNumberInput("");
    setAmountInput("");
    setErrors({ number: "", amount: "" });
  };

  const totalAmount = receipts.reduce((sum, rec) => sum + rec.amount, 0);

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setReceipts((prev) => prev.filter((rec) => rec.id !== deleteId));
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Layout>
      <Box p={2}>
        <Typography variant="h4" gutterBottom>
          Receipt Management
        </Typography>

        <Search
          onSearch={(term) => setSearchTerm(term)}
          buttonText="Add Receipt"
          onAddClick={handleAdd}
        />

        <Box sx={{ display: "flex", gap: 2, my: 2 }}>
          <TextField
            label="Receipt Number"
            variant="outlined"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            error={!!errors.number}
            helperText={errors.number}
            fullWidth
          />
          <TextField
            label="Amount"
            variant="outlined"
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            error={!!errors.amount}
            helperText={errors.amount}
            sx={{ width: "150px" }}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!numberInput.trim() || !amountInput || Object.values(errors).some(Boolean)}
          >
            Add
          </Button>
        </Box>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Total Amount: ₹{totalAmount.toFixed(2)}
        </Typography>

        <Paper>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>SI.No</TableCell>
                  <TableCell>Receipt Number</TableCell>
                  <TableCell>Amount (₹)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReceipts.length > 0 ? (
                  filteredReceipts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((rec, idx) => (
                      <TableRow key={rec.id} hover>
                        <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                        <TableCell>{rec.number}</TableCell>
                        <TableCell>{rec.amount}</TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            onClick={() => handleDelete(rec.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Receipts Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={filteredReceipts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    colSpan={4}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle>Delete Receipt</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this receipt?
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default ReceiptPage;
