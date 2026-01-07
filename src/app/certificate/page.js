'use client';

import React, { useState, useEffect, useRef } from "react";
import {
    Paper, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination,
    Box, IconButton, Chip, Button, Stack, Typography, Dialog, DialogContent, DialogTitle,
    TextField, FormControl, InputLabel, Select, MenuItem, Divider, Tooltip,
    ThemeProvider, createTheme, CssBaseline
} from "@mui/material";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add"; 
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import DeleteIcon from "@mui/icons-material/Delete"; 
import EditIcon from "@mui/icons-material/Edit"; 
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Layout from '@/components/Layout'; 


const darkBlueTheme = createTheme({
    palette: {
        mode: 'dark',
        
        background: {
            default: '#0A0A2A', 
            paper: '#0A0A2A',   
        },
        
        primary: { 
            main: '#4FC3F7' 
        }, 
        text: { primary: '#E0E0E0', secondary: '#B0B0B0' },
        error: { main: '#f44336' },
    },
    components: {
        MuiTableCell: { styleOverrides: { root: { borderColor: 'rgba(255, 255, 255, 0.1)' }}},
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' }}},
        MuiTableFooter: { styleOverrides: { root: { backgroundColor: '#0A0A2A' }}}, 
        MuiTablePagination: {
            styleOverrides: {
                root: { color: '#E0E0E0' },
                selectIcon: { color: '#E0E0E0' },
                actions: { '& button': { color: '#B0B0B0', '&:disabled': { color: 'rgba(255, 255, 255, 0.3)' }}} 
            }
        },
        MuiInputBase: { styleOverrides: { root: { backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#E0E0E0' }}},
        MuiOutlinedInput: { styleOverrides: { notchedOutline: { borderColor: 'rgba(255, 255, 255, 0.23)' }}},
    }
});

// --- Certificate Template ---
const CertificateTemplate = ({ name, issuer, onClose }) => {
    const certRef = useRef();
    const handleDownload = async () => {
        const canvas = await html2canvas(certRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
        pdf.save(`${name}_Certificate.pdf`);
        toast.success("Certificate downloaded successfully!");
    };

    return (
        <Box sx={{ textAlign: "center", p: 2 }}>
            <Box ref={certRef} sx={{ 
                width: "1123px", height: "794px", margin: "0 auto", 
                backgroundImage: `url('sidebar/certification.png')`, 
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat", 
                position: "relative"
            }}>
                <Box sx={{
                    position: "absolute", top: "48%", left: "50%",
                    transform: "translate(-50%, -50%)", textAlign: "center", width: "80%",
                }}>
                    <Typography variant="h3" sx={{ 
                        fontWeight: "bold", 
                        mb: 1, 
                        fontSize: '40px',
                        display: 'inline-block', 
                        padding: '2px 30px',
                        color: '#000000' 
                    }}>
                        {name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "18px", color: '#000000' }}>Full Stack Development Internship</Typography>
                    <Typography variant="body2" sx={{ mt: 2, fontSize: "16px", color: '#000000' }}>Issued by <strong>{issuer}</strong> on {new Date().toLocaleDateString()}</Typography>
                </Box>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleDownload} startIcon={<FileDownloadIcon />}>Download PDF</Button>
                <Button variant="outlined" onClick={onClose}>Close Preview</Button>
            </Stack>
        </Box>
    );
};

// --- Create Dialog Content ---
const CreateCertification = ({ handleCreate, handleClose }) => {
    const [formData, setFormData] = useState({ name: '', issuer: 'Tech Academy', status: 'Active' });
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleMockCreate = () => {
        if (!formData.name.trim() || !formData.issuer.trim()) return toast.error("Required.");
        const newCert = { id: Date.now(), issueDate: new Date().getTime(), course: "Full Stack Development", ...formData };
        handleCreate(newCert); 
        handleClose();
        toast.success("Certificate created successfully!");
    };

    return (
        <DialogContent sx={{ p: 3 }}>
            <Stack spacing={2}>
                <TextField size="small" label="Recipient Name" name="name" value={formData.name} onChange={handleChange} required />
                <TextField size="small" label="Issuing Authority" name="issuer" value={formData.issuer} onChange={handleChange} required />
                <FormControl size="small"><InputLabel>Status</InputLabel>
                    <Select label="Status" name="status" value={formData.status} onChange={handleChange}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button onClick={handleClose} variant="outlined">Cancel</Button>
                <Button variant="contained" onClick={handleMockCreate}>Create</Button>
            </Stack>
        </DialogContent>
    );
};

const CertificationPageContent = () => { 
const [certifications, setCertifications] = useState([
    { id: 1, name: 'Alice Johnson', course: 'Full Stack Development', issuer: 'Tech Academy', status: 'Active', issueDate: new Date(2023, 5, 10).getTime() },
    { id: 2, name: 'Bob Smith', course: 'Full Stack Development', issuer: 'Tech Academy', status: 'Expired', issueDate: new Date(2022, 10, 15).getTime() },
]); 
  const [filteredCertifications, setFilteredCertifications] = useState(certifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteData, setDeleteData] = useState(null); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const searchTimerRef = useRef(null);

  useEffect(() => {
    const filtered = certifications.filter((c) => (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredCertifications(filtered);
    setPage(0);
  }, [searchTerm, certifications]);

  const handleSearchDebounced = (term) => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => setSearchTerm(term || ""), 300);
  };
  const handleCreate = (newCert) => setCertifications(prev => [...prev, newCert]);
  
  
  const handleView = (cert) => { setViewData(cert); setViewOpen(true); };
  
  
  const handleEdit = (cert) => { 
      toast.info(`Edit feature activated for: ${cert.name}`); 
  };
  
  const handleDelete = (cert) => { setDeleteData(cert); setDeleteOpen(true); };
  const confirmDelete = () => {
    setCertifications(prev => prev.filter(c => c.id !== deleteData.id));
    setDeleteOpen(false);
    toast.success("Certificate deleted successfully!");
  };
  const formatDate = (d) => new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(new Date(d));
    
  return (
      <Box p={2} sx={{ minHeight: "calc(100vh - 64px)" }}> 
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
          <Box>
        
            <Typography variant="h5" color="primary">Certificate Management</Typography>
            <Typography variant="body2" color="text.secondary">Total certificates issued: <strong>{certifications.length}</strong></Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField fullWidth size="small" placeholder="Search" onChange={(e) => handleSearchDebounced(e.target.value)} variant="outlined"/>
            <Chip label={`${filteredCertifications.length} results`} color="primary" size="small" />
            
            
            <Button 
                variant="contained" 
                onClick={() => setCreateOpen(true)} 
                size="small" 
                sx={{ 
                    
                    backgroundColor: '#0A0A2A', 
                    '&:hover': {
                         backgroundColor: '#1A1A3A', 
                    },
                    color: '#FFFFFF', 
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase', 
                    fontSize: '0.6rem', 
                    padding: '4px 32px', 
                    border: '1px solid #4FC3F7', 
                }}
            >
                CREATE CERTIFICATE
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ mt: 1, p: 1, boxShadow: "0 4px 15px rgba(0,0,0,0.5)" }}>
          <Table>
            <TableHead>
              <TableRow>
                {['SI.No', 'Recipient Name', 'Course', 'Issuer', 'Status', 'Issue Date', 'Actions'].map(header => <TableCell key={header} sx={{ fontWeight: 600 }}>{header}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCertifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cert, idx) => (
                <TableRow key={cert.id} hover>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{cert.name}</TableCell>
                  <TableCell>{cert.course || "N/A"}</TableCell> 
                  <TableCell>{cert.issuer}</TableCell>
                  <TableCell><Chip label={cert.status || "Unknown"} color={cert.status === "Active" ? "success" : cert.status === "Expired" ? "error" : "default"} size="small" /></TableCell>
                  <TableCell>{formatDate(cert.issueDate)}</TableCell>
                  <TableCell>
                      <Tooltip title="View"><IconButton onClick={() => handleView(cert)} size="small" color="info"><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Download"><IconButton onClick={() => handleView(cert)} size="small" color="success"><FileDownloadIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit"><IconButton onClick={() => handleEdit(cert)} size="small" color="primary"><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton onClick={() => handleDelete(cert)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCertifications.length === 0 && (<TableRow><TableCell colSpan={7} align="center">No Certificates Found.</TableCell></TableRow>)}
            </TableBody>
            <TableFooter><TableRow><TablePagination rowsPerPageOptions={[5,10,25]} count={filteredCertifications.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, newPage) => setPage(newPage)} onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }} labelRowsPerPage="Rows per page:"/></TableRow></TableFooter>
          </Table>
        </Paper>

        <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm"><DialogTitle>Create New Certificate</DialogTitle><IconButton onClick={() => setCreateOpen(false)} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton><CreateCertification handleCreate={handleCreate} handleClose={() => setCreateOpen(false)} /></Dialog>
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="lg"><DialogTitle>View Certificate: {viewData?.name}</DialogTitle><IconButton onClick={() => setViewOpen(false)} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton><DialogContent dividers>{viewData && <CertificateTemplate name={viewData.name} issuer={viewData.issuer} onClose={() => setViewOpen(false)} />}</DialogContent></Dialog>
        
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent dividers>
                <Typography>Are you sure you want to delete the certificate for <strong>{deleteData?.name}</strong>?</Typography>
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}><Button onClick={() => setDeleteOpen(false)} variant="outlined">Cancel</Button><Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button></Stack>
            </DialogContent>
        </Dialog>
      </Box>
  );
};

// =========================================================================
//                             EXPORT (THEME WRAPPER)
// =========================================================================

const CertificationPage = () => (
    <ThemeProvider theme={darkBlueTheme}>
        <CssBaseline /> 
        <Layout> 
            <CertificationPageContent />
        </Layout>
    </ThemeProvider>
);

export default CertificationPage;