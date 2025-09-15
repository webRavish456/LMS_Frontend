"use client";
import React, { useState, useEffect } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableFooter, TablePagination, Box, IconButton
} from "@mui/material";
import { toast } from "react-toastify";
import Create from "@/components/Account/Bill/Create/Create";
import Edit from "@/components/Account/Bill/Edit/Edit";
import View from "@/components/Account/Bill/View/View";
import Delete from "@/components/Account/Bill/Delete/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "@/components/Layout";
import Search from "@/components/Search/Search";

const BillPage = () => {
  const initialData = [
    { id: 1, name: "Electricity Bill", amount: 1200 },
    { id: 2, name: "Water Bill", amount: 300 },
  ];

  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setBills(initialData);
    setFilteredBills(initialData);
  }, []);

  useEffect(() => {
    const filtered = bills.filter((bill) =>
      bill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBills(filtered);
  }, [searchTerm, bills]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleCreate = (newBill) => {
    setBills((prev) => [...prev, { ...newBill, id: prev.length + 1 }]);
    toast.success("Bill added successfully!");
  };

  const handleView = (bill) => {
    setViewData(bill);
    setViewOpen(true);
  };

  const handleEdit = (bill) => {
    setEditData(bill);
    setEditOpen(true);
  };

  const handleUpdate = (updatedBill) => {
    setBills((prev) =>
      prev.map((b) => (b.id === updatedBill.id ? updatedBill : b))
    );
    setEditOpen(false);
    toast.success("Bill updated successfully!");
  };

  const handleDelete = (bill) => {
    setDeleteData(bill);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setBills((prev) => prev.filter((b) => b.id !== deleteData.id));
    setDeleteOpen(false);
    toast.success("Bill deleted successfully!");
  };

  return (
    <Layout>
      <Box p={2}>
        <h1>Bill Management</h1>

        {/* Search component with Add Bill button */}
        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setCreateOpen(true)}
          buttonText="Add Bill"
        />

        <Paper sx={{ marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>SI.No</TableCell>
                  <TableCell>Bill Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBills
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((bill, idx) => (
                    <TableRow key={bill.id} hover>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>{bill.name}</TableCell>
                      <TableCell>₹{bill.amount}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleView(bill)} color="primary">
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(bill)} color="secondary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(bill)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredBills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Bills Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={filteredBills.length}
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

        {/* Create Dialog modal */}
        {createOpen && (
          <Create
            onClose={() => setCreateOpen(false)}
            onCreate={(newBill) => {
              handleCreate(newBill);
              setCreateOpen(false);
            }}
          />
        )}

        {/* View, Edit, Delete dialogs - add as needed */}
      </Box>
    </Layout>
  );
};

export default BillPage;
