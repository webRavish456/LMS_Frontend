'use client'

import React, { useState } from "react";
import {
    TextField,
    Grid,
    Button,
    Box,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    topic: yup.string().required("Topic is required"),
    topicDescription: yup.string().required("Topic Description is required"),
    course: yup.string().required("Course name is required"),
    teacher: yup.string().required("Teacher name is required"),
    document: yup
        .mixed()
        .test("required", "Document is required", (value) => {
            return value && value.length > 0;
        }),
});

const CreateDocumentSharing = ({ handleCreate, handleClose }) => {

    // ✅ TOKEN FIX — localStorage se
    const token = localStorage.getItem("token");

    const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            topic: "",
            topicDescription: "",
            course: "",
            teacher: "",
        },
    });

    const onSubmit = async (data) => {

        if (!token) {
            toast.error("Please login again");
            return;
        }

        setLoading(true);

        try {
            const formdata = new FormData();
            formdata.append("topic", data.topic);
            formdata.append("topicDescription", data.topicDescription);
            formdata.append("course", data.course);
            formdata.append("teacher", data.teacher);
            formdata.append("document", data.document[0]);

            const res = await fetch(`${Base_url}/documentsharing`, {
                method: "POST",
                body: formdata,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
            toast.error("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 1 }}>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Topic *"
                        {...register("topic")}
                        error={!!errors.topic}
                        helperText={errors.topic?.message}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Topic Description *"
                        {...register("topicDescription")}
                        error={!!errors.topicDescription}
                        helperText={errors.topicDescription?.message}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Course Name *"
                        placeholder="Enter course name"
                        {...register("course")}
                        error={!!errors.course}
                        helperText={errors.course?.message}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Teacher Name *"
                        placeholder="Enter teacher name"
                        {...register("teacher")}
                        error={!!errors.teacher}
                        helperText={errors.teacher?.message}
                    />
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
                    disabled={loading}
                    sx={{ border: "1px solid #ccc" }}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ bgcolor: "#072eb0" }}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? "Storing..." : "Submit"}
                </Button>
            </Box>
        </form>
    );
};

export default CreateDocumentSharing;
