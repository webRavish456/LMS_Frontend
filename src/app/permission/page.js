"use client";

import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import Search from "@/components/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

// Sample Roles & Permissions
const DEFAULT_ROLES = [
  { id: 1, name: "Admin", usersCount: 5, permissions: ["users.manage", "billing.manage"] },
  { id: 2, name: "Editor", usersCount: 10, permissions: ["content.edit"] },
  { id: 3, name: "Viewer", usersCount: 20, permissions: ["content.view"] },
];

const DEFAULT_PERMISSIONS = ["users.manage", "billing.manage", "content.edit", "content.view"];

export default function PermissionsPage() {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Table Columns
  const columns = [
    { id: "id", label: "ID", align: "center" },
    { id: "name", label: "Role Name", align: "center" },
    { id: "usersCount", label: "Users Assigned", align: "center" },
    { id: "permissions", label: "Permissions", align: "center" },
    { id: "actions", label: "Actions", align: "center" },
  ];

  // Map role to table row
  const createData = (item) => ({
    id: item.id,
    name: item.name,
    usersCount: item.usersCount,
    permissions: item.permissions.join(", "),
    actions: (
      <IconButton color="primary" size="small" onClick={(e) => handleMenuOpen(e, item)}>
        <MoreVertIcon />
      </IconButton>
    ),
  });

  // Search filter
  useEffect(() => {
    const filtered = roles.filter((role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered.map(createData));
  }, [searchTerm, roles]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  // Actions Menu
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
      <h1>Roles & Permissions</h1>
      <ToastContainer />

      {/* Filter Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button
          onClick={() =>
            setFilteredRows(roles.filter((r) => r.name.toLowerCase() === "admin").map(createData))
          }
          sx={{ border: "2px solid black", backgroundColor: "blue", color: "white", mr: 1 }}
        >
          Admin
        </Button>
        <Button
          onClick={() =>
            setFilteredRows(roles.filter((r) => r.name.toLowerCase() === "editor").map(createData))
          }
          sx={{ mr: 1 }}
        >
          Editor
        </Button>
        <Button
          onClick={() =>
            setFilteredRows(roles.filter((r) => r.name.toLowerCase() === "viewer").map(createData))
          }
        >
          Viewer
        </Button>
      </div>

      <Box className="container">
        {/* Search + Add Role Button */}
        <Search
          onSearch={(term) => setSearchTerm(term)}
          buttonText="Add Role"
          onAddClick={() => toast.info("Add Role Clicked")}
        />

        {/* Roles Table */}
        <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
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
            rowsPerPageOptions={[10, 25, 50]}
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Actions Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => toast.success("Role Edited!")}>Edit</MenuItem>
          <MenuItem onClick={() => toast.error("Role Deleted!")}>Delete</MenuItem>
        </Menu>

        {/* Dialog */}
        <CommonDialog open={false} onClose={() => {}} dialogTitle="" dialogContent={null} />
      </Box>
    </Layout>
  );
}
