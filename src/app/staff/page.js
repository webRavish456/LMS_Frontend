"use client";

import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


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
} from "@mui/material";

import CommonDialog from "@/components/CommonDialog/CommonDialog";
import ViewStaff from "@/components/Staff/View/View";
import CreateStaff from "@/components/Staff/Create/Create";
import EditStaff from "@/components/Staff/Edit/Edit";
import DeleteStaff from "@/components/Staff/Delete/Delete";
import Search from "@/components/Search/Search";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const StaffList = () => {
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const columns = [
    { id: "si", label: "SI.No", align: "center" },
    { id: "staffName", label: "Staff Name", align: "center" },
    { id: "designation", label: "Designation", align: "center" },
    { id: "mobile", label: "Mobile No.", align: "center" },
    { id: "email", label: "Email Id", align: "center" },
    { id: "address", label: "Address", align: "center" },
    { id: "salary", label: "Salary", align: "center" },
    { id: "joiningDate", label: "Joining Date", align: "center" },
    { id: "status", label: "Availability Status", align: "center" },
    { id: "action", label: "Actions", align: "center" },
  ];

  // ✅ safer fetch with .json()
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const url = `${Base_url}/staff`;
        console.log("Fetching staff from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();

        if (res.status === "success" && Array.isArray(res.data)) {
          setLoading(false);
          const formattedData = res.data.map((item, index) =>
            createData(
              index + 1,
              item,
              item.staffName,
              item.designation,
              item.mobile,
              item.email,
              item.address,
              item.salary,
              item.joiningDate,
              item.status
            )
          );
          setRows(formattedData);
          setFilteredRows(formattedData);
        } else {
          toast.error(res.message || "Failed to fetch staff data");
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
        toast.error("Error fetching staff data");
      }
    };

    if (loading) {
      fetchStaffData();
    }
  }, [loading]);

  const createData = (
    si,
    row,
    staffName,
    designation,
    mobile,
    email,
    address,
    salary,
    joiningDate,
    status
  ) => ({
    si,
    row,
    staffName,
    designation,
    mobile,
    email,
    address,
    salary,
    joiningDate,
    status,
    action: (
      <>
        <IconButton
          style={{ color: "#072eb0", padding: "4px", transform: "scale(0.8)" }}
          onClick={() => handleView(row)}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          style={{ color: "#6b6666", padding: "4px", transform: "scale(0.8)" }}
          onClick={() => handleEdit(row)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          style={{ color: "#e6130b", padding: "4px", transform: "scale(0.8)" }}
          onClick={() => handleShowDelete(row._id)}
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
  });

  useEffect(() => {
    const filtered = rows.filter(
      (row) =>
        row.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleView = (row) => {
    setViewData(row);
    setViewShow(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setEditShow(true);
  };

  const handleShowDelete = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    fetch(`${Base_url}/staff/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === "success") {
          toast.success("Staff deleted successfully!");
          setLoading(true);
        } else {
          toast.error(res.message || "Failed to delete staff");
        }
        setIsDeleting(false);
        handleClose();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("Delete request failed");
        setIsDeleting(false);
      });
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
  };

  const handleCreate = (data) => {
    setLoading(data);
    setOpenData(false);
  };

  const handleUpdate = (data) => {
    setLoading(data);
    setEditShow(false);
  };

  const onAddClick = () => setOpenData(true);

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
        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={onAddClick}
          buttonText="Add Staff"
        />

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="staff table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ fontWeight: 700 }}
                    >
                      {column.label}
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
                        {columns.map((column) => (
                          <TableCell key={column.id} align={column.align}>
                            {row[column.id]}
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
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openData
              ? "Create New Staff"
              : viewShow
              ? "View Staff"
              : editShow
              ? "Edit Staff"
              : deleteShow
              ? "Delete Staff"
              : ""
          }
          dialogContent={
            openData ? (
              <CreateStaff handleCreate={handleCreate} handleClose={handleClose} />
            ) : viewShow ? (
              <ViewStaff viewData={viewData} />
            ) : editShow ? (
              <EditStaff
                editData={editData}
                handleUpdate={handleUpdate}
                handleClose={handleClose}
              />
            ) : deleteShow ? (
              <DeleteStaff
                handleDelete={handleDelete}
                isDeleting={isDeleting}
                handleClose={handleClose}
              />
            ) : null
          }
        />
      </Box>
    </Layout>
  );
};

export default StaffList;
