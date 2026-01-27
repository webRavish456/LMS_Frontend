"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";
import { toast } from "react-toastify";

export default function Create({ onClose, onSuccess }) {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const [form, setForm] = useState({
    name: "",
    course: "",
    issuer: "",
  });

  const handleSave = async () => {
    if (!form.name || !form.course || !form.issuer) {
      toast.error("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) throw new Error();

      toast.success("Certificate added successfully ✅");
      onSuccess();     // table refresh
      onClose();       // dialog close
    } catch {
      toast.error("Failed to add certificate ❌");
    }
  };

  return (
    <Box p={2}>
      <Stack spacing={2}>
        <TextField
          label="Name"
          size="small"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Course"
          size="small"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
        <TextField
          label="Issuer"
          size="small"
          value={form.issuer}
          onChange={(e) => setForm({ ...form, issuer: e.target.value })}
        />

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
