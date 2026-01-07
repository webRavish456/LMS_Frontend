// 'use client';
// import React, { useState } from "react";
// import DiscussionForm from '../../components/Social/DiscussionForm';

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

// export default function DiscussionForum() {
//   const [posts, setPosts] = useState([
//     { user: "Arjun Singh", text: "How to prepare for the mid-term?" },
//     { user: "Rahul Kumar", text: "Focus on modules 3 and 4, mostly asked!" },
//   ]);

//   const [newPost, setNewPost] = useState("");

//   const handleAddPost = () => {
//     if (newPost.trim() !== "") {
//       setPosts([...posts, { user: "You", text: newPost }]);
//       setNewPost("");
//     }
//   };

//   return (
//     <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Discussion Form
//       </Typography>
//       <Divider sx={{ mb: 2 }} />

//       <List>
//         {posts.map((post, index) => (
//           <ListItem key={index} sx={{ borderBottom: "1px solid #eee" }}>
//             <ListItemText
//               primary={<b>{post.user}</b>}
//               secondary={post.text}
//             />
//           </ListItem>
//         ))}
//       </List>

//       <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
//         <TextField
//           label="Write a comment..."
//           fullWidth
//           value={newPost}
//           onChange={(e) => setNewPost(e.target.value)}
//         />
//         <Button variant="contained" onClick={handleAddPost}>
//           Post
//         </Button>
//       </Box>
//     </Paper>
//   );
// }
