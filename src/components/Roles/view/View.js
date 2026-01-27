"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const ViewRoleModal = ({ open, role, handleClose }) => {
  if (!role) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>View Role</DialogTitle>

      <DialogContent dividers>
        <h3>{role.roleName}</h3>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Module</TableCell>
              <TableCell align="center">C</TableCell>
              <TableCell align="center">R</TableCell>
              <TableCell align="center">U</TableCell>
              <TableCell align="center">D</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {role.permissions?.map((p, i) => (
              <TableRow key={i}>
                <TableCell>{p.module}</TableCell>
                <TableCell align="center">{p.create ? "✔" : "-"}</TableCell>
                <TableCell align="center">{p.read ? "✔" : "-"}</TableCell>
                <TableCell align="center">{p.update ? "✔" : "-"}</TableCell>
                <TableCell align="center">{p.delete ? "✔" : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRoleModal;
