
'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  Stack,
  Button
} from '@mui/material';
import Layout from '@/components/Layout';

const LRSSupport = () => {
  const features = [
    {
      id: 1,
      feature: 'Integration with xAPI for detailed learner tracking',
      description:
        'Send xAPI statements to an LRS (actor, verb, object, context) for events like lesson_started, completed, scored.',
      notes:
        'Use an xAPI client (e.g., tincanjs or custom fetch) — secure with Basic or OAuth, store LRS endpoint & credentials in env vars.',
      status: 'Planned',
    },
    {
      id: 2,
      feature: 'Capture offline and cross-platform learning activities',
      description:
        'Queue xAPI statements locally when offline and sync them to the LRS when connectivity returns; support mobile & web.',
      notes:
        'Implement local queue (IndexedDB / localStorage), retry logic, deduplication, and conflict resolution on sync.',
      status: 'Planned',
    },
  ];

  const statusColor = (s) => {
    if (s === 'Active') return 'success';
    if (s === 'Planned') return 'default';
    if (s === 'In Progress') return 'warning';
    return 'default';
  };

  return (
    <Layout>
      <Box
        sx={{
          backgroundColor: '#E3F2FD', // sky background
          minHeight: '100vh',
          p: 4,
        }}
      >
        <Typography variant="h5" fontWeight="700" color="#0D47A1" gutterBottom>
          🗄️ 30. Learning Record Store (LRS) Support
        </Typography>
        <Typography variant="body2" color="#1565C0" mb={2}>
          Provide xAPI integration and offline/cross-platform statement capture to centralize learner activity.
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#ffffff',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#BBDEFB' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#0D47A1' }}>Sr. No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0D47A1' }}>Feature</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0D47A1' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0D47A1' }}>Implementation Notes</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0D47A1' }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {features.map((f) => (
                <TableRow key={f.id} hover sx={{ '&:hover': { backgroundColor: '#E1F5FE' } }}>
                  <TableCell>{f.id}</TableCell>
                  <TableCell sx={{ minWidth: 220 }}>{f.feature}</TableCell>
                  <TableCell sx={{ maxWidth: 360, whiteSpace: 'normal' }}>{f.description}</TableCell>
                  <TableCell sx={{ maxWidth: 360, whiteSpace: 'normal' }}>{f.notes}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={f.status} color={statusColor(f.status)} size="small" />
                      {/* example action buttons - replace with real actions */}
                      <Button size="small" variant="outlined">Docs</Button>
                      <Button size="small" variant="contained">Implement</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Optional short snippet / guidance area */}
        <Paper sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: '#F1F8FF' }}>
          <Typography variant="subtitle2" color="#0D47A1" mb={1}><strong>Quick Implementation Tips</strong></Typography>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#0D47A1' }}>
            <li>Keep LRS endpoint and credentials in environment variables (e.g., NEXT_PUBLIC_LRS_ENDPOINT).</li>
            <li>Send xAPI statements as JSON to the LRS using Basic Auth or OAuth2 Bearer tokens.</li>
            <li>For offline capture, queue statements in IndexedDB and sync on reconnect with exponential backoff.</li>
          </ul>
        </Paper>
      </Box>
    </Layout>
  );
};

export default LRSSupport;
