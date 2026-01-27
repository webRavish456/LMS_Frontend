"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Box,
} from "@mui/material";

const modules = [
  "Branch",
  "Employee",
  "Freelancer",
  "Roles",
  "PunchIn/PunchOut",
  "DailyLog",
  "AttendanceRequest",
  "AttendanceDetails",
];

const CreateRoleModal = ({ open, handleClose, onSuccess }) => {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  const [permissions, setPermissions] = useState(
    modules.map((m) => ({
      module: m,
      create: false,
      read: false,
      update: false,
      delete: false,
    }))
  );

  const togglePermission = (index, field) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  /* ================= SAVE ROLE ================= */
  const handleSubmit = async () => {
    if (!roleName.trim()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roleName: roleName.trim(),
            permissions,
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        // 🔥 VERY IMPORTANT (Staff page pattern)
        onSuccess(data.data);   // parent will show toast + update table
        setRoleName("");
        handleClose();
      }
    } catch (err) {
      console.error("Create role error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Create Role</DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ maxHeight: 300, overflow: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>MODULE</TableCell>
                <TableCell align="center">C</TableCell>
                <TableCell align="center">R</TableCell>
                <TableCell align="center">U</TableCell>
                <TableCell align="center">D</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>{p.module}</TableCell>
                  {["create", "read", "update", "delete"].map((field) => (
                    <TableCell align="center" key={field}>
                      <Checkbox
                        checked={p[field]}
                        onChange={() =>
                          togglePermission(index, field)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleModal;
