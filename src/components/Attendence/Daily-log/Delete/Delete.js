'use client';

import React from "react";
import { 
  Box, Button, Typography, CircularProgress, DialogActions, DialogContent 
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const DeleteAttendance = ({ handleDelete, isDeleting, handleClose }) => {
  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <DialogContent>
        {/* Warning Icon */}
        <Box sx={{ mb: 2 }}>
          <DeleteForeverIcon sx={{ fontSize: 60, color: "#d32f2f" }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Confirm Delete
        </Typography>
        
        <Typography variant="body2" color="textSecondary">
          Are you sure you want to delete this attendance record? 
          <br />
          This action <strong>cannot be undone</strong>.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined" 
          disabled={isDeleting}
          sx={{ borderRadius: "8px", px: 4 }}
        >
          No, Keep it
        </Button>
        
        <Button 
          onClick={handleDelete} 
          variant="contained" 
          color="error"
          disabled={isDeleting}
          sx={{ borderRadius: "8px", px: 4, bgcolor: "#d32f2f" }}
        >
          {isDeleting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Yes, Delete"
          )}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default DeleteAttendance;