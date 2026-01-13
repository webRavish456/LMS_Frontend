'use client'

import React, { useEffect, useState } from "react"
import {
    TextField, Grid, useMediaQuery, Button, Box, CircularProgress, MenuItem
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

const schema = yup.object().shape({
    studentName: yup.string().required("Student Name is required"),
    gender: yup.string().required("Gender is required"),
    mobileNumber: yup.string().required("Mobile Number is required"),
    emailId: yup.string().email("Invalid email").required("Email is required"),
    dob: yup.string().required("DOB is required"),
    address: yup.string().required("Address is required"),
    enrollmentDate: yup.string().required("Enrollment Date is required"),
    courseName: yup.string().required("Course is required"),
});

const CreateAllStudent = ({ handleCreate, handleClose }) => {
    const [courses, setCourses] = useState([
        { _id: "1", courseName: "Full Stack Development" },
        { _id: "2", courseName: "Data Science & AI" },
        { _id: "3", courseName: "UI/UX Design" },
        { _id: "4", courseName: "Digital Marketing" },
        { _id: "5", courseName: "Cyber Security" }
    ]);
    
    const isSmScreen = useMediaQuery("(max-width:768px)");
    const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);

    // ✅ टोकन प्राप्त करने का सही तरीका
    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            studentName: "", gender: "", mobileNumber: "", emailId: "",
            dob: "", address: "", enrollmentDate: "", courseName: ""
        }
    });

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${Base_url}/courselist`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.status === "success" && result.data.length > 0) {
                    setCourses(result.data);
                }
            } catch (error) {
                console.log("Using dummy courses fallback");
            }
        };
        fetchCourseData();
    }, [Base_url, token]);

    const onSubmit = async (data) => {
        if (!token) {
            toast.error("Session expired. Please login again.");
            return;
        }

        setLoading(true);
        const formdata = new FormData();
        formdata.append("studentName", data.studentName);
        formdata.append("gender", data.gender);
        formdata.append("mobileNumber", data.mobileNumber);
        formdata.append("emailId", data.emailId);
        formdata.append("dob", data.dob);
        formdata.append("address", data.address);
        formdata.append("enrollmentDate", data.enrollmentDate);
        formdata.append("course", data.courseName);

        try {
            const response = await fetch(`${Base_url}/allstudents`, {
                method: "POST",
                body: formdata,
                headers: { 
                    "Authorization": `Bearer ${token.trim()}` // ✅ ट्रिम किया ताकि कोई एक्स्ट्रा स्पेस न रहे
                },
            });

            const res = await response.json();

            if (res.status === "success") {
                toast.success("Student Created Successfully!");
                handleCreate(true);
                handleClose();
                reset();
            } else {
                toast.error(res.message || "Something went wrong");
                if (res.message === "Invalid token") {
                    console.log("Check if JWT_SECRET in .env matches the one in Login Controller");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    const commonInputProps = {
        fullWidth: true,
        variant: "outlined",
        sx: { "& .MuiOutlinedInput-root": { borderRadius: "10px", height: "55px" } }
    };

    return (
        <Box sx={{ p: 1 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField {...commonInputProps} label="Student Name *" {...register("studentName")} error={!!errors.studentName} helperText={errors.studentName?.message} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="courseName"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} {...commonInputProps} select label="Course Name *" error={!!errors.courseName} helperText={errors.courseName?.message}>
                                    {courses.map((c) => (
                                        <MenuItem key={c._id} value={c.courseName}>{c.courseName}</MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} {...commonInputProps} select label="Gender *" error={!!errors.gender} helperText={errors.gender?.message}>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="others">Others</MenuItem>
                                </TextField>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField {...commonInputProps} label="DOB *" type="date" InputLabelProps={{ shrink: true }} {...register("dob")} error={!!errors.dob} helperText={errors.dob?.message} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField {...commonInputProps} label="Mobile Number *" type="number" {...register("mobileNumber")} error={!!errors.mobileNumber} helperText={errors.mobileNumber?.message} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField {...commonInputProps} label="Email Id *" {...register("emailId")} error={!!errors.emailId} helperText={errors.emailId?.message} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField {...commonInputProps} label="Address *" {...register("address")} error={!!errors.address} helperText={errors.address?.message} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField {...commonInputProps} label="Enrollment Date *" type="date" InputLabelProps={{ shrink: true }} {...register("enrollmentDate")} error={!!errors.enrollmentDate} helperText={errors.enrollmentDate?.message} />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ borderRadius: "8px", px: 4 }}>Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ bgcolor: "#072eb0", borderRadius: "8px", px: 4 }} disabled={loading}>
                        {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "SUBMIT"}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateAllStudent;