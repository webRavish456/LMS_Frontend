"use client";
import * as React from "react";
import Layout from "@/components/Layout";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionIcon from "@mui/icons-material/Description";

// Function to create attendance data
function createData(id, userId, date, punchedIn, punchedOut, requestType, totalHours, status) {
  return { id, userId, date, punchedIn, punchedOut, requestType, totalHours, status };
}

export default function AttendanceRequest() {
  const [rows, setRows] = React.useState([]); // Empty table initially
  const [search, setSearch] = React.useState("");

  // Actions Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleMenuClick = (event, rowIndex) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowIndex);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleApprove = () => {
    if (selectedRow !== null) {
      const updatedRows = [...rows];
      updatedRows[selectedRow].status = "Approved";
      setRows(updatedRows);
    }
    handleMenuClose();
  };

  const handleReject = () => {
    if (selectedRow !== null) {
      const updatedRows = [...rows];
      updatedRows[selectedRow].status = "Rejected";
      setRows(updatedRows);
    }
    handleMenuClose();
  };

  // Add Attendance Dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newData, setNewData] = React.useState({
    userId: "",
    date: "",
    punchedIn: "",
    punchedOut: "",
    requestType: "new",
    totalHours: "",
    status: "Pending",
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewData({
      userId: "",
      date: "",
      punchedIn: "",
      punchedOut: "",
      requestType: "new",
      totalHours: "",
      status: "Pending",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleSave = () => {
    if (!newData.userId || !newData.date || !newData.punchedIn || !newData.punchedOut || !newData.totalHours) {
      alert("Please fill all fields!");
      return;
    }
    const newRow = createData(
      rows.length + 1, // Attendance ID
      newData.userId,
      newData.date,
      newData.punchedIn,
      newData.punchedOut,
      newData.requestType,
      newData.totalHours,
      newData.status
    );
    setRows([...rows, newRow]);
    handleCloseDialog();
  };

  // Filtered rows by search
  const filteredRows = rows.filter((row) =>
    row.userId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Search + Add Button */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} mb={2}>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "blue",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#0047ab" },
          }}
        >
          Add Attendance
        </Button>
      </Box>

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Attendance ID</b></TableCell>
              <TableCell><b>User ID</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Punch In Time</b></TableCell>
              <TableCell><b>Punch Out Time</b></TableCell>
              <TableCell><b>Total Hours</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Attendance Request</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.punchedIn}</TableCell>
                <TableCell>{row.punchedOut}</TableCell>
                <TableCell>{row.totalHours}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={
                      row.status === "Pending"
                        ? "warning"
                        : row.status === "Approved"
                        ? "success"
                        : "error"
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {row.requestType}{" "}
                  <DescriptionIcon sx={{ fontSize: 16, ml: 1, color: "#1976d2" }} />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={(e) => handleMenuClick(e, index)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Attendance Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle><b>Add Attendance</b></DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="User ID"
              name="userId"
              value={newData.userId}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={newData.date}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Punch In Time"
              name="punchedIn"
              type="datetime-local"
              value={newData.punchedIn}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Punch Out Time"
              name="punchedOut"
              type="datetime-local"
              value={newData.punchedOut}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Total Hours"
              name="totalHours"
              value={newData.totalHours}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Attendance Request"
              name="requestType"
              value={newData.requestType}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Status"
              name="status"
              value={newData.status}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleApprove}>Approve</MenuItem>
        <MenuItem onClick={handleReject}>Reject</MenuItem>
      </Menu>
    </Layout>
  );
}
