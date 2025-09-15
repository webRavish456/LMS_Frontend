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

const CreateAttendanceDetails = ({ handleCreate, handleClose }) => (
  <div>Create Attendance Form</div>
);
const ViewAttendance = ({ viewData }) => <div>Viewing {viewData?.profile}</div>;
const EditAttendance = ({ editData, handleUpdate, handleClose }) => (
  <div>Edit {editData?.profile}</div>
);
const DeleteAttendance = ({ handleDelete, isDeleting, handleClose }) => (
  <div>Deleting... {isDeleting ? "In progress" : "Ready"}</div>
);

function createData(id, profile, punchedIn, punchedOut, requestType, totalHours, status) {
  return { id, profile, punchedIn, punchedOut, requestType, totalHours, status };
}

export default function AttendanceDetails() {
  
  const [rows, setRows] = React.useState([
    createData(1, "kundan (HR)", "09:00 AM", "05:00 PM", "Leave", "8h", "Pending"),
    createData(2, "Raj", "10:00 AM", "06:00 PM", "WFH", "7h", "Approved"),
  ]);
  const [search, setSearch] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [openData, setOpenData] = React.useState(false);
  const [viewShow, setViewShow] = React.useState(false);
  const [editShow, setEditShow] = React.useState(false);
  const [deleteShow, setDeleteShow] = React.useState(false);

  const [viewData, setViewData] = React.useState(null);
  const [editData, setEditData] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

 
  const handleAdd = () => {
    const newRow = createData(
      rows.length + 1,
      "New User (HR)",
      "09:30 AM",
      "06:00 PM",
      "new",
      "8h 0m",
      "Pending"
    );
    setRows([...rows, newRow]);
    setOpenData(true);
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
  };

  const handleUpdate = (data) => {
    console.log("Updating row:", data);
    handleClose();
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      console.log("Deleted successfully!");
      setIsDeleting(false);
      handleClose();
    }, 1000);
  };

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setViewData(rows[index]); 
    setEditData(rows[index]);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleApprove = () => {
    console.log("Approved:", viewData);
    handleMenuClose();
  };

  const handleReject = () => {
    console.log("Rejected:", viewData);
    handleMenuClose();
  };

  
  const filteredRows = rows.filter((row) =>
    row.profile.toLowerCase().includes(search.toLowerCase())
  );

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

     
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>PROFILE</b></TableCell>
              <TableCell><b>Punched In</b></TableCell>
              <TableCell><b>Punched Out</b></TableCell>
              <TableCell><b>Request</b></TableCell>
              <TableCell><b>Total Hours</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>
                  <b style={{ color: "black", cursor: "pointer" }}>
                    {row.profile}
                  </b>
                  <br />
                  {row.profile === "kundan (HR)" && (
                    <span style={{ color: "gray", fontSize: "0.85em" }}>Human Resource</span>
                  )}
                </TableCell>
                <TableCell>{row.punchedIn}</TableCell>
                <TableCell>{row.punchedOut}</TableCell>
                <TableCell>
                  {row.requestType}{" "}
                  <DescriptionIcon sx={{ fontSize: 16, ml: 1, color: "#1976d2" }} />
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

   
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleApprove}>Approve</MenuItem>
        <MenuItem onClick={handleReject}>Reject</MenuItem>
      </Menu>

      
      <CommonDialog
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData
            ? "Create New Attendance"
            : viewShow
            ? "View Attendance"
            : editShow
            ? "Edit Attendance"
            : deleteShow
            ? "Delete Attendance"
            : ""
        }
        dialogContent={
          openData ? (
            <CreateAttendanceDetails handleCreate={handleAdd} handleClose={handleClose} />
          ) : viewShow ? (
            <ViewAttendance viewData={viewData} />
          ) : editShow ? (
            <EditAttendance editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} />
          ) : deleteShow ? (
            <DeleteAttendance handleDelete={handleDelete} isDeleting={isDeleting} handleClose={handleClose} />
          ) : null
        }
      />
    </Layout>
  );
}
