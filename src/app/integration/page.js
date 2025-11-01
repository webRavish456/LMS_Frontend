'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import Layout from '@/components/Layout'; // ✅ Include your layout wrapper

const IntegrationAPI = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Zoom Integration',
      type: 'Video Conferencing',
      status: 'Active',
      date: '2025-10-20',
      description: 'Integration with Zoom for live classes and meetings.',
    },
    {
      id: 2,
      name: 'Microsoft Teams',
      type: 'Collaboration',
      status: 'Active',
      date: '2025-10-22',
      description: 'Enables Teams-based classroom sessions and file sharing.',
    },
    {
      id: 3,
      name: 'SSO Support',
      type: 'Authentication',
      status: 'Completed',
      date: '2025-10-24',
      description: 'Single Sign-On integration using OAuth2 & JWT.',
    },
  ]);

  const [openView, setOpenView] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: '',
    status: 'Active',
    description: '',
  });

  // View integration
  const handleView = (integration) => {
    setSelectedIntegration(integration);
    setOpenView(true);
  };

  // Add new integration
  const handleCreateIntegration = () => {
    if (!newIntegration.name || !newIntegration.type)
      return alert('Please fill all fields');
    const newEntry = {
      id: integrations.length + 1,
      ...newIntegration,
      date: new Date().toLocaleDateString(),
    };
    setIntegrations([...integrations, newEntry]);
    setNewIntegration({ name: '', type: '', status: 'Active', description: '' });
    setOpenCreate(false);
  };

  return (
    <Layout>
      <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <Paper
          elevation={5}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid #d0d7de',
            backgroundColor: 'white',
          }}
        >
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#0d47a1' }}>
              Integration & API
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenCreate(true)}
              sx={{
                backgroundColor: '#0d47a1',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#1565c0' },
              }}
            >
              ➕ Add Integration
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Table Section */}
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#0d47a1' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Integration Name
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell
                    sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {integrations.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        sx={{
                          backgroundColor:
                            row.status === 'Active' ? '#1565c0' : '#2e7d32',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleView(row)}
                        sx={{
                          backgroundColor: '#1565c0',
                          color: 'white',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#0d47a1' },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Create Integration Dialog */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: '#0d47a1', color: 'white' }}>
            Add New Integration
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Integration Name"
                fullWidth
                value={newIntegration.name}
                onChange={(e) =>
                  setNewIntegration({ ...newIntegration, name: e.target.value })
                }
              />
              <TextField
                label="Type"
                fullWidth
                value={newIntegration.type}
                onChange={(e) =>
                  setNewIntegration({ ...newIntegration, type: e.target.value })
                }
              />
              <TextField
                select
                label="Status"
                fullWidth
                value={newIntegration.status}
                onChange={(e) =>
                  setNewIntegration({ ...newIntegration, status: e.target.value })
                }
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newIntegration.description}
                onChange={(e) =>
                  setNewIntegration({
                    ...newIntegration,
                    description: e.target.value,
                  })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ pr: 3, pb: 2 }}>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button
              onClick={handleCreateIntegration}
              variant="contained"
              sx={{
                backgroundColor: '#1565c0',
                '&:hover': { backgroundColor: '#0d47a1' },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Integration Dialog */}
        <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{ backgroundColor: '#0d47a1', color: 'white', fontWeight: 'bold' }}
          >
            Integration Details
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedIntegration && (
              <>
                <Typography variant="h6" fontWeight="bold" color="#1565c0">
                  {selectedIntegration.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <b>Type:</b> {selectedIntegration.type}
                </Typography>
                <Typography variant="body1">
                  <b>Status:</b> {selectedIntegration.status}
                </Typography>
                <Typography variant="body1">
                  <b>Date:</b> {selectedIntegration.date}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <b>Description:</b> {selectedIntegration.description}
                </Typography>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default IntegrationAPI;
