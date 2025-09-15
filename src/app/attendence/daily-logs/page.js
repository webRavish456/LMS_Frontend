"use client";
import * as React from "react";
import Layout from "@/components/Layout"; // ✅ Sidebar Layout
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";

// Row creation function
function createData(profile, punchedIn, punchedOut, behavior, breakTime, totalHours, entry) {
  return { profile, punchedIn, punchedOut, behavior, breakTime, totalHours, entry };
}

export default function AttendanceTable() {
  const [rows, setRows] = React.useState([
    createData("Arjun Singh", "09:00 AM", "06:00 PM", "Good", "01:00 hr", "08:00 hr", "Manual"),
    createData("Rahul Kumar", "09:30 AM", "06:30 PM", "Average", "00:30 hr", "08:30 hr", "Auto"),
    createData("Priya Sharma", "10:00 AM", "07:00 PM", "Excellent", "00:45 hr", "08:15 hr", "Manual"),
  ]);

  const [search, setSearch] = React.useState("");

  // Delete row
  const handleDelete = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  // Add new dummy row
  const handleAdd = () => {
    const newRow = createData("New User", "09:15 AM", "06:15 PM", "Good", "00:50 hr", "08:10 hr", "Manual");
    setRows([...rows, newRow]);
  };

  // Filtered rows based on search
  const filteredRows = rows.filter((row) =>
    row.profile.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Top bar: Search left, Button right */}
      <Box display="flex" alignItems="center" justifyContent="right" gap="20px" mb={2}>
        {/* Search box */}
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton size="small">
                <SearchIcon /> {/* ✅ Magnifying glass icon */}
              </IconButton>
            ),
          }}
          sx={{
            backgroundColor: "white",
            borderRadius: "6px",
            width: "250px",
          }}
        />

        {/* Add Attendance button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            backgroundColor: "#0d1b75", // ✅ Dark blue like screenshot
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            px: 3,
            borderRadius: "6px",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#091357" },
            
          }}
        >
          Add Attendance
        </Button>
      </Box>

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center"><b>Profile</b></TableCell>
              <TableCell align="center"><b>Punched In</b></TableCell>
              <TableCell align="center"><b>Punched Out</b></TableCell>
              <TableCell align="center"><b>Behavior</b></TableCell>
              <TableCell align="center"><b>Break Time</b></TableCell>
              <TableCell align="center"><b>Total Hours</b></TableCell>
              <TableCell align="center"><b>Entry</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.profile}</TableCell>
                  <TableCell align="center">{row.punchedIn}</TableCell>
                  <TableCell align="center">{row.punchedOut}</TableCell>
                  <TableCell align="center">{row.behavior}</TableCell>
                  <TableCell align="center">{row.breakTime}</TableCell>
                  <TableCell align="center">{row.totalHours}</TableCell>
                  <TableCell align="center">{row.entry}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="success">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
