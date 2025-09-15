"use client";
import React, { useState, useEffect } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableFooter, TablePagination, Box, Button, TextField, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "@/components/Layout";
import Search from "@/components/Search/Search";

const ExpensePage = () => {
  const initialData = [
    { id: 1, item: "Groceries", cost: 1500 },
    { id: 2, item: "Transport", cost: 800 },
  ];

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [costInput, setCostInput] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setExpenses(initialData);
    setFilteredExpenses(initialData);
  }, []);

  useEffect(() => {
    const filtered = expenses.filter(exp =>
      exp.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExpenses(filtered);
    setPage(0);
  }, [searchTerm, expenses]);

  const handleAdd = () => {
    if (!itemInput.trim() || !costInput) return;
    const newExpense = {
      id: expenses.length + 1,
      item: itemInput.trim(),
      cost: parseFloat(costInput),
    };
    setExpenses(prev => [...prev, newExpense]);
    setItemInput("");
    setCostInput("");
  };

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Layout>
      <Box p={2}>
        <h1>Expense Management</h1>

        {/* Search and Add button */}
        <Search
          onSearch={(term) => setSearchTerm(term)}
          buttonText="Add Expense"
          onAddClick={handleAdd}
        />

        {/* Add inputs for new expense */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2, marginTop: 1 }}>
          <TextField
            label="Expense Item"
            variant="outlined"
            value={itemInput}
            onChange={(e) => setItemInput(e.target.value)}
            fullWidth
          />
          <TextField
            label="Cost"
            variant="outlined"
            type="number"
            value={costInput}
            onChange={(e) => setCostInput(e.target.value)}
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
                  <TableCell>Expense Item</TableCell>
                  <TableCell>Cost (₹)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((exp, idx) => (
                    <TableRow key={exp.id} hover>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>{exp.item}</TableCell>
                      <TableCell>{exp.cost}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(exp.id)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Expenses Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={filteredExpenses.length}
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

export default ExpensePage;
