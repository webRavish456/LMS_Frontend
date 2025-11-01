"use client";

import { useState, useEffect } from "react";
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
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateSchedule from "@/components/Schedule/Create/Create";
import ViewSchedule from "@/components/Schedule/View/View";
import EditSchedule from "@/components/Schedule/Edit/Edit";
import DeleteSchedule from "@/components/Schedule/Delete/Delete";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import Search from "@/components/Search/Search";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";

const ScheduleList = () => {
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  const columns = [
    { id: "si", label: "SI.No", align: "center" },
    { id: "scheduleId", label: "Schedule ID", align: "center" },
    { id: "courseId", label: "Course ID", align: "center" },
    { id: "teacherId", label: "Teacher ID", align: "center" },
    { id: "startTime", label: "Start Time", align: "center" },
    { id: "endTime", label: "End Time", align: "center" },
    { id: "status", label: "Status", align: "center" },
    { id: "action", label: "Action", align: "center" },
  ];

  // Helper: format datetime
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  // Fetch data
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await fetch(`${Base_url}/schedule`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = await response.json();

        if (res.status === "unauthorized" || res.message === "Invalid token") {
          toast.error("Session expired. Please login again.");
          Cookies.remove("token");
          router.push("/login");
          return;
        }

        if (res.status === "success") {
          const formattedData = res.data.map((item, index) =>
            createData(index + 1, item)
          );
          setRows(formattedData);
          setFilteredRows(formattedData);
        } else {
          toast.error(res.message || "Failed to fetch schedules.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
        toast.error("Error fetching data.");
        setLoading(false);
      }
    };

    if (loading) fetchScheduleData();
  }, [loading]);

  const createData = (si, item) => ({
    si,
    scheduleId: item.scheduleId,
    courseId: item.courseId,
    teacherId: item.teacherId,
    startTime: formatDate(item.startTime),
    endTime: formatDate(item.endTime),
    status: (
      <Chip
        label={item.status}
        color={
          item.status === "Scheduled"
            ? "success"
            : item.status === "Rescheduled"
            ? "warning"
            : "error"
        }
      />
    ),
    action: (
      <>
        <IconButton onClick={() => handleView(item)} color="primary">
          <VisibilityIcon />
        </IconButton>
        <IconButton onClick={() => handleEdit(item)} color="secondary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleShowDelete(item._id)} color="error">
          <DeleteIcon />
        </IconButton>
      </>
    ),
  });

  // Search
  useEffect(() => {
    const filtered = rows.filter(
      (row) =>
        row.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.props.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  // Handlers
  const handleView = (row) => {
    setViewData(row);
    setViewShow(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setEditShow(true);
  };

  const handleShowDelete = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${Base_url}/schedule/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await response.json();
      if (res.status === "success") {
        toast.success("Schedule deleted successfully!");
        setLoading(true);
      } else {
        toast.error(res.message || "Failed to delete schedule.");
      }
      setIsDeleting(false);
      setDeleteShow(false);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting schedule.");
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
  };

  const handleCreate = () => setLoading(true);
  const handleUpdate = () => setLoading(true);

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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddClick={() => setOpenData(true)}
          buttonText="Add Schedule"
        />

        {loading ? (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Loading schedules...
            </Typography>
          </Box>
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        align={col.align}
                        style={{ fontWeight: 700 }}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <Typography variant="body1" sx={{ py: 2 }}>
                          No schedules found. Click{" "}
                          <b>"Add Schedule"</b> to create one.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, idx) => (
                        <TableRow hover key={idx}>
                          {columns.map((col) => (
                            <TableCell key={col.id} align={col.align}>
                              {row[col.id]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        <CommonDialog
          open={openData || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            openData
              ? "Create New Schedule"
              : viewShow
              ? "View Schedule"
              : editShow
              ? "Edit Schedule"
              : deleteShow
              ? "Delete Schedule"
              : ""
          }
          dialogContent={
            openData ? (
              <CreateSchedule
                handleCreate={handleCreate}
                handleClose={handleClose}
              />
            ) : viewShow ? (
              <ViewSchedule viewData={viewData} />
            ) : editShow ? (
              <EditSchedule
                editData={editData}
                handleUpdate={handleUpdate}
                handleClose={handleClose}
              />
            ) : deleteShow ? (
              <DeleteSchedule
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

export default ScheduleList;
