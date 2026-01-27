"use client";
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from "@mui/material";
import { toast } from "react-toastify";

const DeleteTeacher = ({ data, onClose, onConfirm }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/teacher/${data._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Teacher deleted successfully");
      onConfirm();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Delete Teacher</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <b>{data.teacherName}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTeacher;
