// 'use client';
// import React, { useState } from "react";
// import ChatGroups from '../../components/social/ChatGroups';

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
// } from "@mui/material";

// export default function ChatGroups() {
//   const [messages, setMessages] = useState([
//     { user: "Admin", text: "Welcome to the Course Chat Group!" },
//     { user: "Arjun", text: "Hi everyone 👋" },
//   ]);
//   const [newMessage, setNewMessage] = useState("");

//   const handleSend = () => {
//     if (newMessage.trim() !== "") {
//       setMessages([...messages, { user: "You", text: newMessage }]);
//       setNewMessage("");
//     }
//   };

//   return (
//     <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Chat Groups
//       </Typography>
//       <Divider sx={{ mb: 2 }} />

//       <Box sx={{ height: 300, overflowY: "auto", mb: 2 }}>
//         {messages.map((msg, index) => (
//           <Box key={index} sx={{ mb: 1 }}>
//             <Typography variant="subtitle2">
//               <b>{msg.user}:</b> {msg.text}
//             </Typography>
//           </Box>
//         ))}
//       </Box>

//       <Box sx={{ display: "flex", gap: 1 }}>
//         <TextField
//           label="Type your message..."
//           fullWidth
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <Button variant="contained" onClick={handleSend}>
//           Send
//         </Button>
//       </Box>
//     </Paper>
//   );
// }
