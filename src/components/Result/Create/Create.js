'use client'

import React, { useEffect, useState } from "react"
import { TextField, Grid, Button, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

const schema = yup.object().shape({
    examName: yup.string().required("Exam Name is required"),
    courseName: yup.string().required("Course Name is required"),
    teacherName: yup.string().required("Teacher Name is required"),
    testType: yup.string().required("Test Type is required"),
    resultDate: yup.string().required("Result Date is required"),
});

const CreateResult = ({ handleCreate, handleClose }) => {
    const [courseOptions, setCourseOptions] = useState([]);
    const [teacherOptions, setTeacherOptions] = useState([]);
    const token = Cookies.get('token');
    const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [loadingdata, setLoadingdata] = useState(true);

    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { examName: "", courseName: "", teacherName: "", testType: "", resultDate: "" }
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!token) return;
            try {
                const [resCourse, resTeacher] = await Promise.all([
                    fetch(`${Base_url}/courselist`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${Base_url}/teacher`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                const courseRes = await resCourse.json();
                const teacherRes = await resTeacher.json();

                if (courseRes.status === "success" && courseRes.data.length > 0) {
                    setCourseOptions(courseRes.data);
                    // ✅ Randomly Select Course
                    const random = courseRes.data[Math.floor(Math.random() * courseRes.data.length)];
                    setValue("courseName", random.courseName);
                }
                if (teacherRes.status === "success" && teacherRes.data.length > 0) {
                    setTeacherOptions(teacherRes.data);
                    // ✅ Randomly Select Teacher
                    const random = teacherRes.data[Math.floor(Math.random() * teacherRes.data.length)];
                    setValue("teacherName", random.teacherName);
                }
                setLoadingdata(false);
            } catch (error) {
                console.error(error);
                setLoadingdata(false);
            }
        };
        fetchInitialData();
    }, [Base_url, token, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`${Base_url}/result`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (result.status === "success") {
                toast.success("Result Created Successfully!");
                handleCreate(true);
                handleClose();
                reset();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Error submitting data");
        } finally {
            setLoading(false);
        }
    };

    if (loadingdata) return <Box sx={{display: 'flex', justifyContent: 'center', p: 3}}><CircularProgress /></Box>;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label={<>Exam Name <span style={{ color: "red" }}>*</span></>} {...register("examName")} error={!!errors.examName} helperText={errors.examName?.message} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.courseName}>
                        <InputLabel>Course Name *</InputLabel>
                        <Controller name="courseName" control={control} render={({ field }) => (
                            <Select {...field} label="Course Name *" displayEmpty>
                                {courseOptions.map((c, i) => <MenuItem key={i} value={c.courseName}>{c.courseName}</MenuItem>)}
                            </Select>
                        )} />
                        <Box sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>{errors.courseName?.message}</Box>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.teacherName}>
                        <InputLabel>Teacher Name *</InputLabel>
                        <Controller name="teacherName" control={control} render={({ field }) => (
                            <Select {...field} label="Teacher Name *" displayEmpty>
                                {teacherOptions.map((t, i) => <MenuItem key={i} value={t.teacherName}>{t.teacherName}</MenuItem>)}
                            </Select>
                        )} />
                        <Box sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>{errors.teacherName?.message}</Box>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.testType}>
                        <InputLabel>Test Type *</InputLabel>
                        <Controller name="testType" control={control} render={({ field }) => (
                            <Select {...field} label="Test Type *">
                                <MenuItem value="Viva">Viva</MenuItem>
                                <MenuItem value="Quiz">Quiz</MenuItem>
                                <MenuItem value="Test">Test</MenuItem>
                            </Select>
                        )} />
                        <Box sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>{errors.testType?.message}</Box>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <TextField fullWidth type="date" label={<>Result Date <span style={{ color: "red" }}>*</span></>} InputLabelProps={{ shrink: true }} {...register("resultDate")} error={!!errors.resultDate} helperText={errors.resultDate?.message} />
                </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                <Button onClick={handleClose} className="secondary_button">Cancel</Button>
                <Button type="submit" className="primary_button" disabled={loading}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                </Button>
            </Box>
        </form>
    );
};

export default CreateResult;