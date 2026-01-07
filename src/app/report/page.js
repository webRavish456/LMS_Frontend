'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
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

const AnalyticsReporting = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'User Reports',
      type: 'User Analytics',
      status: 'Active',
      date: '2025-10-25',
      description: 'Detailed report of user engagement and performance.',
    },
    {
      id: 2,
      name: 'Course Progress',
      type: 'Progress Tracking',
      status: 'Completed',
      date: '2025-10-24',
      description: 'Tracks learner progress and course completion rates.',
    },
  ]);

  const [openView, setOpenView] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    type: '',
    status: 'Active',
    description: '',
  });

  // View Report
  const handleView = (report) => {
    setSelectedReport(report);
    setOpenView(true);
  };

  // Export Report
  const handleExport = (report) => {
    const csvContent = `ID,Name,Type,Status,Date\n${report.id},${report.name},${report.type},${report.status},${report.date}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}_Report.csv`;
    a.click();
  };

  // Create Report
  const handleCreateReport = () => {
    if (!newReport.name || !newReport.type) return alert('Please fill all fields');
    const newEntry = {
      id: reports.length + 1,
      ...newReport,
      date: new Date().toLocaleDateString(),
    };
    setReports([...reports, newEntry]);
    setNewReport({ name: '', type: '', status: 'Active', description: '' });
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
              Analytics & Reporting
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
              ➕ Add New Report
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Table Section */}
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#0d47a1' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Report Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {reports.map((row) => (
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
                      <Stack direction="row" spacing={1} justifyContent="center">
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
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleExport(row)}
                          sx={{
                            borderColor: '#1565c0',
                            color: '#1565c0',
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: '#0d47a1',
                              backgroundColor: '#e3f2fd',
                            },
                          }}
                        >
                          Export
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Create Report Dialog */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: '#0d47a1', color: 'white' }}>
            Create New Report
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Report Name"
                fullWidth
                value={newReport.name}
                onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
              />
              <TextField
                label="Report Type"
                fullWidth
                value={newReport.type}
                onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
              />
              <TextField
                select
                label="Status"
                fullWidth
                value={newReport.status}
                onChange={(e) => setNewReport({ ...newReport, status: e.target.value })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newReport.description}
                onChange={(e) =>
                  setNewReport({ ...newReport, description: e.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ pr: 3, pb: 2 }}>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button
              onClick={handleCreateReport}
              variant="contained"
              sx={{
                backgroundColor: '#1565c0',
                '&:hover': { backgroundColor: '#0d47a1' },
              }}
            >
              Save Report
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: '#0d47a1', color: 'white', fontWeight: 'bold' }}>
            Report Details
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedReport && (
              <>
                <Typography variant="h6" fontWeight="bold" color="#1565c0">
                  {selectedReport.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <b>Type:</b> {selectedReport.type}
                </Typography>
                <Typography variant="body1">
                  <b>Status:</b> {selectedReport.status}
                </Typography>
                <Typography variant="body1">
                  <b>Date:</b> {selectedReport.date}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <b>Description:</b> {selectedReport.description}
                </Typography>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default AnalyticsReporting;
