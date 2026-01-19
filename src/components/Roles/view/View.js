'use client'
import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";

const ViewRole = ({ roleData }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Role: {roleData.roleName}</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell>Module</TableCell>
              <TableCell align="center">Access Levels</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roleData.permissions.map((perm, i) => (
              <TableRow key={i}>
                <TableCell>{perm.module}</TableCell>
                <TableCell align="center">
                  {perm.create && <Chip label="Create" size="small" sx={{ mr: 0.5 }} />}
                  {perm.read && <Chip label="Read" size="small" sx={{ mr: 0.5 }} />}
                  {perm.update && <Chip label="Update" size="small" sx={{ mr: 0.5 }} />}
                  {perm.delete && <Chip label="Delete" size="small" color="error" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewRole;