'use client'
import React, { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, 
  Box, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Checkbox, 
  Paper, Button, IconButton, Typography, Stack 
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CreateRoleModal = ({ open, handleClose, onSave }) => {
  const [roleName, setRoleName] = useState("");
  const modules = [
    "Branch", "InHouseRecruitment", "OutsideRecruitment", "Employee", 
    "Freelancer", "Roles", "PunchIn/PunchOut", "DailyLog", 
    "AttendanceRequest", "AttendanceDetails"
  ];
  
  const [permissions, setPermissions] = useState(
    modules.map(mod => ({ module: mod, create: false, read: false, update: false, delete: false }))
  );

  const handleCheckboxChange = (index, field) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  const handleSubmit = () => {
    onSave({ roleName, permissions });
    setRoleName(""); 
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      {/* Top Header with Input and Buttons */}
      <DialogTitle sx={{ p: 2, bgcolor: "#fff" }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <TextField 
            placeholder="Enter role name" 
            variant="outlined" 
            size="small" 
            value={roleName} 
            onChange={(e) => setRoleName(e.target.value)} 
            sx={{ width: '350px' }}
          />
          
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button 
              onClick={handleClose} 
              variant="outlined"
              sx={{ 
                textTransform: 'none', 
                borderRadius: 1.5,
                color: "#0084ff",
                borderColor: "#0084ff",
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              sx={{ 
                textTransform: 'none', 
                borderRadius: 1.5,
                bgcolor: "#0084ff",
                px: 3,
                '&:hover': { bgcolor: "#0073e6" }
              }}
            >
              Save
            </Button>
            <IconButton onClick={handleClose} size="small" sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0 }}>
        <TableContainer component={Box}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: "#f8fafc", color: "#475569", py: 2 }}>PERMISSIONS</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: "#f8fafc", color: "#475569" }}>CREATE</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: "#f8fafc", color: "#475569" }}>READ</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: "#f8fafc", color: "#475569" }}>UPDATE</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: "#f8fafc", color: "#475569" }}>DELETE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((row, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(even)': { bgcolor: "#f8fafc" } }}>
                  <TableCell sx={{ py: 1.5, color: "#1e293b" }}>{row.module}</TableCell>
                  {['create', 'read', 'update', 'delete'].map(field => (
                    <TableCell align="center" key={field}>
                      <Checkbox 
                        checked={row[field]} 
                        onChange={() => handleCheckboxChange(index, field)}
                        size="small"
                        sx={{ color: "#cbd5e1", '&.Mui-checked': { color: "#0084ff" } }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleModal;