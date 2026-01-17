"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";

const Delete = ({ deleteId, handleDelete, handleClose }) => {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const onConfirm = async () => {
    try {
      const response = await fetch(`${Base_url}/bill/${deleteId}`, {
        method: "DELETE",
      });
      const res = await response.json();
      if (res.status === "success") {
        toast.success("Bill Deleted!");
        handleDelete();
        handleClose();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h6" mb={2}>Are you sure you want to delete this bill?</Typography>
      <Typography color="textSecondary" mb={4}>This action cannot be undone.</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">No, Keep it</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Yes, Delete</Button>
      </Box>
    </Box>
  );
};

export default Delete;