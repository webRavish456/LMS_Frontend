"use client";

import Cookies from "js-cookie";
import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
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

import ViewVideoClass from "@/components/Video-Class/Live-Class/View/View";
import CreateVideoClass from "@/components/Video-Class/Live-Class/Create/Create";
import EditVideoClass from "@/components/Video-Class/Live-Class/Edit/Edit";
import DeleteVideoClass from "@/components/Video-Class/Live-Class/Delete/Delete";

const LiveClass = () => {
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
    { id: "studentName", label: "Student Name", flex: 1, align: "center" },
    { id: "enrollmentNo", label: "Enrollment No", flex: 1, align: "center" },
    { id: "subjectName", label: "Subject Name", flex: 1, align: "center" },
    { id: "teacherName", label: "Teacher Name", flex: 1, align: "center" },
    { id: "action", label: "Action", flex: 1, align: "center" },
  ];

  // fetch live class data
  useEffect(() => {
    const fetchLiveClassData = async () => {
      try {
        const response = await fetch(`${Base_url}/video-class/live`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.text();
        const res = JSON.parse(result);

        if (res.status === "success") {
          setLoading(false);

          const formattedData = res.data.map((item, index) =>
            createData(
              index + 1,
              item,
              item.studentName,
              item.enrollmentNo,
              item.subjectName,
              item.teacherName
            )
          );

          setRows(formattedData);
          setFilteredRows(formattedData);
        }
      } catch (error) {
        console.error("Error fetching live class data:", error);
      }
    };

    if (loading) {
      fetchLiveClassData();
    }
  }, [loading]);

  const createData = (
    si,
    row,
    studentName,
    enrollmentNo,
    subjectName,
    teacherName
  ) => ({
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

  // search filter
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
    fetch(`${Base_url}/video-class/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result);
        if (res.status === "success") {
          toast.success("Live class deleted successfully!");
          setLoading(true);
        } else {
          toast.error(res.message);
        }
        setIsDeleting(false);
        handleClose();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        setIsDeleting(false);
      });
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

  // pagination state
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
          buttonText="Add Live-Class"
        />

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="live-class table">
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

        {/* Dialogs */}
        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openData
              ? "Create Live-Class"
              : viewShow
              ? "View Live-Class"
              : editShow
              ? "Edit Live-Class"
              : deleteShow
              ? "Delete Live-Class"
              : ""
          }
          dialogContent={
            openData ? (
              <CreateVideoClass handleCreate={handleCreate} handleClose={handleClose} />
            ) : viewShow ? (
              <ViewVideoClass viewData={viewData} />
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

export default LiveClass;
