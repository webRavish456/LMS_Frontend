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
  Button,
} from "@mui/material";

import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const LeaveRequest = () => {
  const [rows, setRows] = useState([
    { id: 1, name: "Arjun", date: "2025-09-02", duration: "2 Days", leaveType: "Sick", status: "Approved" },
    { id: 2, name: "Ravi", date: "2025-08-30", duration: "1 Day", leaveType: "Casual", status: "Pending" },
    { id: 3, name: "Sita", date: "2025-08-25", duration: "3 Days", leaveType: "Vacation", status: "Rejected" },
  ]);

  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const isInRange = (itemDate, start, end) => {
    const d = new Date(itemDate);
    return d >= start && d <= end;
  };

  const filterData = (type) => {
    const today = new Date();
    let start, end;

    switch (type) {
      case "today":
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date();
        break;

      case "thisWeek":
        start = new Date();
        start.setDate(today.getDate() - today.getDay());
        end = new Date();
        break;

      case "lastWeek":
        start = new Date();
        start.setDate(today.getDate() - today.getDay() - 7);
        end = new Date();
        end.setDate(today.getDate() - today.getDay() - 1);
        break;

      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      case "thisYear":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;

      default:
        setFilteredData(rows);
        return;
    }

    const result = rows.filter((item) => isInRange(item.date, start, end));
    setFilteredData(result);
  };

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
    { id: "Profile", label: "Profile", align: "center" },
    { id: "dateTime", label: "Date & Time", align: "center" },
    { id: "leaveDuration", label: "Leave Duration", align: "center" },
    { id: "leaveType", label: "Leave Type", align: "center" },
    { id: "attachments", label: "Attachments", align: "center" },
    { id: "status", label: "Status", align: "center" },
    { id: "activity", label: "Activity", align: "center" },
    { id: "actions", label: "Actions", align: "center" },
  ];

  const createData = (item) => ({
    Profile: item.name,
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
        row.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.duration.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered.map((item) => createData(item)));
  }, [searchTerm, rows]);

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
      <h1>Leave Status</h1>

      <ToastContainer />

      {/* Filter Buttons */}
      <div>
        <Button variant="outlined" onClick={() => filterData("today")}>
          Today
        </Button>
        <Button onClick={() => filterData("thisWeek")}>This Week</Button>
        <Button onClick={() => filterData("lastWeek")}>Last Week</Button>
        <Button onClick={() => filterData("thisMonth")}>This Month</Button>
        <Button onClick={() => filterData("lastMonth")}>Last Month</Button>
        <Button onClick={() => filterData("thisYear")}>This Year</Button>
      </div>

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
          <MenuItem onClick={() => toast.success("Approved!")}>Approve</MenuItem>
          <MenuItem onClick={() => toast.error("Rejected!")}>Reject</MenuItem>
        </Menu>

        {/* Dialog */}
        <CommonDialog
          open={false}
          onClose={() => {}}
          dialogTitle=""
          dialogContent={null}
        />
      </Box>
    </Layout>
  );
};

export default LeaveRequest;
