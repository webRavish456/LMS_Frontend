'use client'

import React, { useEffect, useState } from "react"
import {
    TextField,
    Grid,
    Button,
    Box,
    CircularProgress,
    useMediaQuery,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie"
import axios from "axios";

const schema = yup.object().shape({
    branchName: yup.string().required("Branch Name is required"),
    branchLocation: yup.string().required("Branch Location is required"),
    Contact: yup.string().required("Contact Info is required"),
    status: yup.string().required("Status is required"),
});

const EditBranch = ({ handleUpdate, editData, handleClose }) => {
    const isSmScreen = useMediaQuery("(max-width:768px)");
    const token = Cookies.get('token');
    const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema)
    });

    // --- Pre-fill Form Data when editData changes ---
    useEffect(() => {
        if (editData) {
            reset({
                branchName: editData.branchName || "",
                branchLocation: editData.branchLocation || "",
                Contact: editData.Contact || "",
                status: editData.status || "Active",
            });
        }
    }, [editData, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Hum PATCH method use kar rahe hain jaisa aapke backend routes mein hota hai
            const res = await axios.patch(
                `${Base_url}/branch/${editData._id}`,
                {
                    branchName: data.branchName,
                    branchLocation: data.branchLocation,
                    Contact: data.Contact,
                    status: data.status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.status === "success") {
                setLoading(false);
                toast.success("Branch Details Updated Successful!");
                handleUpdate(true); // Table reload
                handleClose();      // Dialog close
            } else {
                setLoading(false);
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Error updating branch:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Internal Server Error");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container columnSpacing={2}>

                    {/* Branch Name */}
                    <Grid item xs={12} sm={isSmScreen ? 12 : 6} md={6}>
                        <TextField
                            type="text"
                            label={<>Branch Name <span style={{ color: "rgba(240, 68, 56, 1)" }}>*</span></>}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            {...register("branchName")}
                            error={!!errors.branchName}
                        />
                        <div style={{ color: "rgba(240, 68, 56, 1)", fontSize: "0.8rem" }}>
                            {errors.branchName?.message}
                        </div>
                    </Grid>

                    {/* Branch Location */}
                    <Grid item xs={12} sm={isSmScreen ? 12 : 6} md={6}>
                        <TextField
                            type="text"
                            label={<>Branch Location <span style={{ color: "rgba(240, 68, 56, 1)" }}>*</span></>}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            {...register("branchLocation")}
                            error={!!errors.branchLocation}
                        />
                        <div style={{ color: "rgba(240, 68, 56, 1)", fontSize: "0.8rem" }}>
                            {errors.branchLocation?.message}
                        </div>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} sm={isSmScreen ? 12 : 6} md={6}>
                        <TextField
                            type="text"
                            label={<>Contact Info <span style={{ color: "rgba(240, 68, 56, 1)" }}>*</span></>}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            {...register("Contact")}
                            error={!!errors.Contact}
                        />
                        <div style={{ color: "rgba(240, 68, 56, 1)", fontSize: "0.8rem" }}>
                            {errors.Contact?.message}
                        </div>
                    </Grid>

                    {/* Status Selection */}
                    <Grid item xs={12} sm={isSmScreen ? 12 : 6} md={6}>
                        <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.status}>
                            <InputLabel>Status <span style={{ color: "rgba(240, 68, 56, 1)" }}>*</span></InputLabel>
                            <Select
                                label="Status"
                                defaultValue={editData?.status || "Active"}
                                {...register("status")}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                            <div style={{ color: "rgba(240, 68, 56, 1)", fontSize: "0.8rem" }}>
                                {errors.status?.message}
                            </div>
                        </FormControl>
                    </Grid>

                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                    <Button onClick={handleClose} className="secondary_button">
                        Cancel
                    </Button>
                    <Button type="submit" className="primary_button">
                        {loading ? (
                            <>
                                <CircularProgress size={18} style={{ marginRight: 8, color: "#fff" }} />
                                Submitting
                            </>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </Box>
            </form>
        </>
    );
}

export default EditBranch;