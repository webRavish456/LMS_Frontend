"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout"; 
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Search from "@/components/Search/Search";
import { toast, ToastContainer } from "react-toastify";
import CommonDialog from "@/components/CommonDialog/CommonDialog";

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

import ViewVideoClass from "@/components/Video-Class/Recorded-Class/View/View";
import CreateVideoClass from "@/components/Video-Class/Recorded-Class/Create/Create";
import EditVideoClass from "@/components/Video-Class/Recorded-Class/Edit/Edit";
import DeleteVideoClass from "@/components/Video-Class/Recorded-Class/Delete/Delete";

const RecordedClass = () => {
  // Dialog open states
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);

  // Data states
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dummy Recorded Class Data
  const initialData = [
    {
      _id: "r1",
      studentName: "Rahul Kumar",
      enrollmentNo: "ENR001",
      subjectName: "Physics",
      teacherName: "Mrs. Verma",
    },
    {
      _id: "r2",
      studentName: "Anita Sharma",
      enrollmentNo: "ENR002",
      subjectName: "Chemistry",
      teacherName: "Mr. Singh",
    },
    {
      _id: "r3",
      studentName: "Suresh Patel",
      enrollmentNo: "ENR003",
      subjectName: "Mathematics",
      teacherName: "Ms. Gupta",
    },
    {
      _id: "r4",
      studentName: "Pooja Joshi",
      enrollmentNo: "ENR004",
      subjectName: "Biology",
      teacherName: "Dr. Nair",
    },
    {
      _id: "r5",
      studentName: "Vikram Singh",
      enrollmentNo: "ENR005",
      subjectName: "Computer Science",
      teacherName: "Ms. Iyer",
    },
    {
      _id: "r6",
      studentName: "Neha Kaur",
      enrollmentNo: "ENR006",
      subjectName: "English",
      teacherName: "Mr. Malhotra",
    },
  ];

  // States for rows and filtering
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Table columns
  const columns = [
    { id: "si", label: "SI.No", flex: 1, align: "center" },
    { id: "studentName", label: "Student Name", flex: 1, align: "center" },
    { id: "enrollmentNo", label: "Enrollment No", flex: 1, align: "center" },
    { id: "subjectName", label: "Subject Name", flex: 1, align: "center" },
    { id: "teacherName", label: "Teacher Name", flex: 1, align: "center" },
    { id: "action", label: "Action", flex: 1, align: "center" },
  ];

  // Format initial data on mount
  useEffect(() => {
    const formatted = initialData.map((item, index) =>
      createData(
        index + 1,
        item,
        item.studentName,
        item.enrollmentNo,
        item.subjectName,
        item.teacherName
      )
    );
    setRows(formatted);
    setFilteredRows(formatted);
  }, []);

  // Helper to create table row objects
  const createData = (si, row, studentName, enrollmentNo, subjectName, teacherName) => ({
    si,
    row,
    studentName,
    enrollmentNo,
    subjectName,
    teacherName,
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

  // Handle search filtering
  useEffect(() => {
    const filtered = rows.filter(
      (row) =>
        row.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  // CRUD Handlers
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
    // Remove record from state (dummy)
    setRows((prev) => prev.filter((r) => r.row._id !== deleteId));
    setFilteredRows((prev) => prev.filter((r) => r.row._id !== deleteId));
    toast.success("Recorded class deleted successfully!");
    setDeleteShow(false);
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
  };

  const handleCreate = (newData) => {
    // Create new record in state (dummy)
    const newRow = createData(
      rows.length + 1,
      { ...newData, _id: `r${rows.length + 1}` },
      newData.studentName,
      newData.enrollmentNo,
      newData.subjectName,
      newData.teacherName
    );
    setRows((prev) => [...prev, newRow]);
    setFilteredRows((prev) => [...prev, newRow]);
    setOpenData(false);
    toast.success("Recorded class added successfully!");
  };

  const handleUpdate = (updatedData) => {
    // Update record in state (dummy)
    setRows((prev) =>
      prev.map((row) =>
        row.row._id === editData._id
          ? createData(
              row.si,
              updatedData,
              updatedData.studentName,
              updatedData.enrollmentNo,
              updatedData.subjectName,
              updatedData.teacherName
            )
          : row
      )
    );
    setFilteredRows((prev) =>
      prev.map((row) =>
        row.row._id === editData._id
          ? createData(
              row.si,
              updatedData,
              updatedData.studentName,
              updatedData.enrollmentNo,
              updatedData.subjectName,
              updatedData.teacherName
            )
          : row
      )
    );
    setEditShow(false);
    toast.success("Recorded class updated successfully!");
  };

  // Pagination states and handlers
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
          onAddClick={() => setOpenData(true)}
          buttonText="Add Recorded-Class"
        />

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="recorded-class table">
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
                      <TableRow hover role="checkbox" key={row.row._id}>
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


        {/* Dialogs */}
        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openData
              ? "Create Recorded-Class"
              : viewShow
              ? "View Recorded-Class"
              : editShow
              ? "Edit Recorded-Class"
              : deleteShow
              ? "Delete Recorded-Class"
              : ""
          }
          dialogContent={
            openData ? (
              <CreateVideoClass handleCreate={handleCreate} handleClose={handleClose} />
            ) : viewShow ? (
              <ViewVideoClass viewData={viewData} handleClose={handleClose} />
            ) : editShow ? (
              <EditVideoClass
                editData={editData}
                handleUpdate={handleUpdate}
                handleClose={handleClose}
              />
            ) : deleteShow ? (
              <DeleteVideoClass
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

export default RecordedClass;
