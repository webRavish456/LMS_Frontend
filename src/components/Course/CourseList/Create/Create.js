"use client";
import React, { useState } from "react";
import { Grid, TextField, Button, MenuItem, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VideoFileIcon from "@mui/icons-material/VideoFile";

const CreateCourseList = ({ handleClose, handleCreate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        courseId: "", 
        courseName: "", 
        courseDescription: "",
        duration: "", 
        pricing: "", 
        assignedTeachers: "", // Input as string, converted to array on submit
        syllabus: null, 
        video: null, 
        status: "Active"
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Optional: Check file size (e.g., limit video to 50MB for stability)
        if (e.target.name === "video" && file.size > 50 * 1024 * 1024) {
            toast.error("Video file is too large (Max 50MB)");
            return;
        }

        setFormData({ ...formData, [e.target.name]: file });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault(); 
        
        const token = localStorage.getItem("token");

        // 1. Validation
        if (!formData.courseId || !formData.courseName || !formData.courseDescription || !formData.duration || !formData.pricing) {
            toast.error("Please fill all required fields (*)");
            return;
        }

        setLoading(true);

        try {
            // 2. Prepare Payload
            const payload = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== "") {
                    // Convert teachers string to array if your backend expects an array
                    if (key === "assignedTeachers" && typeof formData[key] === "string") {
                        payload.append(key, formData[key]); 
                    } else {
                        payload.append(key, formData[key]);
                    }
                }
            });

            // 3. API Request
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courselist`, {
                method: "POST",
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
                body: payload 
            });

            const result = await res.json();

            if (res.ok && result.status === "success") {
                toast.success("Course Created Successfully!");
                if (handleCreate) handleCreate(); // Refresh table
                handleClose(); // Close Modal
            } else {
                toast.error(result.message || "Failed to save course");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            toast.error("Server connection failed. Check file sizes.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Course ID *" name="courseId" onChange={handleChange} value={formData.courseId} disabled={loading} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Course Name *" name="courseName" onChange={handleChange} value={formData.courseName} disabled={loading} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline rows={3} label="Description *" name="courseDescription" onChange={handleChange} value={formData.courseDescription} disabled={loading} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Duration *" name="duration" placeholder="e.g. 6 Months" onChange={handleChange} value={formData.duration} disabled={loading} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Pricing (INR) *" name="pricing" type="number" onChange={handleChange} value={formData.pricing} disabled={loading} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Assigned Teachers" name="assignedTeachers" placeholder="Comma separated names" onChange={handleChange} value={formData.assignedTeachers} disabled={loading} />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" component="label" fullWidth startIcon={<CloudUploadIcon />} color={formData.syllabus ? "success" : "primary"} disabled={loading}>
                            {formData.syllabus ? formData.syllabus.name.substring(0, 15) + "..." : "Syllabus (PDF)"}
                            <input type="file" hidden accept=".pdf" name="syllabus" onChange={handleFileChange} />
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" component="label" fullWidth startIcon={<VideoFileIcon />} color={formData.video ? "success" : "secondary"} disabled={loading}>
                            {formData.video ? formData.video.name.substring(0, 15) + "..." : "Upload Video"}
                            <input type="file" hidden accept="video/*" name="video" onChange={handleFileChange} />
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} disabled={loading}>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                    <Button type="button" onClick={handleClose} disabled={loading} variant="outlined" color="inherit">
                        Cancel
                    </Button>

                    <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "#072eb0", px: 4, minWidth: "140px" }}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Create Course"}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateCourseList;