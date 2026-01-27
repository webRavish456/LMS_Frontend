'use client';

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";

const DeleteStudent = ({ deleteData, handleClose, onSuccess }) => {
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${Base_url}/studentlist/${deleteData._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (json.status === "success") {
        toast.success("Student deleted");
        onSuccess(deleteData._id);
        handleClose();
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography>
        Are you sure you want to delete <b>{deleteData?.studentName}</b>?
      </Typography>

      <Box mt={3} textAlign="right">
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteStudent;
