'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination,
  Box, IconButton, Chip, Button, Stack, Typography, Tooltip
} from "@mui/material";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Import your modals
import Create from "@/components/Branch/Create/Create";
import Edit from "@/components/Branch/Edit/Edit";
import View from "@/components/Branch/View/View";
import Delete from "@/components/Branch/Delete/Delete";
import Layout from "@/components/Layout";

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
        <Button variant="contained" onClick={handleClick} size="small">
          {buttonText}
        </Button>
      )}
    </Stack>
  );
};

// ---------------- BranchPage ----------------
const BranchPage = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const searchTimerRef = useRef(null);

  // Fetch branches from backend
  const fetchBranches = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }
      
      const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
      
      const res = await fetch(`${Base_url}/branch`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (res.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
        setLoading(false);
        return;
      }
      
      if (!res.ok) {
        throw new Error(`Failed to fetch branches: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Handle different API response structures
      if (data.status === "success" && data.data) {
        setBranches(data.data);
      } else if (Array.isArray(data)) {
        setBranches(data);
      } else if (data.branches) {
        setBranches(data.branches);
      } else {
        console.error("Unexpected API response:", data);
        toast.error("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
      toast.error(err.message || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBranches();
  }, []);

  // Filter branches when search term changes
  useEffect(() => {
    const filtered = branches.filter(
      (b) =>
        (b.branchName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.branchId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBranches(filtered);
    setPage(0);
  }, [searchTerm, branches]);

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

  const handleCreate = (newBranch) => {
    // If newBranch is a boolean (true), refresh from server
    if (typeof newBranch === "boolean" && newBranch === true) {
      fetchBranches();
    } else if (newBranch && typeof newBranch === "object") {
      // If newBranch is an object, add it to the list
      setBranches(prev => [newBranch, ...prev]);
    }
    setCreateOpen(false);
  };

  const handleView = (branch) => {
    setViewData(branch);
    setViewOpen(true);
  };

  const handleEdit = (branch) => {
    setEditData(branch);
    setEditOpen(true);
  };

  const handleUpdate = (updatedBranch) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
    setEditOpen(false);
    toast.success("Branch updated successfully!");
  };

  const handleDelete = (branch) => {
    setDeleteData(branch);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setBranches(prev => prev.filter(b => b.id !== deleteData.id));
    setDeleteOpen(false);
    toast.success("Branch deleted successfully!");
  };

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
      return new Intl.DateTimeFormat(undefined, { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      }).format(date);
    } catch {
      return d;
    }
  };

  return (
    <Layout>
      <Box p={2} sx={{ backgroundColor: "#cce0ff", minHeight: "100vh" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Branch Management</Typography>
            <Typography variant="body2" color="text.secondary">
              Total branches: <strong>{branches.length}</strong>
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
            <Box sx={{ minWidth: 240, width: { xs: "100%", sm: 300 } }}>
              <Search onSearch={handleSearchDebounced} buttonText="" />
            </Box>

            <Chip label={`${filteredBranches.length} results`} color="primary" />
            <Button variant="contained" onClick={() => setCreateOpen(true)}>Add Branch</Button>
          </Stack>
        </Stack>

        <Paper sx={{ mt: 1, p: 1 }}>
          {loading ? (
            <Box p={3} textAlign="center">
              <Typography>Loading branches...</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SI.No</TableCell>
                  <TableCell>Branch ID</TableCell>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Contact Info</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBranches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((branch, idx) => (
                  <TableRow key={branch.id || branch._id || idx}>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{branch.branchId}</TableCell>
                    <TableCell>{branch.branchName}</TableCell>
                    <TableCell>{branch.location}</TableCell>
                    <TableCell>{branch.contact || "-"}</TableCell>
                    <TableCell>
                      <Chip 
                        label={branch.status || "Active"} 
                        color={branch.status === "Active" ? "success" : "default"} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{formatDate(branch.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton onClick={() => handleView(branch)}><VisibilityIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(branch)}><EditIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(branch)}><DeleteIcon /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredBranches.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No Branches Found</TableCell>
                  </TableRow>
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5,10,25]}
                    count={filteredBranches.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Rows per page:"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          )}
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

export default BranchPage;