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
import ViewPayroll from "@/components/Payroll/View/View";
import CreatePayroll from "@/components/Payroll/Create/Create";
import EditPayroll from "@/components/Payroll/Edit/Edit";
import DeletePayroll from "@/components/Payroll/Delete/Delete";
import Search from "@/components/Search/Search";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const Payroll = () => {
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
    { id: "si", label: "SI.No", flex: 1, align: "center" },
    { id: "employeeId", label: "Employee ID", flex: 1, align: "center" },
    { id: "fullName", label: "Full Name", flex: 1, align: "center" },
    { id: "workDays", label: "Work Days", flex: 1, align: "center" },
    { id: "monthYear", label: "Month/Year", flex: 1, align: "center" },
    { id: "basicSalary", label: "Basic Salary", flex: 1, align: "center" },
    { id: "bonus", label: "Bonus", flex: 1, align: "center" },
    { id: "totalSalary", label: "Total Salary", flex: 1, align: "center" },
    { id: "status", label: "Status", flex: 1, align: "center" },
    { id: "action", label: "Action", flex: 1, align: "center" },
  ];

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await fetch(`${Base_url}/payroll`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.status === "success") {
          setLoading(false);
          const formattedData = result.data.map((item, index) =>
            createData(
              index + 1,
              item,
              item.employeeId,
              `${item.firstName} ${item.lastName}`,
              item.workDays,
              `${item.month}/${item.year}`,
              item.basicSalary,
              item.bonus,
              item.totalSalary,
              item.status
            )
          );
          setRows(formattedData);
          setFilteredRows(formattedData);
        }
      } catch (error) {
        console.error("Error fetching payroll data:", error);
        toast.error("Failed to fetch payroll data");
      }
    };

    if (loading) {
      fetchPayrollData();
    }
  }, [loading]);

  const createData = (
    si,
    row,
    employeeId,
    fullName,
    workDays,
    monthYear,
    basicSalary,
    bonus,
    totalSalary,
    status
  ) => ({
    si,
    row,
    employeeId,
    fullName,
    workDays,
    monthYear,
    basicSalary,
    bonus,
    totalSalary,
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
        row.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.monthYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.totalSalary.toString().includes(searchTerm)
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
    fetch(`${Base_url}/payroll/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === "success") {
          toast.success("Payroll deleted successfully!");
          setLoading(true);
        } else {
          toast.error(res.message || "Delete failed");
        }
        setIsDeleting(false);
        handleClose();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("Error deleting payroll");
        setIsDeleting(false);
      });
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
  };

  const handleCreate = () => {
    setLoading(true); // trigger reload
    setOpenData(false);
  };

  const handleUpdate = () => {
    setLoading(true); // trigger reload
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
    <>
      <Layout>
        <ToastContainer />
        <Box className="container">
          <Search
            onSearch={(term) => setSearchTerm(term)}
            onAddClick={onAddClick}
            buttonText="Add Payroll"
          />

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="payroll table">
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
                        <TableRow hover role="checkbox" key={idx}>
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
                ? "Create New Payroll"
                : viewShow
                ? "View Payroll"
                : editShow
                ? "Edit Payroll"
                : deleteShow
                ? "Delete Payroll"
                : ""
            }
            dialogContent={
              openData ? (
                <CreatePayroll handleCreate={handleCreate} handleClose={handleClose} />
              ) : viewShow ? (
                <ViewPayroll viewData={viewData} />
              ) : editShow ? (
                <EditPayroll
                  editData={editData}
                  handleUpdate={handleUpdate}
                  handleClose={handleClose}
                />
              ) : deleteShow ? (
                <DeletePayroll
                  handleDelete={handleDelete}
                  isDeleting={isDeleting}
                  handleClose={handleClose}
                />
              ) : null
            }
          />
        </Box>
      </Layout>
    </>
  );
};

export default Payroll;
