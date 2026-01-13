'use client';

import React from "react";
import { 
  Box, Typography, Button, CircularProgress 
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DeleteAllStudent = ({ handleDelete, isDeleting, handleClose }) => {
  return (
    <Box 
      sx={{ 
        p: 2, 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 2 
      }}
    >
      {/* Warning Icon */}
      <Box 
        sx={{ 
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          bgcolor: '#fff4e5', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 40, color: '#ffa726' }} />
      </Box>

      {/* Confirmation Text */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Are you sure?
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Do you really want to delete this student record? This process cannot be undone.
        </Typography>
      </Box>

      {/* Action Buttons (Point 10) */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={handleClose} 
          disabled={isDeleting}
          sx={{ flex: 1, borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleDelete} 
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteForeverIcon />}
          sx={{ flex: 1, borderRadius: '8px', bgcolor: '#d32f2f' }}
        >
          {isDeleting ? "Deleting..." : "Delete Now"}
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteAllStudent;