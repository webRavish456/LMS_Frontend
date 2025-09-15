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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "@/components/Layout";
import Search from "@/components/Search/Search";

const IncomePage = () => {
  const initialData = [
    { id: 1, source: "Salary", amount: 50000 },
    { id: 2, source: "Freelance", amount: 20000 },
  ];

  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceInput, setSourceInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setIncomes(initialData);
    setFilteredIncomes(initialData);
  }, []);

  useEffect(() => {
    const filtered = incomes.filter((inc) =>
      inc.source.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIncomes(filtered);
    setPage(0);
  }, [searchTerm, incomes]);

  const handleAdd = () => {
    if (!sourceInput.trim() || !amountInput) return;
    const newIncome = {
      id: incomes.length + 1,
      source: sourceInput.trim(),
      amount: parseFloat(amountInput),
    };
    setIncomes((prev) => [...prev, newIncome]);
    setSourceInput("");
    setAmountInput("");
  };

  const handleDelete = (id) => {
    setIncomes((prev) => prev.filter((inc) => inc.id !== id));
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Layout>
      <Box p={2}>
        <h1>Income Management</h1>

        {/* Search and Add button */}
        <Search
          onSearch={(term) => setSearchTerm(term)}
          buttonText="Add Income"
          onAddClick={handleAdd}
        />

        {/* Add inputs for new income */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2, marginTop: 1 }}>
          <TextField
            label="Income Source"
            variant="outlined"
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            fullWidth
          />
          <TextField
            label="Amount"
            variant="outlined"
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            sx={{ width: "150px" }}
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Box>

        <Paper sx={{ marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>SI.No</TableCell>
                  <TableCell>Income Source</TableCell>
                  <TableCell>Amount (₹)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIncomes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((inc, idx) => (
                    <TableRow key={inc.id} hover>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>{inc.source}</TableCell>
                      <TableCell>{inc.amount}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(inc.id)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredIncomes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Incomes Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={filteredIncomes.length}
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
      </Box>
    </Layout>
  );
};

export default IncomePage;
