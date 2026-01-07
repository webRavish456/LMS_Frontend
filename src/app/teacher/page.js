'use client'

import React, { useEffect, useState } from "react";
import Search from "@/components/Search"; 
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Box, IconButton, 
  Typography, Tooltip
} from "@mui/material";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

export default function TeacherPage() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  const columns = [
    { id: 'si', label: 'Sl.No', align: 'center' },
    { id: 'teacherName', label: 'Teacher Name', align: 'left' },
    { id: 'emailId', label: 'Email Id', align: 'left' },
    { id: 'mobileNo', label: 'Mobile Number', align: 'left' },
    { id: 'courseName', label: 'Department', align: 'left' },
    { id: 'qualification', label: 'Specialization', align: 'left' },
    { id: 'experience', label: 'Exp.', align: 'center' },
    { id: 'action', label: 'Action', align: 'center' },
  ];

  const createData = (si, item, teacherName, courseName, gender, mobileNo, emailId, experience, qualification) => {
    return { 
      si, 
      teacherName, 
      courseName, 
      mobileNo, 
      emailId, 
      experience, 
      qualification,
      
      action: (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="View">
            <IconButton size="small" sx={{ color: "#072eb0" }} onClick={() => router.push(`/teacher/view/${item._id}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" sx={{ color: "#6b6666" }} onClick={() => router.push(`/teacher/edit/${item._id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" sx={{ color: "#e6130b" }} onClick={() => console.log("Delete", item._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    };
  };

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await fetch(`${Base_url}/teacher`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = await response.json();

        if (res.status === "success") {
          const formattedData = res.data.map((item, index) =>
            createData(
              index + 1,
              item,
              item.teacherName,
              item.courseName,
              item.gender,
              item.mobileNo,
              item.emailId,
              item.experience,
              item.qualification
            )
          );
          setRows(formattedData);
          setFilteredRows(formattedData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setLoading(false);
      }
    };

    if (loading) fetchFacultyData();
  }, [loading, Base_url, token]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = rows.filter((row) =>
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredRows(filtered);
    setPage(0);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Layout>
      <ToastContainer />
      <Box sx={{ width: "100%", p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Teacher Management</Typography>

        <Box sx={{ mb: 3 }}>
          <Search 
            onSearch={handleSearch} 
            buttonText="Add Teacher"
            onAddClick={() => router.push('/createfaculty')}
          />
        </Box>

        <Paper sx={{ width: "100%", overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} sx={{ fontWeight: 700, backgroundColor: '#f5f5f5' }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow hover key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {filteredRows.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">No teachers found</TableCell>
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
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          />
        </Paper>
      </Box>
    </Layout>
  );
}
