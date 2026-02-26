'use client';

import React, { useEffect, useState, useCallback } from "react";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import CreateStudent from "@/components/Student/Studentlist/Create/Create";

import {
  Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  TablePagination, Box, IconButton, Chip
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentList = () => {

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const fetchStudents = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/studentlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      console.log("Student API:", data);

      const studentArray = Array.isArray(data) ? data : data.data;

      const formatted = studentArray.map((item, index) => ({
        ...item,
        si: index + 1,
        statusChip: (
          <Chip
            label={item.status}
            size="small"
            color={item.status === "Ongoing" ? "primary" : "success"}
          />
        ),
      }));

      setRows(formatted);
      setFilteredRows(formatted);

    } catch (error) {
      console.error(error);
      toast.error("Error loading students");
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.emailId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Layout>
      <ToastContainer />

      <Box sx={{ p: 3 }}>
        <Search
          onSearch={(term) => setSearchTerm(term)}
          onAddClick={() => setOpenCreate(true)}
          buttonText="Add Student"
        />

        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">SI</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Course</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row._id}>
                        <TableCell align="center">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="center">{row.studentName}</TableCell>
                        <TableCell align="center">{row.emailId}</TableCell>
                        <TableCell align="center">{row.course}</TableCell>
                        <TableCell align="center">{row.statusChip}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No Students Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </Paper>

        <CommonDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          dialogTitle="Create Student"
          dialogContent={
            <CreateStudent
              handleCreate={fetchStudents}
              handleClose={() => setOpenCreate(false)}
            />
          }
        />
      </Box>
    </Layout>
  );
};

export default StudentList;