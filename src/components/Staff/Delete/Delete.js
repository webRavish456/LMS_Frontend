"use client";
import { Button, Typography } from "@mui/material";

export default function DeleteStaff({ handleDelete }) {
  return (
    <>
      <Typography>Are you sure you want to delete?</Typography>
      <Button color="error" variant="contained" onClick={handleDelete}>
        Delete
      </Button>
    </>
  );
}
