"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";

const DeleteExpense = ({ deleteId, handleDelete, handleClose }) => {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const onConfirm = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${Base_url}/expense/${deleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.status === "success" || res.success) {
        toast.success("Expense deleted!");
        handleDelete();
        handleClose();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h6">Are you sure you want to delete this expense?</Typography>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Delete</Button>
      </Box>
    </Box>
  );
};

export default DeleteExpense;