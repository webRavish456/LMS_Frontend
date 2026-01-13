"use client";

import { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
  Tooltip
} from "@mui/material";

import CommonDialog from "@/components/CommonDialog/CommonDialog";
import CreateResult from "@/components/Result/Create/Create";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const ResultPage = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/result`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      if (res.status === "success") {
        const formatted = res.data.map((item, i) => ({
          ...item,
          si: i + 1,
          
          displayTeachers: Array.isArray(item.teacherName) 
            ? item.teacherName.join(", ") 
            : (item.teacherName || "N/A"),
        }));
        setRows(formatted);
        setFilteredRows(formatted);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [Base_url, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refresh]);

  useEffect(() => {
    const filtered = rows.filter((row) =>
      row.examName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
    setPage(0);
  }, [searchTerm, rows]);

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box p={3}>
        <Search 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onAddClick={() => setOpenCreate(true)} 
          buttonText="Add Result" 
        />

        <Paper sx={{ mt: 3 }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>SI.No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Exam Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Course Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Teacher Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Result Date</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center">No Data Found</TableCell></TableRow>
                ) : (
                  filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row._id} hover>
                      <TableCell>{row.si}</TableCell>
                      <TableCell>{row.examName}</TableCell>
                      <TableCell>{row.courseName}</TableCell>
                      <TableCell>{row.displayTeachers}</TableCell>
                      <TableCell>{row.resultDate}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary"><VisibilityIcon fontSize="small" /></IconButton>
                        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination component="div" count={filteredRows.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, p) => setPage(p)} />
        </Paper>

        <CommonDialog 
          open={openCreate} 
          onClose={() => setOpenCreate(false)}
          dialogTitle="Create New Result"
          dialogContent={
            <CreateResult 
              handleCreate={() => setRefresh(!refresh)} 
              handleClose={() => setOpenCreate(false)} 
            />
          } 
        />
      </Box>
    </Layout>
  );
};

export default ResultPage;