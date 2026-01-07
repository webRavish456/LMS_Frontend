// 'use client';
// import React, { useState } from "react";
// import GroupCollaboration from '../../components/social/GroupCollaboration';

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

// export default function GroupCollaboration() {
//   const [tasks, setTasks] = useState([
//     { member: "Arjun", task: "Design project UI" },
//     { member: "Rahul", task: "Backend API setup" },
//   ]);
//   const [newMember, setNewMember] = useState("");
//   const [newTask, setNewTask] = useState("");

//   const handleAddTask = () => {
//     if (newMember.trim() && newTask.trim()) {
//       setTasks([...tasks, { member: newMember, task: newTask }]);
//       setNewMember("");
//       setNewTask("");
//     }
//   };

//   return (
//     <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Group Collaboration
//       </Typography>
//       <Divider sx={{ mb: 2 }} />

//       <List>
//         {tasks.map((t, i) => (
//           <ListItem key={i} sx={{ borderBottom: "1px solid #eee" }}>
//             <ListItemText
//               primary={<b>{t.member}</b>}
//               secondary={t.task}
//             />
//           </ListItem>
//         ))}
//       </List>

//       <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
//         <TextField
//           label="Member Name"
//           value={newMember}
//           onChange={(e) => setNewMember(e.target.value)}
//           fullWidth
//         />
//         <TextField
//           label="Task Description"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//           fullWidth
//         />
//         <Button variant="contained" onClick={handleAddTask}>
//           Add
//         </Button>
//       </Box>
//     </Paper>
//   );
// }
