"use client";
import React, { useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from "@mui/material";
import { toast } from "react-toastify";

const EditTeacher = ({ teacher, handleClose, refreshData }) => {
  const nameRef = useRef();
  const expRef = useRef();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/teacher/${teacher._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teacherName: nameRef.current.value,
          experience: expRef.current.value,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Teacher updated successfully");
      refreshData();
      handleClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Teacher</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Teacher Name"
          defaultValue={teacher.teacherName}
          inputRef={nameRef}
          fullWidth
        />
        <TextField
          label="Experience"
          defaultValue={teacher.experience}
          inputRef={expRef}
          fullWidth
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTeacher;
