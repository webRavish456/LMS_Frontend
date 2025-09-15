"use client";

import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  IconButton,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";

import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const LeaveRequest = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [viewShow, setViewShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const columns = [
    { id: "Name", label: "Name", align: "center" },
    { id: "dateTime", label: "Date & Time", align: "center" },
    { id: "leaveDuration", label: "Leave Duration", align: "center" },
    { id: "leaveType", label: "Leave Type", align: "center" },
    { id: "attachments", label: "Attachments", align: "center" },
    { id: "status", label: "Status", align: "center" },
    { id: "activity", label: "Activity", align: "center" },
    { id: "actions", label: "Actions", align: "center" },
  ];

  // --- Dummy Data ---
  useEffect(() => {
    const dummyData = [
      {
        name: "Abhishek",
        _id: "1",
        date: "2025-05-10",
        duration: "1 day",
        leaveType: "Paid Casual",
        status: "Rejected",
      },
      {
        name: "Pankaj",
        _id: "2",
        date: "2025-01-06",
        duration: "1 day",
        leaveType: "Paid Casual",
        status: "Rejected",
      },
      {
        name: "Rahul",
        _id: "3",
        date: "2024-11-27",
        duration: "3 days",
        leaveType: "Paid Sick",
        status: "Approved",
      },
    ];

    const formattedData = dummyData.map((item) => createData(item));
    setRows(formattedData);
    setFilteredRows(formattedData);
  }, []);

  // Format Row Data
  const createData = (item) => ({
    Name: item.name,
    dateTime: item.date,
    leaveDuration: item.duration,
    leaveType: item.leaveType,
    attachments: (
      <IconButton
        size="small"
        color="primary"
        onClick={() => {
          const link = document.createElement("a");
          link.href = "/sample.pdf";
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.click();
        }}
      >
        <PictureAsPdfIcon />
      </IconButton>
    ),
    status: (
      <Chip
        label={item.status}
        color={
          item.status.toLowerCase() === "approved"
            ? "success"
            : item.status.toLowerCase() === "rejected"
            ? "error"
            : "warning"
        }
        size="small"
      />
    ),
    activity: (
      <Chip
        label={item.status === "Approved" ? "Done" : "Pending"}
        color={item.status === "Approved" ? "success" : "default"}
        size="small"
      />
    ),
    actions: (
      <IconButton
        color="primary"
        size="small"
        onClick={(e) => handleMenuOpen(e, item)}
      >
        <MoreVertIcon />
      </IconButton>
    ),
  });

  // --- Search filter ---
  useEffect(() => {
    const filtered = rows.filter(
      (row) =>
        row.dateTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.leaveDuration.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleView = (data) => {
    setViewData(data);
    setViewShow(true);
    handleMenuClose();
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
    handleMenuClose();
  };

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Layout>
      <ToastContainer />
      <Box className="container">
        {/* Search + Apply Button */}
        <Search
          onSearch={(term) => setSearchTerm(term)}
          buttonText="Apply Leave"
          onAddClick={() => toast.info("Apply Leave Clicked")}
        />

        {/* Table */}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align}
                      style={{ fontWeight: 700 }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, idx) => (
                      <TableRow hover key={idx}>
                        {columns.map((col) => (
                          <TableCell key={col.id} align={col.align}>
                            {row[col.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 25, 100]}
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Menu (3 dots options) */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleView(selectedRow)}>Approve</MenuItem>
          <MenuItem onClick={() => handleDelete(selectedRow?._id)}>
            Reject
          </MenuItem>
        </Menu>

        {/* Dialog */}
        <CommonDialog
          open={viewShow || deleteShow}
          onClose={() => {
            setViewShow(false);
            setDeleteShow(false);
          }}
          dialogTitle={viewShow ? "View Leave" : deleteShow ? "Delete Leave" : ""}
          dialogContent={
            viewShow ? (
              <pre>{JSON.stringify(viewData, null, 2)}</pre>
            ) : deleteShow ? (
              <p>Are you sure you want to delete this leave request?</p>
            ) : null
          }
        />
      </Box>
    </Layout>
  );
};

export default LeaveRequest;
