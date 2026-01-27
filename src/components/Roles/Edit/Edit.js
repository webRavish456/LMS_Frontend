"use client";

import React, { useEffect, useState } from "react";
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

const EditRoleModal = ({ open, role, handleClose, onSuccess }) => {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===== PREFILL DATA ===== */
  useEffect(() => {
    if (role) {
      setRoleName(role.roleName || "");
      setPermissions(role.permissions || []);
    }
  }, [role]);

  if (!role) return null;

  const togglePermission = (index, field) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  /* ===== UPDATE ROLE ===== */
  const handleUpdate = async () => {
    if (!roleName.trim()) return;

    try {
      setLoading(true);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) {
        console.error("TOKEN NOT FOUND IN LOCALSTORAGE");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/role/${role._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ IMPORTANT
          },
          body: JSON.stringify({
            roleName: roleName.trim(),
            permissions,
          }),
        }
      );

      // 🔥 SAFE PARSE (HTML error protection)
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("API returned HTML:", text);
        return;
      }

      if (data.status === "success") {
        onSuccess(data.data);   // 🔥 parent handles toast + table update
        handleClose();
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("UPDATE ROLE ERROR 👉", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Role</DialogTitle>

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
                        onChange={() => togglePermission(index, field)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleModal;
