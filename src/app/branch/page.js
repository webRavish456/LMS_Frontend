'use client'

import React, { useEffect, useState, useCallback } from "react";
import Search from "@/components/Search"; 
import Layout from "@/components/Layout";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Tooltip, Chip 
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Modals
import Create from "@/components/Branch/Create/Create";
import View from "@/components/Branch/View/View";
import Edit from "@/components/Branch/Edit/Edit"; 
import Delete from "@/components/Branch/Delete/Delete";

export default function BranchPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  // 1. डेटा फेच करें
  const fetchBranchData = useCallback(async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch(`${Base_url}/branch`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const res = await response.json();
      if (res.status === "success") {
        setRows(res.data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [Base_url]);

  useEffect(() => {
    fetchBranchData();
  }, [fetchBranchData]);

  // 2. अपडेट फंक्शन (अब PUT मेथड के साथ)
  const handleUpdate = async (formData) => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const branchId = formData._id || formData.id;

    if (!branchId) {
      toast.error("Branch ID missing!");
      return;
    }

    const payload = {
      branchName: formData.branchName,
      branchLocation: formData.branchLocation,
      Contact: formData.Contact,
      status: formData.status,
    };

    try {
      const url = `${Base_url}/branch/${branchId}`;
      
      const response = await fetch(url, {
        method: "PUT", // बैकएंड राउट से मैच होना चाहिए
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (response.ok && res.status === "success") {
        toast.success("Branch updated successfully!");
        setIsEditOpen(false);
        fetchBranchData(); 
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Network Error: Connection failed");
    }
  };

  // 3. डिलीट फंक्शन
  const handleConfirmDelete = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/branch/${selectedData._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Branch deleted!");
        setIsDeleteOpen(false);
        fetchBranchData();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#072eb0" }}>
          Branch Management
        </Typography>
        
        <Search 
          buttonText="Add Branch" 
          onAddClick={() => setIsCreateOpen(true)} 
        />

        <TableContainer component={Paper} sx={{ mt: 3, borderRadius: "8px" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>SI.No</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Branch Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center">Loading...</TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center">No branches found</TableCell></TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.branchName}</TableCell>
                    <TableCell>{row.branchLocation}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton color="primary" onClick={() => { setSelectedData(row); setIsViewOpen(true); }}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          sx={{ color: "#ed6c02" }} 
                          onClick={() => { setSelectedData(row); setIsEditOpen(true); }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => { setSelectedData(row); setIsDeleteOpen(true); }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* मॉडल्स */}
        {isCreateOpen && <Create onClose={() => setIsCreateOpen(false)} onCreate={fetchBranchData} />}
        {isViewOpen && <View data={selectedData} onClose={() => setIsViewOpen(false)} />}
        {isEditOpen && <Edit data={selectedData} onClose={() => setIsEditOpen(false)} onUpdate={handleUpdate} />}
        {isDeleteOpen && <Delete data={selectedData} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} />}
      </Box>
    </Layout>
  );
}