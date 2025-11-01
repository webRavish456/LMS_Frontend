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
} from '@mui/material';
import Layout from '@/components/Layout'; // ✅ Import your Layout component

const AlumniManagement = () => {
  const features = [
    { id: 1, feature: 'Maintain records of course completers' },
    { id: 2, feature: 'Facilitate networking and community building' },
  ];

  return (
    <Layout>
      <Box
        sx={{
          backgroundColor: '#e0f7fa', // 🌤️ sky color background
          minHeight: '100vh',
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          color="#01579b"
          textAlign="center"
        >
          🎓 Alumni Management
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            mt: 3,
            borderRadius: 3,
            boxShadow: 4,
            backgroundColor: '#ffffff',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#01579b' }}>
                  Sr. No.
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#01579b' }}>
                  Feature Description
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {features.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:hover': { backgroundColor: '#e1f5fe' },
                  }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.feature}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default AlumniManagement;
