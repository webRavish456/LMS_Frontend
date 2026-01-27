"use client";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const CreateBranch = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    branchName: "",
    branchLocation: "",
    Contact: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async () => {
    if (!formData.branchName || !formData.branchLocation || !formData.Contact) {
      toast.error("All fields are required!");
      return;
    }

    const token = Cookies.get("token") || localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await fetch(`${Base_url}/branch`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();

      if (response.ok && res.status === "success") {
        toast.success("Branch added successfully!");
        onCreate();
        onClose();
      } else {
        toast.error(res.message || "Invalid Token or Session Expired");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, color: "#072eb0" }}>Add New Branch</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Branch Name" fullWidth onChange={(e) => setFormData({...formData, branchName: e.target.value})} />
          <TextField label="Location" fullWidth onChange={(e) => setFormData({...formData, branchLocation: e.target.value})} />
          <TextField label="Contact" fullWidth onChange={(e) => setFormData({...formData, Contact: e.target.value})} />
          <TextField select label="Status" value={formData.status} fullWidth onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ bgcolor: "#072eb0" }}>
          {loading ? "Saving..." : "Save Branch"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBranch;