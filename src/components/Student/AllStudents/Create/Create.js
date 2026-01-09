"use client";
import React, { useState } from "react";
import { Grid, TextField, Button, MenuItem, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const CreateCourseList = ({ handleClose, handleCreate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        courseId: "", courseName: "", courseDescription: "",
        duration: "", pricing: "", assignedTeachers: "",
        syllabus: null, video: "", status: "Active"
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'syllabus' && formData[key]) {
                    payload.append(key, formData[key]);
                } else {
                    payload.append(key, formData[key]);
                }
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courselist`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: payload
            });
            const result = await res.json();
            if (res.ok) {
                toast.success("Course Created!");
                handleCreate();
                handleClose();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Server Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={2}>
            <Grid container spacing={2}>
                <Grid item xs={6}><TextField fullWidth label="Course ID" name="courseId" onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Course Name" name="courseName" onChange={handleChange} /></Grid>
                <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Description" name="courseDescription" onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Duration" name="duration" onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Pricing" name="pricing" type="number" onChange={handleChange} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Teachers" name="assignedTeachers" onChange={handleChange} /></Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" component="label" fullWidth>
                        Upload Syllabus (PDF)
                        <input type="file" hidden accept=".pdf" onChange={(e) => setFormData({...formData, syllabus: e.target.files[0]})} />
                    </Button>
                </Grid>
                <Grid item xs={12}><TextField fullWidth label="Video URL" name="video" onChange={handleChange} /></Grid>
                <Grid item xs={12}>
                    <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Create Course"}
                </Button>
            </Box>
        </Box>
    );
};
export default CreateCourseList;