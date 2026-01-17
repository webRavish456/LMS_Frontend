"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Box, IconButton, Typography
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import Create from "@/components/Account/Bill/Create/Create";
import Edit from "@/components/Account/Bill/Edit/Edit";
import View from "@/components/Account/Bill/View/View";
import Delete from "@/components/Account/Bill/Delete/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]); // This is your state name
  const [searchTerm, setSearchTerm] = useState("");
  
  const [modalMode, setModalMode] = useState(null); 
  const [selectedData, setSelectedData] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchBills = useCallback(async () => {
    try {
      const response = await fetch(`${Base_url}/bill`);
      const res = await response.json();
      if (res.status === "success" || res.success) {
        setBills(res.data || []);
        setFilteredBills(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch bills");
    }
  }, [Base_url]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // --- Search Logic (Fixed Line 56) ---
  useEffect(() => {
    const filtered = bills.filter((bill) =>
      bill.billName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBills(filtered); // ✅ Matches state name
  }, [searchTerm, bills]);

  const handleClose = () => {
    setModalMode(null);
    setSelectedData(null);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box p={3}>
        <Typography variant="h5" fontWeight={700} mb={3}>Bill Management</Typography>

        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setModalMode("create")}
          buttonText="Add Bill"
        />

        <Paper sx={{ marginTop: 3, borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>SI.No</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Bill Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBills.length > 0 ? (
                  filteredBills
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((bill, idx) => (
                      <TableRow key={bill._id} hover>
                        <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                        <TableCell align="center">{bill.billName}</TableCell>
                        <TableCell align="center">₹{bill.amount}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => { setSelectedData(bill); setModalMode("view"); }} color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => { setSelectedData(bill); setModalMode("edit"); }} color="inherit">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => { setSelectedData(bill); setModalMode("delete"); }} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>No Bills Found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredBills.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          />
        </Paper>

        <CommonDialog
          open={!!modalMode}
          onClose={handleClose}
          dialogTitle={
            <Typography component="span" variant="h6" fontWeight={700}>
              {modalMode === 'create' ? "Create Bill" : 
               modalMode === 'edit' ? "Edit Bill" : 
               modalMode === 'view' ? "Bill Details" : "Delete Bill"}
            </Typography>
          }
          dialogContent={
            modalMode === 'create' ? <Create handleCreate={fetchBills} handleClose={handleClose} /> :
            modalMode === 'edit' ? <Edit editData={selectedData} handleUpdate={fetchBills} handleClose={handleClose} /> :
            modalMode === 'view' ? <View viewData={selectedData} handleClose={handleClose} /> :
            modalMode === 'delete' ? <Delete deleteId={selectedData?._id} handleDelete={fetchBills} handleClose={handleClose} /> : null
          }
        />
      </Box>
    </Layout>
  );
};

export default BillPage;