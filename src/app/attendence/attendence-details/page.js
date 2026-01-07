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
import CommonDialog from "@/components/CommonDialog/CommonDialog";

const CreateAttendanceDetails = ({ handleCreate, handleClose }) => {
  const [data, setData] = React.useState({
    userId: "",
    date: "",
    punchedIn: "",
    punchedOut: "",
    totalHours: "",
    requestType: "New",
    status: "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSave = () => {
    if (!data.userId || !data.date || !data.punchedIn || !data.punchedOut || !data.totalHours) {
      alert("Please fill all fields!");
      return;
    }
    handleCreate(data);
    handleClose();
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField label="User ID" name="userId" value={data.userId} onChange={handleChange} fullWidth />
      <TextField
        label="Date"
        name="date"
        type="date"
        value={data.date}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Punch In Time"
        name="punchedIn"
        type="datetime-local"
        value={data.punchedIn}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Punch Out Time"
        name="punchedOut"
        type="datetime-local"
        value={data.punchedOut}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Total Hours"
        name="totalHours"
        value={data.totalHours}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Attendance Request"
        name="requestType"
        value={data.requestType}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Status"
        name="status"
        value={data.status}
        onChange={handleChange}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

function createData(attendanceId, userId, date, punchedIn, punchedOut, requestType, totalHours, status) {
  return { attendanceId, userId, date, punchedIn, punchedOut, requestType, totalHours, status };
}

export default function AttendanceDetails() {
  const [rows, setRows] = React.useState([
    createData(1, "kundan", "2025-10-22", "09:00 AM", "05:00 PM", "Leave", "8h", "Pending"),
    createData(2, "Raj", "2025-10-22", "10:00 AM", "06:00 PM", "WFH", "7h", "Approved"),
  ]);
  const [search, setSearch] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openData, setOpenData] = React.useState(false);

  const handleAdd = (data) => {
    const newRow = createData(
      rows.length + 1,
      data.userId,
      data.date,
      data.punchedIn,
      data.punchedOut,
      data.requestType,
      data.totalHours,
      data.status
    );
    setRows([...rows, newRow]);
  };

  const handleOpenDialog = () => setOpenData(true);
  const handleCloseDialog = () => setOpenData(false);

  const filteredRows = rows.filter((row) => row.userId.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Attendance ID</b></TableCell>
              <TableCell><b>User ID</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Punch In</b></TableCell>
              <TableCell><b>Punch Out</b></TableCell>
              <TableCell><b>Total Hours</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Attendance Request</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.attendanceId}>
                <TableCell>{row.attendanceId}</TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.punchedIn}</TableCell>
                <TableCell>{row.punchedOut}</TableCell>
                <TableCell>{row.totalHours}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={row.status === "Pending" ? "warning" : row.status === "Approved" ? "success" : "error"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{row.requestType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CommonDialog
        open={openData}
        onClose={handleCloseDialog}
        dialogTitle="Create Attendance"
        dialogContent={
          <CreateAttendanceDetails handleCreate={handleAdd} handleClose={handleCloseDialog} />
        }
      />
    </Layout>
  );
}
