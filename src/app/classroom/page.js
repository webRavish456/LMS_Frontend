'use client';

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination,
  Box, IconButton, Chip, Button, Stack, Typography, Tooltip, Dialog, DialogContent, DialogTitle, TextField
} from "@mui/material";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "@/components/Layout";

// ---------------- Search Component ----------------
const Search = ({ onSearch }) => {
  const [term, setTerm] = useState("");
  return (
    <Stack direction="row" spacing={1}>
      <input
        type="text"
        placeholder="Search..."
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          onSearch(e.target.value);
        }}
        style={{
          flex: 1,
          padding: "6px 8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
    </Stack>
  );
};

// ---------------- Create / Edit / View / Delete Dialogs ----------------
const CreateEditDialog = ({ open, onClose, onSave, feature }) => {
  const [data, setData] = useState(feature || { title: "", description: "", status: "Active" });

  const handleSave = () => {
    if (!data.title.trim()) {
      toast.error("Feature title is required!");
      return;
    }
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{feature ? "Edit Feature" : "Add Feature"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Feature Title"
          fullWidth
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
        <TextField
          label="Status"
          fullWidth
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
        />
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {feature ? "Update" : "Save"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const ViewDialog = ({ open, onClose, feature }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>View Feature</DialogTitle>
    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Typography><strong>Feature:</strong> {feature?.title}</Typography>
      <Typography><strong>Description:</strong> {feature?.description}</Typography>
      <Typography><strong>Status:</strong> {feature?.status}</Typography>
    </DialogContent>
  </Dialog>
);

const DeleteDialog = ({ open, onClose, onConfirm, feature }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent sx={{ textAlign: "center", mt: 2 }}>
      <Typography>Are you sure you want to delete <strong>{feature?.title}</strong>?</Typography>
      <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>Delete</Button>
      </Stack>
    </DialogContent>
  </Dialog>
);

// ---------------- Main Page ----------------
const VirtualClassroomIntegration = () => {
  const [features, setFeatures] = useState([
    {
      id: 1,
      title: "Live video classes with attendance tracking",
      description: "Teachers can host live video sessions and attendance is automatically recorded.",
      status: "Active",
    },
    {
      id: 2,
      title: "Real-time polls, Q&A, breakout rooms",
      description: "Interactive tools like polls, Q&A sessions, and breakout rooms for discussions.",
      status: "Active",
    },
    {
      id: 3,
      title: "Session recording and playback",
      description: "All sessions are recorded and made available for later playback.",
      status: "Active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState(features);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreateEdit, setOpenCreateEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const result = features.filter(f =>
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(result);
  }, [searchTerm, features]);

  const handleSave = (feature) => {
    if (selected) {
      setFeatures(prev => prev.map(f => f.id === selected.id ? { ...feature, id: selected.id } : f));
      toast.success("Feature updated successfully!");
    } else {
      setFeatures(prev => [...prev, { ...feature, id: prev.length + 1 }]);
      toast.success("Feature added successfully!");
    }
    setOpenCreateEdit(false);
    setSelected(null);
  };

  const handleDeleteConfirm = () => {
    setFeatures(prev => prev.filter(f => f.id !== selected.id));
    toast.success("Feature deleted successfully!");
    setOpenDelete(false);
  };

  return (
    <Layout>
      <Box p={2} sx={{ backgroundColor: "#e6f2ff", minHeight: "100vh" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Virtual Classroom Integration</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all virtual classroom features
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Search onSearch={setSearchTerm} />
            <Chip label={`${filtered.length} results`} color="primary" />
            <Button variant="contained" onClick={() => setOpenCreateEdit(true)}>Add Feature</Button>
          </Stack>
        </Stack>

        <Paper sx={{ mt: 1, p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SI.No</TableCell>
                <TableCell>Feature</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((f, i) => (
                <TableRow key={f.id}>
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{f.title}</TableCell>
                  <TableCell>{f.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={f.status}
                      color={f.status === "Active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View"><IconButton onClick={() => { setSelected(f); setOpenView(true); }}><VisibilityIcon /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton onClick={() => { setSelected(f); setOpenCreateEdit(true); }}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton onClick={() => { setSelected(f); setOpenDelete(true); }}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No Features Found</TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={filtered.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(+e.target.value);
                    setPage(0);
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>

        {/* Dialogs */}
        {openCreateEdit && (
          <CreateEditDialog
            open={openCreateEdit}
            onClose={() => { setOpenCreateEdit(false); setSelected(null); }}
            onSave={handleSave}
            feature={selected}
          />
        )}
        {openView && (
          <ViewDialog open={openView} onClose={() => setOpenView(false)} feature={selected} />
        )}
        {openDelete && (
          <DeleteDialog
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            onConfirm={handleDeleteConfirm}
            feature={selected}
          />
        )}
      </Box>
    </Layout>
  );
};

export default VirtualClassroomIntegration;
