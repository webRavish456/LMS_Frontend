'use client'

import React, { useEffect, useState } from "react";
import Search from "@/components/Search/Search";
import { useRouter } from "next/navigation";
import AddIcon from '@mui/icons-material/Add';

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
  Typography,
  Button,
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
    { id: 'si', label: 'Sl.No', flex: 1, align: 'center' },
    { id: 'teacherName', label: 'Teacher Name', flex: 1, align: 'left' },
    { id: 'emailId', label: 'Email Id', flex: 1, align: 'left' },
    { id: 'mobileNo', label: 'Mobile Number', flex: 1, align: 'left' },
    { id: 'courseName', label: 'Department', flex: 1, align: 'left' },
    { id: 'qualification', label: 'Specialization', flex: 1, align: 'left' },
    { id: 'experience', label: 'Experience', flex: 1, align: 'center' },
    { id: 'gender', label: 'Gender', flex: 1, align: 'center' },
  ];

  const createData = (si, item, teacherName, courseName, gender, mobileNo, emailId, experience, qualification) => {
    return { si, item, teacherName, courseName, gender, mobileNo, emailId, experience, qualification };
  };

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await fetch(`${Base_url}/teacher`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.text();
        const res = JSON.parse(result);

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

    fetchFacultyData();
  }, [Base_url, token]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm.trim() === "") {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((row) =>
        row.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.mobileNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.emailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.experience.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.qualification.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRows(filtered);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
      <ToastContainer />
      
      <Box sx={{ width: "100%", p: 3 }}>
        {/* Page Title */}
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: '#333', 
          mb: 3,
          fontSize: '2rem'
        }}>
          Teacher
        </Typography>

        {/* Action Bar */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          mb: 3,
          backgroundColor: 'white',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ flex: 1, maxWidth: 400 }}>
            <Search 
              onSearch={handleSearch} 
              buttonText="Add New Teacher"
              onAddClick={() => router.push('/createfaculty')}
            />
          </Box>
        </Box>

        {/* Data Table */}
        <Paper sx={{ 
          width: "100%", 
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        backgroundColor: '#f8f9fa',
                        color: '#333',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        borderBottom: '2px solid #e0e0e0'
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No teachers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow 
                          hover 
                          key={row.si}
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                            '&:hover': { backgroundColor: '#f5f5f5' }
                          }}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell 
                                key={column.id} 
                                align={column.align}
                                sx={{
                                  borderBottom: '1px solid #e0e0e0',
                                  fontSize: '0.9rem',
                                  color: '#333'
                                }}
                              >
                                {value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: '#f8f9fa',
              borderTop: '1px solid #e0e0e0'
            }}
          />
        </Paper>
      </Box>
    </Layout>
  );
}
