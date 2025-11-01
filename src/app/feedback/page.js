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
import Layout from '@/components/Layout'; // ✅ Make sure Layout file exists in components folder

const SurveysFeedback = () => {
  const features = [
    { id: 1, feature: 'Conduct course evaluation and satisfaction surveys' },
    { id: 2, feature: 'Gather actionable insights for course improvement' },
  ];

  return (
    <Layout>
      <Box
        sx={{
          backgroundColor: '#e3f2fd', // 🌤 sky blue background
          minHeight: '100vh',
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          color="#0d47a1"
          textAlign="center"
        >
          📝 Surveys & Feedback
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
              <TableRow sx={{ backgroundColor: '#90caf9' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
                  Sr. No.
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
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

export default SurveysFeedback;
