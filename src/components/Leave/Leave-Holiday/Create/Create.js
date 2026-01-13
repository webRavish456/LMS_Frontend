"use client";

import { Button, TextField, Box, Typography, Stack } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Create({ onClose, onRefresh }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Model ke structure ke mutabiq payload
    const payload = { name, date };

    try {
      const response = await fetch(`${Base_url}/holiday`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      if (res.success) {
        toast.success("Holiday Added Successfully!");
        if (onRefresh) onRefresh(); 
        onClose(); 
      } else {
        toast.error(res.message || "Error adding holiday");
      }
    } catch (error) {
      toast.error("Server connection failed");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
      {/* Day Name Field (Matches 'name' in Model) */}
      <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
        Day Name
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter day name (e.g. Sunday)"
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />

      {/* Date Field (Matches 'date' in Model) */}
      <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
        Date
      </Typography>
      <TextField
        fullWidth
        type="date"
        size="small"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        sx={{ mb: 4 }}
      />

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ textTransform: "none", borderRadius: "6px", px: 4, borderColor: "#007bff", color: "#007bff" }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ textTransform: "none", borderRadius: "6px", px: 5, bgcolor: "#007bff" }}
        >
          Add
        </Button>
      </Stack>
    </Box>
  );
}