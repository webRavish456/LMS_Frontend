"use client";

import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Box, IconButton, Button, Menu, MenuItem } from "@mui/material";
import Search from "@/components/Search/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const LeaveRequest = () => {
  // Sample data
  const [rows, setRows] = useState([
    { id: 1, dayName: "Monday", name: "Arjun", date: "2025-09-02", duration: "2 Days", leaveType: "Sick", status: "Approved" },
    { id: 2, dayName: "Tuesday", name: "Ravi", date: "2025-09-01", duration: "1 Day", leaveType: "Holiday", status: "Pending" },
    { id: 3, dayName: "Thursday", name: "Anita", date: "2025-08-28", duration: "1 Day", leaveType: "Weekly Holiday", status: "Approved" },
  ]);

  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Table columns
  const columns = [
    { id: "id", label: "ID", align: "center" },
    { id: "dayName", label: "Day Name", align: "center" },
    { id: "actions", label: "Actions", align: "center" },
  ];

  // Map row data to table
  const createData = (item) => ({
    id: item.id,
    dayName: item.dayName,
    actions: (
      <IconButton color="primary" size="small" onClick={(e) => handleMenuOpen(e, item)}>
        <MoreVertIcon />
      </IconButton>
    ),
  });

  // Search filter
  useEffect(() => {
    const filtered = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.dayName.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Menu handlers
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  return (
    <Layout>
      <h1>Leave Requests</h1>
      <ToastContainer />

      {/* Filter Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button onClick={() => setFilteredRows(rows.filter(r => r.leaveType.toLowerCase() === "holiday").map(createData))} sx={{border:"2px solid black" , backgroundColor:"blue", TextColor:"white"}}>Holiday</Button>
        <Button onClick={() => setFilteredRows(rows.filter(r => r.leaveType.toLowerCase() === "weekly holiday").map(createData))}>Weekly Holiday</Button>
        <Button onClick={() => setFilteredRows(rows.filter(r => r.leaveType.toLowerCase() === "sick").map(createData))}>Sick Leave</Button>
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
                    <TableCell key={col.id} align={col.align} style={{ fontWeight: 700 }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
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

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => toast.success("Approved!")}>Approve</MenuItem>
          <MenuItem onClick={() => toast.error("Rejected!")}>Reject</MenuItem>
        </Menu>

        {/* Dialog */}
        <CommonDialog open={false} onClose={() => {}} dialogTitle="" dialogContent={null} />
      </Box>
    </Layout>
  );
};

export default LeaveRequest;
