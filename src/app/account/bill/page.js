"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  IconButton,
  Typography,
  Stack,
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
import CreateBill from "@/components/Account/Bill/Create/Create";
import EditBill from "@/components/Account/Bill/Edit/Edit";
import ViewBill from "@/components/Account/Bill/View/View";
import DeleteBill from "@/components/Account/Bill/Delete/Delete";

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalMode, setModalMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  /* ===== FETCH BILLS ===== */
  const fetchBills = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/bill`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // ✅ ALWAYS SET ARRAY (NO EMPTY MESSAGE)
      const list = Array.isArray(data?.data) ? data.data : [];
      setBills(list);
      setFilteredBills(list);
    } catch (error) {
      toast.error("Failed to load bills");
      setBills([]);
      setFilteredBills([]);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  /* ===== SEARCH ===== */
  useEffect(() => {
    const filtered = bills.filter((bill) =>
      bill?.billName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBills(filtered);
    setPage(0);
  }, [searchTerm, bills]);

  const handleClose = () => {
    setModalMode(null);
    setSelectedData(null);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box p={3}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Bill Management
        </Typography>

        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setModalMode("create")}
          buttonText="Add Bill"
        />

        <Paper sx={{ mt: 3, borderRadius: "12px", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>
                    SI.No
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>
                    Bill Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>
                    Amount (₹)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredBills
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((bill, idx) => (
                    <TableRow key={bill._id} hover>
                      <TableCell align="center">
                        {page * rowsPerPage + idx + 1}
                      </TableCell>
                      <TableCell align="center">{bill.billName}</TableCell>
                      <TableCell align="center">₹{bill.amount}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedData(bill);
                              setModalMode("view");
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              setSelectedData(bill);
                              setModalMode("edit");
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelectedData(bill);
                              setModalMode("delete");
                            }}
                          >
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
            count={filteredBills.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </Paper>

        {/* ===== MODAL ===== */}
        <CommonDialog
          open={!!modalMode}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { minHeight: "50vh", borderRadius: "15px" } }}
          dialogTitle={
            <Typography component="span" variant="h6" fontWeight={700}>
              {modalMode === "create"
                ? "Add New Bill"
                : modalMode === "edit"
                ? "Update Bill"
                : modalMode === "view"
                ? "Bill Details"
                : "Delete Bill"}
            </Typography>
          }
          dialogContent={
            modalMode === "create" ? (
              <CreateBill handleCreate={fetchBills} handleClose={handleClose} />
            ) : modalMode === "edit" ? (
              <EditBill editData={selectedData} handleUpdate={fetchBills} handleClose={handleClose} />
            ) : modalMode === "view" ? (
              <ViewBill viewData={selectedData} handleClose={handleClose} />
            ) : modalMode === "delete" ? (
              <DeleteBill deleteId={selectedData?._id} handleDelete={fetchBills} handleClose={handleClose} />
            ) : null
          }
        />
      </Box>
    </Layout>
  );
};

export default BillPage;
