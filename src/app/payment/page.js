'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination,
  Box, Chip, Button, Stack, Typography, IconButton, Tooltip
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

// Layout and Modals
import Layout from "@/components/Layout";
import Create from "@/components/Payment/Create/Create";
import Edit from "@/components/Payment/Edit/Edit";
import View from "@/components/Payment/View/View";
import Delete from "@/components/Payment/Delete/Delete";

// ---------------- Inline Search Component ----------------
const Search = ({ onSearch, buttonText = "Search" }) => {
  const [term, setTerm] = useState("");
  const handleClick = () => onSearch(term);

  return (
    <Stack direction="row" spacing={1}>
      <input
        type="text"
        placeholder="Search..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        style={{
          flex: 1,
          padding: "6px 8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      {buttonText !== "" && (
        <Button variant="contained" onClick={handleClick} size="small">{buttonText}</Button>
      )}
    </Stack>
  );
};

// ---------------- Payment & E-commerce Page ----------------
const PaymentPage = () => {
  const [features, setFeatures] = useState([
    { id: 1, feature: 'Paid courses enrollment' },
    { id: 2, feature: 'Multiple payment gateways integration' },
    { id: 3, feature: 'Coupons, discounts, and subscription plans' },
  ]);

  const [filteredFeatures, setFilteredFeatures] = useState(features);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => setFilteredFeatures(features), [features]);

  useEffect(() => {
    const filtered = features.filter(f =>
      f.feature.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFeatures(filtered);
    setPage(0);
  }, [searchTerm, features]);

  const handleSearchDebounced = useMemo(() => {
    return (term) => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => setSearchTerm(term || ""), 300);
    };
  }, []);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  // -------- Modal Handlers --------
  const handleCreate = (newFeature) => {
    setFeatures(prev => [...prev, { ...newFeature, id: prev.length + 1 }]);
    setCreateOpen(false);
    toast.success("Feature added successfully!");
  };

  const handleView = (feature) => {
    setViewData(feature);
    setViewOpen(true);
  };

  const handleEdit = (feature) => {
    setEditData(feature);
    setEditOpen(true);
  };

  const handleUpdate = (updatedFeature) => {
    setFeatures(prev => prev.map(f => f.id === updatedFeature.id ? updatedFeature : f));
    setEditOpen(false);
    toast.success("Feature updated successfully!");
  };

  const handleDelete = (feature) => {
    setDeleteData(feature);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setFeatures(prev => prev.filter(f => f.id !== deleteData.id));
    setDeleteOpen(false);
    toast.success("Feature deleted successfully!");
  };

  return (
    <Layout>
      <Box p={2} sx={{ backgroundColor: "#fff3e0", minHeight: "100vh" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Payment & E-commerce</Typography>
            <Typography variant="body2" color="text.secondary">
              Total features: <strong>{features.length}</strong>
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
            <Box sx={{ minWidth: 240, width: { xs: "100%", sm: 300 } }}>
              <Search onSearch={handleSearchDebounced} buttonText="" />
            </Box>
            <Chip label={`${filteredFeatures.length} results`} color="primary" />
            <Button variant="contained" onClick={() => setCreateOpen(true)}>Add Feature</Button>
          </Stack>
        </Stack>

        <Paper sx={{ mt: 1, p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SI.No</TableCell>
                <TableCell>Feature</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeatures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((f, idx) => (
                <TableRow key={f.id}>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{f.feature}</TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton onClick={() => handleView(f)}><VisibilityIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(f)}><EditIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(f)}><DeleteIcon /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {filteredFeatures.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">No Features Found</TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5,10,25]}
                  count={filteredFeatures.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Rows per page:"
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>

        {/* Modals */}
        {createOpen && <Create onClose={() => setCreateOpen(false)} onCreate={handleCreate} />}
        {viewOpen && <View data={viewData} onClose={() => setViewOpen(false)} />}
        {editOpen && <Edit data={editData} onClose={() => setEditOpen(false)} onUpdate={handleUpdate} />}
        {deleteOpen && <Delete data={deleteData} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} />}
      </Box>
    </Layout>
  );
};

export default PaymentPage;
