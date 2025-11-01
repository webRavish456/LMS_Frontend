// src/app/content-authoring/page.js
'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Stack,
  Card,
  CardContent
} from '@mui/material';
import Layout from '@/components/Layout';
import Editor from '@/components/Editor/Editor';
import SCORMUploader from '@/components/SCORMUploader/SCORMUploader';
import MultimediaPreview from '@/components/MultimediaPreview/MultimediaPreview';

const ContentAuthoringPage = () => {
  const [contentList, setContentList] = useState([]);
  const [files, setFiles] = useState([]);

  const handleSaveContent = (text) => {
    setContentList((prev) => [...prev, { text, date: new Date().toLocaleString() }]);
  };

  const handleFileUpload = (file) => {
    setFiles((prev) => [...prev, file]);
  };

  return (
    <Layout>
      <Box
        p={3}
        sx={{
          backgroundColor: '#E3F2FD', // 🌤️ Sky blue page background
          minHeight: '100vh',
          color: '#0A0A0A',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom color="#0D47A1">
          ✏️ Content Authoring Workspace
        </Typography>
        <Typography variant="body1" color="#1565C0" mb={3}>
          Create, manage, and preview your e-learning content efficiently.
        </Typography>

        {/* Editor Section */}
        <Card
          sx={{
            mb: 4,
            boxShadow: 3,
            borderRadius: 3,
            backgroundColor: '#BBDEFB', // 🌤️ Lighter sky blue card
            color: '#0D47A1',
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom color="#0D47A1">
              🧩 Course Content Editor
            </Typography>
            <Divider sx={{ mb: 2, borderColor: '#90CAF9' }} />

            {/* White Editor Box */}
            <Box
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: 2,
                p: 2,
                color: '#000',
              }}
            >
              <Editor onSave={handleSaveContent} />
            </Box>
          </CardContent>
        </Card>

        {/* SCORM and Multimedia Section */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
          <Card
            sx={{
              flex: 1,
              boxShadow: 3,
              borderRadius: 3,
              backgroundColor: '#BBDEFB', // 🌤️ same soft blue
              color: '#0D47A1',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="#0D47A1">
                📦 SCORM Package Uploader
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#90CAF9' }} />
              <SCORMUploader onUpload={handleFileUpload} />
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              boxShadow: 3,
              borderRadius: 3,
              backgroundColor: '#BBDEFB',
              color: '#0D47A1',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="#0D47A1">
                🎬 Multimedia Preview
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#90CAF9' }} />
              <MultimediaPreview files={files} />
            </CardContent>
          </Card>
        </Stack>

        {/* Saved Content Table */}
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: '#BBDEFB', // 🌤️ light sky table background
            color: '#0D47A1',
          }}
        >
          <Typography variant="h6" gutterBottom color="#0D47A1">
            🗂️ Saved Contents
          </Typography>
          <Divider sx={{ mb: 2, borderColor: '#90CAF9' }} />
          {contentList.length === 0 ? (
            <Typography
              variant="body2"
              color="#1565C0"
              align="center"
              py={3}
            >
              No content added yet. Use the editor above to create new content.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#0D47A1' }}>Content</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#0D47A1' }}>Date Added</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contentList.map((c, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: '#90CAF9' }, // 🌤️ hover light blue
                    }}
                  >
                    <TableCell sx={{ color: '#0A0A0A' }}>{c.text}</TableCell>
                    <TableCell sx={{ color: '#0A0A0A' }}>{c.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default ContentAuthoringPage;
