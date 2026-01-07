'use client'

import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Search from "@/components/Search";
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
import DeleteAllStudent from "@/components/Student/AllStudents/Delete/Delete";
import EditAllStudent from "@/components/Student/AllStudents/Edit/Edit";
import ViewAllStudent from "@/components/Student/AllStudents/View/View";
import CreateAllStudent from "@/components/Student/AllStudents/Create/Create";
import Layout from "@/components/Layout";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllStudents = () => {
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);

  const [ViewData, setViewData] = useState(null);
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
    { id: "studentName", label: "Student Name", align: "center" },
    { id: "gender", label: "Gender", align: "center" },
    { id: "mobileNumber", label: "Mobile Number", align: "center" },
    { id: "emailId", label: "Email Id", align: "center" },
    { id: "dob", label: "DOB", align: "center" },
    { id: "address", label: "Address", align: "center" },
    { id: "enrollmentDate", label: "Enrollment Date", align: "center" },
    { id: "course", label: "Course", align: "center" },
    { id: "status", label: "Status", align: "center" },
    { id: "action", label: "Action", align: "center" },
  ];

  useEffect(() => {
    const fetchAllStudentsData = async () => {
      try {
        const response = await fetch(`${Base_url}/allstudents`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          Cookies.remove("token");
          window.location.href = "/login";
          return;
        }

        const res = await response.json();

        if (res.status === "success") {
          setLoading(false);
          const formattedData = res.data.map((item, index) =>
            createData(
              index + 1,
              item,
              item.studentName,
              item.gender,
              item.mobileNumber,
              item.emailId,
              new Date(item.dob).toLocaleDateString("en-IN"),
              item.address,
              new Date(item.enrollmentDate).toLocaleDateString("en-IN"),
              item.course,
              item.status
            )
          );
          setRows(formattedData);
          setFilteredRows(formattedData);
        }
      } catch (error) {
        console.error("Error fetching all students data:", error);
      }
    };

    if (loading) {
      fetchAllStudentsData();
    }
  }, [loading]);

  const createData = (si, row, studentName, gender, mobileNumber, emailId, dob, address, enrollmentDate, course, status) => ({
    si,
    studentName,
    gender,
    mobileNumber,
    emailId,
    dob,
    address,
    enrollmentDate,
    course,
    status,
    action: (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
      </Box>
    ),
  });

  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(row.mobileNumber).includes(searchTerm) ||
      String(row.enrollmentDate).includes(searchTerm) ||
      row.status?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${Base_url}/allstudents/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (res.status === "success") {
        toast.success("Student data deleted successfully!");
        setLoading(true);
      } else {
        toast.error(res.message);
      }
      handleClose();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
  };

  const handleCreate = (refresh = true) => {
    if (refresh) setLoading(true);
    setOpenData(false);
  };

  const handleUpdate = (refresh = true) => {
    if (refresh) setLoading(true);
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
      <Box sx={{ p: 3 }}>
        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={onAddClick}
          buttonText="Add Student"
        />

        <Paper sx={{ width: "100%", overflow: "hidden", mt: 2, borderRadius: '12px' }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="student table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ fontWeight: 700, backgroundColor: "#f5f5f5" }}
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
            openData ? "Create New Student List" : viewShow ? "View Student List" : editShow ? "Edit Student List" : "Delete Student List"
          }
          dialogContent={
            openData ? (
              <CreateAllStudent handleCreate={handleCreate} handleClose={handleClose} />
            ) : viewShow ? (
              <ViewAllStudent viewData={ViewData} />
            ) : editShow ? (
              <EditAllStudent editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} />
            ) : deleteShow ? (
              <DeleteAllStudent handleDelete={handleDelete} isDeleting={isDeleting} handleClose={handleClose} />
            ) : null
          }
        />
      </Box>
    </Layout>
  );
};

export default AllStudents;