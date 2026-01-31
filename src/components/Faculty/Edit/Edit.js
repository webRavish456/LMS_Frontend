"use client";

import {
  Box,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

const EditFaculty = ({ data, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({
    teacherName: data.teacherName,
    emailId: data.emailId,
  });

  return (
    <Box>
      <TextField
        fullWidth
        label="Name"
        value={form.teacherName}
        onChange={(e) =>
          setForm({ ...form, teacherName: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Email"
        value={form.emailId}
        onChange={(e) =>
          setForm({ ...form, emailId: e.target.value })
        }
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave(form)}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Update"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditFaculty;
