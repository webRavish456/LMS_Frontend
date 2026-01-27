"use client";
import React, { useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box
} from "@mui/material";
import { toast } from "react-toastify";

const CreateTeacher = ({ handleClose, handleCreate }) => {
  const teacherNameRef = useRef();
  const emailIdRef = useRef();
  const mobileNumberRef = useRef();
  const departmentRef = useRef();
  const dobRef = useRef();
  const genderRef = useRef();
  const experienceRef = useRef();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (
      !teacherNameRef.current.value ||
      !emailIdRef.current.value ||
      !mobileNumberRef.current.value
    ) {
      toast.error("Name, Email and Mobile are required!");
      return;
    }

    const formData = new FormData();
    formData.append("teacherName", teacherNameRef.current.value);
    formData.append("emailId", emailIdRef.current.value);
    formData.append("mobileNumber", mobileNumberRef.current.value);
    formData.append("dob", dobRef.current.value);
    formData.append("gender", genderRef.current.value);
    formData.append("experience", experienceRef.current.value);
    formData.append("qualification", "NA");
    formData.append("address", "NA");

    formData.append(
      "companyDetails",
      JSON.stringify({
        courseName: departmentRef.current.value,
        branchName: "Main Branch",
        salary: 0,
        joiningDate: new Date(),
      })
    );

    try {
      const res = await fetch(`${BASE_URL}/teacher`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Teacher created successfully");
      handleCreate();
      handleClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Teacher</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Teacher Name" inputRef={teacherNameRef} />
          <TextField label="Email ID" inputRef={emailIdRef} />
          <TextField label="Mobile Number" inputRef={mobileNumberRef} />
          <TextField label="Department" inputRef={departmentRef} />

          <TextField
            type="date"
            label="DOB"
            InputLabelProps={{ shrink: true }}
            inputRef={dobRef}
          />

          <TextField select label="Gender" defaultValue="Male" inputRef={genderRef}>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>

          <TextField
            label="Experience (Years)"
            type="number"
            inputRef={experienceRef}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Teacher
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTeacher;
