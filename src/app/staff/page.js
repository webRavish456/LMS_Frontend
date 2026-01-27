'use client';

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
import ViewStaff from "@/components/Staff/View/View";
import CreateStaff from "@/components/Staff/Create/Create";
import EditStaff from "@/components/Staff/Edit/Edit";
import DeleteStaff from "@/components/Staff/Delete/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";

const StaffList = () => {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { id: "si", label: "SI.No", align: "center" },
    { id: "staffName", label: "Staff Name", align: "center" },
    { id: "designation", label: "Designation", align: "center" },
    { id: "mobile", label: "Mobile No.", align: "center" },
    { id: "email", label: "Email Id", align: "center" },
    { id: "address", label: "Address", align: "center" },
    { id: "salary", label: "Salary", align: "center" },
    { id: "joiningDate", label: "Joining Date", align: "center" },
    { id: "status", label: "Status", align: "center" },
    { id: "action", label: "Actions", align: "center" },
  ];

  /* ================= FETCH STAFF (REUSABLE) ================= */
  const fetchStaffData = async () => {
    try {
      if (!token) return;

      const response = await fetch(`${Base_url}/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const res = await response.json();

      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item, index) => ({
          si: index + 1,
          staffName: item.staffName,
          designation: item.designation,
          mobile: item.mobileNO,
          email: item.email,
          address: item.address,
          salary: item.salary,
          joiningDate: item.joiningDate
            ? new Date(item.joiningDate).toLocaleDateString()
            : "-",
          status: item.status || "Active",
          action: (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <IconButton onClick={() => handleView(item)}>
                <VisibilityIcon />
              </IconButton>
              <IconButton onClick={() => handleEdit(item)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteOpen(item._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ),
        }));

        setRows(formatted);
        setFilteredRows(formatted);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch staff");
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchStaffData();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const filtered = rows.filter(
      (row) =>
        row.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.mobile?.toString().includes(searchTerm) ||
        row.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  /* ================= HANDLERS ================= */
  const handleView = (row) => {
    setViewData(row);
    setOpenView(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setOpenEdit(true);
  };

  const handleDeleteOpen = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${Base_url}/staff/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Staff deleted");
        fetchStaffData(); // 🔥 auto update
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
      setOpenDelete(false);
    }
  };

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Layout>
      <ToastContainer />
      <Box sx={{ p: 3 }}>
        <Search
          onSearch={(t) => setSearchTerm(t)}
          onAddClick={() => setOpenCreate(true)}
          buttonText="Add Staff"
        />

        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((c) => (
                    <TableCell key={c.id} align={c.align}>
                      {c.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.length ? (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow key={i}>
                        {columns.map((c) => (
                          <TableCell key={c.id} align={c.align}>
                            {row[c.id]}
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
            count={filteredRows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </Paper>

        {/* ================= DIALOGS ================= */}
        <CommonDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          dialogTitle="Create Staff"
          dialogContent={
            <CreateStaff
              handleClose={() => setOpenCreate(false)}
              onSuccess={fetchStaffData} // 🔥 KEY LINE
            />
          }
        />

        <CommonDialog
          open={openView}
          onClose={() => setOpenView(false)}
          dialogTitle="View Staff"
          dialogContent={<ViewStaff viewData={viewData} />}
        />

        <CommonDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          dialogTitle="Edit Staff"
          dialogContent={
            <EditStaff
              editData={editData}
              handleClose={() => setOpenEdit(false)}
              handleUpdate={fetchStaffData} // 🔥 KEY LINE
            />
          }
        />

        <CommonDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          dialogTitle="Delete Staff"
          dialogContent={
            <DeleteStaff
              handleDelete={handleDelete}
              isDeleting={isDeleting}
              handleClose={() => setOpenDelete(false)}
            />
          }
        />
      </Box>
    </Layout>
  );
};

export default StaffList;
