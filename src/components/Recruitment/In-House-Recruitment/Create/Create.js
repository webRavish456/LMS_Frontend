// "use client";

// import React, { useState, useEffect } from "react";

// import {
//   Box,
//   Button,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tabs,
//   Tab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
// } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import CreateCandidate from "./CreateCandidate";

// import Layout from "@/components/Layout";

// const InHouseRecruitmentPage = () => {
//   // Initial candidates
//   const [candidates, setCandidates] = useState([
//     { id: 1, name: "Arjun Singh", mobile: "7870712582", email: "arjun@example.com", address: "Delhi", status: "Hired" },
//     { id: 2, name: "Sumant Kumar", mobile: "9876543210", email: "sumant@example.com", address: "Bangalore", status: "On Hold" },
//   ]);

//   const [tabValue, setTabValue] = useState(0);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [filteredCandidates, setFilteredCandidates] = useState([]);

//   // Filter candidates by status based on tab
//   useEffect(() => {
//     let filtered = [...candidates];
//     if (tabValue === 1) filtered = filtered.filter(c => c.status === "Hired");
//     if (tabValue === 2) filtered = filtered.filter(c => c.status === "Not Hired");
//     if (tabValue === 3) filtered = filtered.filter(c => c.status === "On Hold");
//     setFilteredCandidates(filtered);
//   }, [candidates, tabValue]);

//   const handleTabChange = (_, newValue) => setTabValue(newValue);

//   // Add new candidate from CreateCandidate form
//   const handleAddCandidate = (data) => {
//     setCandidates([...candidates, { ...data, id: Date.now() }]);
//     toast.success("Candidate Added Successfully!");
//   };

//   return (
//     <Layout>
//       <ToastContainer />
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <h2>In-House Recruitment</h2>
//         <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
//           Add Candidate
//         </Button>
//       </Box>

//       <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
//         <Tab label="All" />
//         <Tab label="Hired" />
//         <Tab label="Not Hired" />
//         <Tab label="On Hold" />
//       </Tabs>

//       <Paper>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Mobile</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Address</TableCell>
//                 <TableCell>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredCandidates.length > 0 ? (
//                 filteredCandidates.map((c) => (
//                   <TableRow key={c.id}>
//                     <TableCell>{c.name}</TableCell>
//                     <TableCell>{c.mobile}</TableCell>
//                     <TableCell>{c.email}</TableCell>
//                     <TableCell>{c.address}</TableCell>
//                     <TableCell>{c.status}</TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">
//                     No candidates found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Dialog for Add Candidate Form */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Add New Candidate</DialogTitle>
//         <DialogContent>
//           <CreateCandidate handleCreate={handleAddCandidate} handleClose={() => setOpenDialog(false)} />
//         </DialogContent>
//       </Dialog>
//     </Layout>
//   );
// };

// export default InHouseRecruitmentPage;
