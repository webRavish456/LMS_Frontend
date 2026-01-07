// 'use client';
// import React, { useState } from "react";
// import PeerMessaging from '../../components/social/PeerMessaging';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";

// export default function PeerMessaging() {
//   const [selectedUser, setSelectedUser] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   const users = ["Arjun", "Rahul", "Sneha", "Priya"];

//   const handleSend = () => {
//     if (text.trim() && selectedUser) {
//       setMessages([...messages, { user: selectedUser, text }]);
//       setText("");
//     }
//   };

//   return (
//     <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Peer-to-Peer Messaging
//       </Typography>
//       <Divider sx={{ mb: 2 }} />

//       <FormControl fullWidth sx={{ mb: 2 }}>
//         <InputLabel>Select Peer</InputLabel>
//         <Select
//           value={selectedUser}
//           label="Select Peer"
//           onChange={(e) => setSelectedUser(e.target.value)}
//         >
//           {users.map((user, i) => (
//             <MenuItem key={i} value={user}>
//               {user}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <Box sx={{ height: 250, overflowY: "auto", mb: 2 }}>
//         {messages
//           .filter((m) => m.user === selectedUser)
//           .map((m, i) => (
//             <Typography key={i}>
//               <b>You:</b> {m.text}
//             </Typography>
//           ))}
//       </Box>

//       <Box sx={{ display: "flex", gap: 1 }}>
//         <TextField
//           label="Type message..."
//           fullWidth
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <Button variant="contained" onClick={handleSend}>
//           Send
//         </Button>
//       </Box>
//     </Paper>
//   );
// }
