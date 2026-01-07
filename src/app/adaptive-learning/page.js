'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Box,
  IconButton,
  Chip,
  Button,
  Stack,
  Typography,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Create from "@/components/Adaptive-Learning/Create/Creat";
import Edit from "@/components/Adaptive-Learning/Edit/Edit";
import View from "@/components/Adaptive-Learning/View/View";
import DeleteDialog from "@/components/Adaptive-Learning/Delete/Delete";
import Layout from "@/components/Layout";

// ---------------- Inline Search Component ----------------
const Search = ({ onSearch, buttonText = "Search" }) => {
  const [term, setTerm] = useState("");

  const handleClick = () => onSearch(term);

  return (
    <Stack direction="row" spacing={1}>
      <input
        type="text"
        placeholder="Search learners or level..."
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

// ---------------- Mock Data ----------------
const seedLearners = [
  {
    id: 1,
    name: "Asha Verma",
    level: "Intermediate",
    recommendedPath: "Algebra → Fractions → Mixed Practice",
    progress: 48,
    status: "Active",
    createdAt: new Date(2024, 6, 12).toISOString(),
  },
  {
    id: 2,
    name: "Rahul Sharma",
    level: "Beginner",
    recommendedPath: "Basics → Arithmetic → Quick Quiz",
    progress: 12,
    status: "Active",
    createdAt: new Date(2024, 9, 3).toISOString(),
  },
  {
    id: 3,
    name: "Sana Khan",
    level: "Advanced",
    recommendedPath: "Advanced Algebra → Challenges",
    progress: 78,
    status: "Inactive",
    createdAt: new Date(2023, 11, 30).toISOString(),
  },
];

// ---------------- Page Component ----------------
const AdaptiveLearningPage = () => {
  const [learners, setLearners] = useState(seedLearners);
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const searchTimerRef = useRef(null);

  useEffect(() => setFilteredLearners(learners), [learners]);

  useEffect(() => {
    const filtered = learners.filter(
      (l) =>
        (l.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.level || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLearners(filtered);
    setPage(0);
  }, [searchTerm, learners]);

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

  // CRUD Handlers
  const handleCreate = (newLearner) => {
    setLearners((prev) => [
      ...prev,
      { ...newLearner, id: prev.length + 1, createdAt: new Date().toISOString() },
    ]);
    setCreateOpen(false);
    toast.success("Learner added successfully!");
  };

  const handleView = (learner) => {
    setViewData(learner);
    setViewOpen(true);
  };

  const handleEdit = (learner) => {
    setEditData(learner);
    setEditOpen(true);
  };

  const handleUpdate = (updatedLearner) => {
    setLearners((prev) =>
      prev.map((l) => (l.id === updatedLearner.id ? updatedLearner : l))
    );
    setEditOpen(false);
    toast.success("Learner updated successfully!");
  };

  const handleDelete = (learner) => {
    setDeleteData(learner);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setLearners((prev) => prev.filter((l) => l.id !== deleteData.id));
    setDeleteOpen(false);
    toast.success("Learner deleted successfully!");
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
      <Box p={2} sx={{ backgroundColor: "#cce0ff", minHeight: "100vh" }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          mb={2}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Adaptive Learning
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total learners: <strong>{learners.length}</strong>
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems="center"
          >
            <Box sx={{ minWidth: 240, width: { xs: "100%", sm: 300 } }}>
              <Search onSearch={handleSearchDebounced} buttonText="" />
            </Box>
            <Chip label={`${filteredLearners.length} results`} color="primary" />
            <Button variant="contained" onClick={() => setCreateOpen(true)}>
              Add Learner
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Paper sx={{ mt: 1, p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SI.No</TableCell>
                <TableCell>Learner Name</TableCell>
                <TableCell>Skill Level</TableCell>
                <TableCell>Recommended Path</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredLearners
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((learner, idx) => (
                  <TableRow key={learner.id}>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{learner.name}</TableCell>
                    <TableCell>{learner.level}</TableCell>
                    <TableCell style={{ maxWidth: 240 }}>
                      {learner.recommendedPath}
                    </TableCell>
                    <TableCell style={{ minWidth: 140 }}>
                      <Stack direction="column" spacing={0.5}>
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                          {learner.progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={learner.progress}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={learner.status || "Unknown"}
                        color={learner.status === "Active" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(learner.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton onClick={() => handleView(learner)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(learner)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(learner)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

              {filteredLearners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No Learners Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={filteredLearners.length}
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
        {createOpen && (
          <Create
            open={createOpen}
            handleClose={() => setCreateOpen(false)}
            handleCreate={handleCreate}
          />
        )}
        {viewOpen && (
          <View
            open={viewOpen}
            handleClose={() => setViewOpen(false)}
            selectedData={viewData}
          />
        )}
        {editOpen && (
          <Edit
            open={editOpen}
            handleClose={() => setEditOpen(false)}
            handleUpdate={handleUpdate}
            selectedData={editData}
          />
        )}
        {deleteOpen && (
          <DeleteDialog
            open={deleteOpen}
            handleClose={() => setDeleteOpen(false)}
            handleDelete={confirmDelete}
            selectedData={deleteData}
          />
        )}
      </Box>
    </Layout>
  );
};

export default AdaptiveLearningPage;
