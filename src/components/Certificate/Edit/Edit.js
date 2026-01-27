"use client";

import { Box, TextField, Button, Stack } from "@mui/material";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Edit({ data, onClose, onSuccess }) {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem("token");

  const [form, setForm] = useState(data);

  const update = async () => {
    const res = await fetch(`${BASE}/certificates/${data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    if (result.success) {
      toast.success("Updated successfully");
      onSuccess();
      onClose();
    } else {
      toast.error("Update failed");
    }
  };

  return (
    <Box p={2}>
      <Stack spacing={2}>
        <TextField size="small" label="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <TextField size="small" label="Course" value={form.course} onChange={(e)=>setForm({...form,course:e.target.value})}/>
        <TextField size="small" label="Issuer" value={form.issuer} onChange={(e)=>setForm({...form,issuer:e.target.value})}/>
        <Button variant="contained" onClick={update}>Update</Button>
      </Stack>
    </Box>
  );
}
