'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
  Tooltip,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Layout from '@/components/Layout';

const initialData = [
  {
    id: 1,
    type: 'Discussion Forum',
    course: 'Mathematics 101',
    description: 'General discussion for the course',
    participants: 25,
    lastActivity: '2025-10-24',
    messages: [
      { id: 1, sender: 'Student A', content: 'Hello everyone!', timestamp: '2025-10-24 10:00' },
    ]
  },
  {
    id: 2,
    type: 'Chat Group',
    course: 'Physics 201',
    description: 'Group chat for peer discussion',
    participants: 15,
    lastActivity: '2025-10-23',
    messages: []
  },
  {
    id: 3,
    type: 'Peer Messaging',
    course: 'Chemistry 301',
    description: 'Direct messaging between peers',
    participants: 30,
    lastActivity: '2025-10-22',
    messages: []
  },
  {
    id: 4,
    type: 'Group Assignment',
    course: 'Computer Science 101',
    description: 'Collaborative project folder',
    participants: 10,
    lastActivity: '2025-10-21',
    messages: []
  },
];

const ChatingPage = () => {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openItem, setOpenItem] = useState(null); // Modal ke liye
  const [newMessage, setNewMessage] = useState('');

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Discussion Forum': return <ForumIcon />;
      case 'Chat Group': return <ChatIcon />;
      case 'Peer Messaging': return <GroupIcon />;
      case 'Group Assignment': return <AssignmentIcon />;
      default: return null;
    }
  };

  const handleOpen = (item) => setOpenItem(item);
  const handleClose = () => {
    setOpenItem(null);
    setNewMessage('');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedData = data.map((item) => {
      if (item.id === openItem.id) {
        return {
          ...item,
          messages: [
            ...(item.messages || []),
            { id: Date.now(), sender: 'Student X', content: newMessage, timestamp: new Date().toLocaleString() }
          ]
        };
      }
      return item;
    });

    setData(updatedData);
    setOpenItem(updatedData.find(i => i.id === openItem.id));
    setNewMessage('');
  };

  return (
    <Layout>
      <Box p={2} sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Typography variant="h5" mb={2}>
          Social Learning & Collaboration
        </Typography>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Participants</TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {getIcon(item.type)}
                        <Typography>{item.type}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{item.course}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.participants}</TableCell>
                    <TableCell>{item.lastActivity}</TableCell>
                    <TableCell>
                      <Tooltip title="Open">
                        <Button variant="outlined" size="small" onClick={() => handleOpen(item)}>
                          Open
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No records found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Modal for Messages */}
        <Dialog open={!!openItem} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {openItem?.type} - {openItem?.course}
          </DialogTitle>
          <DialogContent dividers>
            <Box maxHeight={300} overflow="auto" mb={2}>
              {openItem?.messages?.length === 0 && <Typography>No messages yet</Typography>}
              {openItem?.messages?.map((msg) => (
                <Box key={msg.id} mb={1} p={1} sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle2">{msg.sender} - {msg.timestamp}</Typography>
                  <Typography>{msg.content}</Typography>
                </Box>
              ))}
            </Box>

            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button variant="contained" onClick={handleSendMessage}>Send</Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default ChatingPage;
