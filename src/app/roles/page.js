"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CreateRoleModal from "@/components/Roles/Create/Create";
import EditRoleModal from "@/components/Roles/Edit/Edit";
import ViewRoleModal from "@/components/Roles/view/View";

import { toast } from "react-toastify";

const RolesPage = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [roles, setRoles] = useState([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  /* ================= FETCH ROLES (SAME AS STAFF) ================= */
  const fetchRoles = async () => {
    try {
      if (!token) return;

      const res = await fetch(`${BASE_URL}/role`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        setRoles(data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/role/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Role deleted successfully"); // ✅ STAFF STYLE
        fetchRoles();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Roles & Permissions
          </Typography>

          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            Create Role
          </Button>
        </Box>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <TableRow key={role._id}>
                      <TableCell>{role.roleName}</TableCell>
                      <TableCell>
                        {role.status ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => {
                            setViewData(role);
                            setOpenView(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => {
                            setEditData(role);
                            setOpenEdit(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDelete(role._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No roles found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* ================= CREATE (STAFF PATTERN) ================= */}
        <CreateRoleModal
          open={openCreate}
          handleClose={() => setOpenCreate(false)}
          onSuccess={(newRole) => {
            toast.success("Role created successfully"); // ✅ HERE
            setRoles((prev) => [newRole, ...prev]);     // ✅ instant update
            setOpenCreate(false);
          }}
        />

        {/* ================= EDIT ================= */}
        <EditRoleModal
  open={openEdit}
  role={editData}
  handleClose={() => setOpenEdit(false)}
  onSuccess={(updatedRole) => {
    toast.success("Role updated successfully");
    setRoles((prev) =>
      prev.map((r) =>
        r._id === updatedRole._id ? updatedRole : r
      )
    );
    setOpenEdit(false);
  }}
/>


        {/* ================= VIEW ================= */}
        <ViewRoleModal
          open={openView}
          role={viewData}
          handleClose={() => setOpenView(false)}
        />
      </Box>
    </Layout>
  );
};

export default RolesPage;
