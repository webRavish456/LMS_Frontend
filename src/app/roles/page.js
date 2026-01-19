'use client'
import React, { useState } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Switch, IconButton, Button, Stack, Container, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Checkbox, Breadcrumbs, Link
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Layout from "@/components/Layout";
import { toast } from "react-toastify";

const RolesListPage = () => {
  const [open, setOpen] = useState(false); // Dialog Control
  const [roleName, setRoleName] = useState("");
  
  // Roles Table Data
  const [roles, setRoles] = useState([
    { id: 1, name: "Super Admin", status: true, canDelete: false },
    { id: 2, name: "Admin", status: true, canDelete: true },
    { id: 3, name: "Teacher", status: true, canDelete: true },
    { id: 4, name: "Student", status: true, canDelete: true },
  ]);

  // Permissions List (वही जो इमेज में थी)
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

  const handleSave = () => {
    if (!roleName) return toast.error("Please enter role name");
    
    // नया रोल लिस्ट में जोड़ें
    const newRole = {
      id: roles.length + 1,
      name: roleName,
      status: true,
      canDelete: true
    };
    
    setRoles([...roles, newRole]);
    toast.success(`${roleName} रोल सफलतापूर्वक बनाया गया!`);
    
    // रिसेट और क्लोज
    setOpen(false);
    setRoleName("");
    setPermissions(modules.map(mod => ({ module: mod, create: false, read: false, update: false, delete: false })));
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#334155" }}>
              Employees Role
            </Typography>
            <Breadcrumbs sx={{ fontSize: "0.85rem", mt: 0.5 }}>
              <Link underline="hover" color="inherit" href="#">Dashboard</Link>
              <Typography color="text.primary" sx={{ fontSize: "0.85rem" }}>Roles</Typography>
            </Breadcrumbs>
          </Box>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)} // Dialog खोलें
            sx={{ bgcolor: "#0084ff", textTransform: 'none', borderRadius: 2 }}
          >
            Create Role
          </Button>
        </Stack>

        {/* Roles List Table */}
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: "#475569" }}>ROLE</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: "#475569" }}>STATUS</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: "#475569" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ color: "#1e293b", fontWeight: 500 }}>{row.name}</TableCell>
                  <TableCell align="center">
                    <Switch checked={row.status} color="primary" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="success"><EditIcon fontSize="small" /></IconButton>
                    {row.canDelete && <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* --- Create Role Dialog (पॉप-अप में परमिशन टेबल) --- */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: "#f8fafc" }}>
            <Typography variant="h6" fontWeight="bold">Create New Role</Typography>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </DialogTitle>
          
          <DialogContent dividers>
            <Box sx={{ mb: 3, mt: 1 }}>
              <TextField 
                fullWidth 
                label="Enter role name" 
                variant="outlined" 
                size="small" 
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>PERMISSIONS</TableCell>
                    <TableCell align="center">CREATE</TableCell>
                    <TableCell align="center">READ</TableCell>
                    <TableCell align="center">UPDATE</TableCell>
                    <TableCell align="center">DELETE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissions.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: "0.85rem" }}>{row.module}</TableCell>
                      {['create', 'read', 'update', 'delete'].map(field => (
                        <TableCell align="center" key={field}>
                          <Checkbox 
                            checked={row[field]} 
                            onChange={() => handleCheckboxChange(index, field)}
                            size="small"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: "#f8fafc" }}>
  {/* यहाँ component="span" जोड़ें */}
  <Typography variant="h6" fontWeight="bold" component="span">
    Create New Role
  </Typography>
  <IconButton onClick={() => setOpen(false)}>
    <CloseIcon />
  </IconButton>
</DialogTitle>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default RolesListPage;