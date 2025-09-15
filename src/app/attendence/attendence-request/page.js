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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionIcon from "@mui/icons-material/Description";

// Dummy data row function
function createData(id, profile, punchedIn, punchedOut, requestType, totalHours, status) {
  return { id, profile, punchedIn, punchedOut, requestType, totalHours, status };
}

export default function AttendanceRequest() {
  const [rows, setRows] = React.useState([
    createData(1, "kundan (HR)", "2025-08-20 00:00:00", "2025-08-21 00:00:00", "new", "24h 0m 0s", "Pending"),
    createData(2, "Akash kumar", "2025-08-20 00:00:00", "2025-08-21 00:00:00", "new", "24h 0m 0s", "Pending"),
    createData(3, "Arjun singh", "2025-07-30 00:00:00", "2025-09-05 00:00:00", "new", "888h 0m 0s", "Pending"),
  ]);

  const [search, setSearch] = React.useState("");

  // ✅ Filter rows
  const filteredRows = rows.filter((row) =>
    row.profile.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Actions Menu
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
    const updatedRows = [...rows];
    updatedRows[selectedRow].status = "Approved";
    setRows(updatedRows);
    handleMenuClose();
  };

  const handleReject = () => {
    const updatedRows = [...rows];
    updatedRows[selectedRow].status = "Rejected";
    setRows(updatedRows);
    handleMenuClose();
  };

  // ✅ Add button ka kaam — new dummy row add karega
  const handleAdd = () => {
    const newRow = createData(
      rows.length + 1,
      "New User (HR)",
      new Date().toISOString().slice(0, 19).replace("T", " "),
      new Date().toISOString().slice(0, 19).replace("T", " "),
      "new",
      "8h 0m 0s",
      "Pending"
    );
    setRows([...rows, newRow]);
  };

  return (
    <Layout>
      {/* Search + Add Button (side by side, right aligned) */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} mb={2}>
        {/* Search box */}
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Add button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
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
              <TableCell><b>PROFILE</b></TableCell>
              <TableCell><b>PUNCHED IN</b></TableCell>
              <TableCell><b>PUNCHED OUT</b></TableCell>
              <TableCell><b>REQUEST TYPE</b></TableCell>
              <TableCell><b>TOTAL HOURS</b></TableCell>
              <TableCell><b>STATUS</b></TableCell>
              <TableCell><b>ACTIONS</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>
                  <b style={{ color: "black", cursor: "pointer" }}>
                    {row.profile}
                  </b><br />
                  {row.profile === "kundan (HR)" && (
                    <span style={{ color: "gray", fontSize: "0.85em" }}>Human Resource</span>
                  )}
                </TableCell>
                <TableCell>{row.punchedIn}</TableCell>
                <TableCell>{row.punchedOut}</TableCell>
                <TableCell>
                  {row.requestType} <DescriptionIcon sx={{ fontSize: 16, ml: 1, color: "#1976d2" }} />
                </TableCell>
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
                  <IconButton size="small" onClick={(e) => handleMenuClick(e, index)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
