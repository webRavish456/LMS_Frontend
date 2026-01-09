'use client'

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Box,
  Grid,
  Avatar,
  FormControl,
  FormLabel,
  CircularProgress
} from "@mui/material";
import Cookies from "js-cookie";
import CommonDialog from "@/components/CommonDialog/CommonDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "@/components/Layout";
import CreateProfile from "@/components/Profile/Create/Create";
import EditProfile from "@/components/Profile/Edit/Edit";

const schema = yup.object().shape({
  profilePhoto: yup.mixed(),
  mobileNo: yup.string(),
  email: yup.string().email("Invalid email"),
  address: yup.string(),
  dob: yup.string(),
  name: yup.string(),
  gender: yup.string(),
});

const Profile = () => {
  const { register, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const [profileId, setProfileId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [gender, setGender] = useState("");
  const [openData, setOpenData] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setformData] = useState({});

  const token = Cookies.get("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  const fetchProfileData = useCallback(async (id) => {
    try {
      const response = await fetch(`${Base_url}/profile/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (res.status === "success") {
        setformData(res.data);
        setGender(res.data.gender);
        setEditData(res.data);
        setEditMode(true);

        if (typeof window !== 'undefined') {
          localStorage.setItem("profilePhoto", JSON.stringify(res.data.profilePhoto));
        }

        reset({
          name: res.data.name,
          gender: res.data.gender,
          dob: res.data.dob ? new Date(res.data.dob).toISOString().split("T")[0] : "",
          mobileNo: res.data.mobileNo,
          email: res.data.email,
          address: res.data.address,
        });
      } else {
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  }, [Base_url, token, reset]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem("profileId");
      if (storedId) {
        const parsedId = JSON.parse(storedId);
        setProfileId(parsedId);
        fetchProfileData(parsedId);
      } else {
        setLoading(false);
      }
    }
  }, [fetchProfileData]);

  const handleClose = () => {
    setOpenData(false);
    setEditShow(false);
  };

  const handleCreateProfile = () => setOpenData(true);
  const handleEditProfile = () => setEditShow(true);
  const handleUpdate = (status) => setLoading(status);
  const handleCreate = (status) => setLoading(status);

  return (
    <Layout>
      <ToastContainer />
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="container overflow">
            {/* Top Card: Summary */}
            <Card sx={{ mb: 4, borderRadius: '12px' }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: "#d2d2d2" }} src={formData.profilePhoto || ''} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{formData.name || "User"}</Typography>
                        <Button variant="contained" color="success" size="small" sx={{ borderRadius: '20px', textTransform: 'none' }}>
                          Active
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">☎ <b>Mobile:</b> {formData.mobileNo}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">📧 <b>Email:</b> {formData.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">📍 <b>Address:</b> {formData.address}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">🎂 <b>DOB:</b> {formData.dob ? new Date(formData.dob).toLocaleDateString('en-IN', options) : 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Bottom Card: Form Details */}
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">Personal Details</Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={editMode ? handleEditProfile : handleCreateProfile}
                    sx={{ textTransform: 'none' }}
                  >
                    {editMode ? "Edit Profile" : "Create Profile"}
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField label="Full Name" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register("name")} inputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Gender</FormLabel>
                      <RadioGroup row value={gender || ""}>
                        <FormControlLabel value="male" control={<Radio {...register("gender")} />} label="Male" />
                        <FormControlLabel value="female" control={<Radio {...register("gender")} />} label="Female" />
                        <FormControlLabel value="others" control={<Radio {...register("gender")} />} label="Others" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Date of Birth" type="date" fullWidth InputLabelProps={{ shrink: true }} {...register("dob")} inputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Mobile No" fullWidth InputLabelProps={{ shrink: true }} {...register("mobileNo")} inputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Email" fullWidth InputLabelProps={{ shrink: true }} {...register("email")} inputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Address" fullWidth multiline rows={2} InputLabelProps={{ shrink: true }} {...register("address")} inputProps={{ readOnly: true }} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <CommonDialog
              open={openData || editShow}
              onClose={handleClose}
              dialogTitle={openData ? "Create Profile" : "Edit Profile"}
              dialogContent={
                openData ? (
                  <CreateProfile handleCreate={handleCreate} handleClose={handleClose} />
                ) : (
                  <EditProfile editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} />
                )
              }
            />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Profile;