'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination,
  Box, IconButton, Chip, Button, Stack, Typography, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from "@mui/material";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Layout from "@/components/Layout";

// ---------------- Inline Search ----------------
const Search = ({ onSearch }) => {
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
      <Button variant="contained" onClick={handleClick} size="small">
        Search
      </Button>
    </Stack>
  );
};

// ---------------- Main Component ----------------
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Email",
      message: "Course deadline approaching",
      recipients: "All enrolled students",
      status: "Active",
      createdAt: new Date(),
    },
    {
      id: 2,
      type: "SMS",
      message: "Certification renewal reminder",
      recipients: "Certified users",
      status: "Active",
      createdAt: new Date(),
    },
    {
      id: 3,
      type: "In-App",
      message: "New course update available",
      recipients: "Registered learners",
      status: "Inactive",
      createdAt: new Date(),
    },
  ]);

  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const searchTimerRef = useRef(null);

  // Dialog states
  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    type: "",
    message: "",
    recipients: "",
    status: "Active",
  });

  useEffect(() => setFiltered(notifications), [notifications]);

  useEffect(() => {
    const filtered = notifications.filter(
      (n) =>
        n.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.recipients.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filtered);
    setPage(0);
  }, [searchTerm, notifications]);

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

  const handleCreate = () => {
    setNotifications((prev) => [
      ...prev,
      { id: prev.length + 1, ...formData, createdAt: new Date() },
    ]);
    setOpenCreate(false);
    toast.success("Notification added successfully!");
    setFormData({ type: "", message: "", recipients: "", status: "Active" });
  };

  const handleUpdate = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === selectedItem.id ? { ...selectedItem, ...formData } : n))
    );
    setOpenEdit(false);
    toast.success("Notification updated successfully!");
  };

  const handleDelete = () => {
    setNotifications((prev) => prev.filter((n) => n.id !== selectedItem.id));
    setOpenDelete(false);
    toast.success("Notification deleted successfully!");
  };

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return d;
    }
  };

  return (
    <Layout>
      <Box p={2} sx={{ backgroundColor: "#eaf2ff", minHeight: "100vh" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Automated Notifications & Reminders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage Email, SMS, and In-App notifications.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
            <Box sx={{ minWidth: 240, width: { xs: "100%", sm: 300 } }}>
              <Search onSearch={handleSearchDebounced} />
            </Box>
            <Chip label={`${filtered.length} results`} color="primary" />
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => setOpenCreate(true)}
            >
              Add Notification
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Paper sx={{ mt: 1, p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SI.No</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Recipients</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, idx) => (
                  <TableRow key={n.id}>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{n.type}</TableCell>
                    <TableCell>{n.message}</TableCell>
                    <TableCell>{n.recipients}</TableCell>
                    <TableCell>
                      <Chip
                        label={n.status}
                        color={n.status === "Active" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(n.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton
                          onClick={() => {
                            setSelectedItem(n);
                            setOpenView(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            setSelectedItem(n);
                            setFormData(n);
                            setOpenEdit(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => {
                            setSelectedItem(n);
                            setOpenDelete(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Notifications Found
                  </TableCell>
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
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Rows per page:"
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>

        {/* ---------------- Dialogs ---------------- */}

        {/* Create Dialog */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add Notification</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
              <TextField
                select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
                <MenuItem value="In-App">In-App</MenuItem>
              </TextField>

              <TextField
                label="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                fullWidth
              />

              <TextField
                label="Recipients"
                value={formData.recipients}
                onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                fullWidth
              />

              <TextField
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth="sm">
          <DialogTitle>View Notification</DialogTitle>
          <DialogContent dividers>
            {selectedItem && (
              <Stack spacing={1.5}>
                <Typography><strong>Type:</strong> {selectedItem.type}</Typography>
                <Typography><strong>Message:</strong> {selectedItem.message}</Typography>
                <Typography><strong>Recipients:</strong> {selectedItem.recipients}</Typography>
                <Typography><strong>Status:</strong> {selectedItem.status}</Typography>
                <Typography><strong>Created:</strong> {formatDate(selectedItem.createdAt)}</Typography>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenView(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Notification</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
              <TextField
                select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
                <MenuItem value="In-App">In-App</MenuItem>
              </TextField>

              <TextField
                label="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                fullWidth
              />

              <TextField
                label="Recipients"
                value={formData.recipients}
                onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                fullWidth
              />

              <TextField
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>Update</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)} fullWidth maxWidth="xs">
          <DialogTitle>Delete Notification</DialogTitle>
          <DialogContent dividers>
            <Typography>Are you sure you want to delete this notification?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default NotificationsPage;
