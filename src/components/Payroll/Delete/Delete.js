'use client'

import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

const DeletePayroll = ({ handleDelete, isDeleting, handleClose }) => {
  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Are you sure you want to delete this Payroll record?
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="secondary"
          disabled={isDeleting}
        >
          Cancel
        </Button>

        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <CircularProgress
                size={18}
                style={{ marginRight: 8, color: "#fff" }}
              />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default DeletePayroll;
