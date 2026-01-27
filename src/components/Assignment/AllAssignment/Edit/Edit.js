"use client";
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Grid, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

export default function EditAllAssignment({ editData, handleClose, handleUpdate }) {
  const [formData, setFormData] = useState({
    assignmentTitle: "",
    course: "",
    teacher: "",
    dueDate: "",
    status: ""
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        assignmentTitle: editData.assignmentTitle || "",
        course: editData.course || "",
        teacher: editData.teacher || "",
        dueDate: editData.dueDate ? editData.dueDate.split('T')[0] : "", 
        status: editData.status || "Active"
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

    if (!editData?._id) {
      toast.error("Assignment ID is missing!");
      return;
    }

    // URL Fixing: 404 se bachne ke liye URL check karein
    const cleanBaseUrl = Base_url.replace(/\/+$/, ""); 
    
    /** * IMPORTANT: Agar ye URL fail ho raha hai, toh backend mein check karein 
     * ki kya route "/allAssignment" hai ya sirf "/assignment".
     */
    const finalUrl = `${cleanBaseUrl}/allAssignment/${editData._id}`;

    try {
      const response = await fetch(finalUrl, {
        method: "PATCH", // 404 hone par PUT ki jagah PATCH try karein
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const res = await response.json();
        if (response.ok) {
          toast.success("Assignment Updated Successfully!");
          handleUpdate(); 
          handleClose();
        } else {
          toast.error(res.message || "Server Error");
        }
      } else {
        // Agar response HTML hai (404 Error)
        console.error("404 Error: Server route not found at " + finalUrl);
        toast.error("Error 404: Backend route nahi mila. ID ya URL check karein.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Server connection failed");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Title" value={formData.assignmentTitle} onChange={(e) => setFormData({...formData, assignmentTitle: e.target.value})} required />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Course" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} required />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Teacher" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} required />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} required />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth select label="Status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button onClick={handleClose}>CANCEL</Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: "#ed6c02" }}>UPDATE DATA</Button>
      </Box>
    </Box>
  );
}