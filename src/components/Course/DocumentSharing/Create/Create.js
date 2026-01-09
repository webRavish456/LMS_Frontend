'use client'

import React, { useEffect, useState } from "react"
import {
    TextField,
    Grid,
    Button,
    Box,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const schema = yup.object().shape({
    topic: yup.string().required("Topic is required"),
    topicDescription: yup.string().required("Topic Description is required"),
    course: yup.string().required("Course is required"),
    teacher: yup.string().required("Teacher is required"),
    document: yup.mixed().test("required", "Document is required", (value) => {
        return value && value.length > 0;
    }),
});

const CreateDocumentSharing = ({ handleCreate, handleClose }) => {
    const [courseName, setCourseName] = useState([]);
    const [teacherName, setTeacherName] = useState([]);
    const token = Cookies.get('token');
    const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [loadingdata, setLoadingdata] = useState(true);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            topic: "",
            topicDescription: "",
            course: "",
            teacher: ""
        }
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [resCourse, resTeacher] = await Promise.all([
                    fetch(`${Base_url}/courselist`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${Base_url}/teacher`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                const [courseRes, teacherRes] = await Promise.all([resCourse.json(), resTeacher.json()]);

                if (courseRes.status === "success" && courseRes.data) {
                    setCourseName(courseRes.data);
                    // ✅ Automatically select a random Course
                    if (courseRes.data.length > 0) {
                        const randomCourse = courseRes.data[Math.floor(Math.random() * courseRes.data.length)];
                        setValue("course", randomCourse.courseName);
                    }
                }

                if (teacherRes.status === "success" && teacherRes.data) {
                    setTeacherName(teacherRes.data);
                    // ✅ Automatically select a random Teacher
                    if (teacherRes.data.length > 0) {
                        const randomTeacher = teacherRes.data[Math.floor(Math.random() * teacherRes.data.length)];
                        setValue("teacher", randomTeacher.teacherName);
                    }
                }
                setLoadingdata(false);
            } catch (error) {
                console.error("Fetch Error:", error);
                setLoadingdata(false);
            }
        };
        if (loadingdata) fetchInitialData();
    }, [loadingdata, Base_url, token, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formdata = new FormData();
            formdata.append("topic", data.topic);
            formdata.append("topicDescription", data.topicDescription);
            formdata.append("course", data.course);
            formdata.append("teacher", data.teacher);
            if (data.document && data.document.length > 0) {
                formdata.append("document", data.document[0]);
            }

            const res = await fetch(`${Base_url}/documentsharing`, {
                method: "POST",
                body: formdata,
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await res.json();

            if (result.status === "success") {
                toast.success("Created Successfully!");
                handleCreate(true);
                handleClose();
                reset();
            } else {
                toast.error(result.message || "Failed to create");
            }
        } catch (error) {
            toast.error("Error creating document: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ overflow: "hidden" }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label={<>Topic <span style={{ color: "red" }}>*</span></>}
                        {...register("topic")}
                        error={!!errors.topic}
                        helperText={errors.topic?.message}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label={<>Topic Description <span style={{ color: "red" }}>*</span></>}
                        {...register("topicDescription")}
                        error={!!errors.topicDescription}
                        helperText={errors.topicDescription?.message}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <InputLabel sx={{ fontSize: '0.8rem', mb: 0.5 }}>Course Name *</InputLabel>
                    <Controller
                        name="course"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} fullWidth error={!!errors.course} displayEmpty>
                                <MenuItem value="" disabled>Select Course</MenuItem>
                                {courseName.map((course, index) => (
                                    <MenuItem key={index} value={course.courseName}>
                                        {course.courseName}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    <Box sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>
                        {errors.course?.message}
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <InputLabel sx={{ fontSize: '0.8rem', mb: 0.5 }}>Teacher *</InputLabel>
                    <Controller
                        name="teacher"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} fullWidth error={!!errors.teacher} displayEmpty>
                                <MenuItem value="" disabled>Select Teacher</MenuItem>
                                {teacherName.map((t, i) => (
                                    <MenuItem key={i} value={t.teacherName}>
                                        {t.teacherName}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    <Box sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>
                        {errors.teacher?.message}
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        type="file"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Document (PDF)"
                        {...register("document")}
                        error={!!errors.document}
                        helperText={errors.document?.message}
                        inputProps={{ accept: "application/pdf" }}
                    />
                </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                <Button 
                    onClick={handleClose} 
                    sx={{ border: '1px solid #ccc', color: '#555' }}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading} 
                    sx={{ bgcolor: '#072eb0' }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {loading ? "Storing..." : "Submit"}
                </Button>
            </Box>
        </form>
    );
};

export default CreateDocumentSharing;