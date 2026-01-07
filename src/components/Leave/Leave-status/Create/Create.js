"use client";

import { Button, TextField } from "@mui/material";
import React from "react";

export default function Create() {
  return (
    <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <TextField label="Leave Type" variant="outlined" fullWidth />
      <TextField
        label="Duration"
        variant="outlined"
        type="number"
        fullWidth
      />
      <TextField
        label="Reason"
        variant="outlined"
        multiline
        rows={3}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}
