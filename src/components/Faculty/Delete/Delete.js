"use client";

import { Box, Button, Typography, CircularProgress } from "@mui/material";

const DeleteFaculty = ({ onConfirm, onClose, loading }) => {
  return (
    <Box>
      <Typography mb={3}>
        Are you sure you want to delete this faculty?
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            "Delete"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteFaculty;
