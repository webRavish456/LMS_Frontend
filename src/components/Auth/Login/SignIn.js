'use client'

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const schema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required")
});

const SignIn = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    router.push('/dashboard');
  }
}, [router]);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    setLoading(true)
    const formdata = new FormData();
    formdata.append("email", data.email);
    formdata.append("password", data.password);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    fetch(`${Base_url}/login`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result)
   if (res.status === "success") {
  setLoading(false);
  toast.success("Login Successful!");

 
  localStorage.setItem("token", res.access_token);

  setTimeout(() => {
    router.push("/dashboard");
    reset();
  }, 1500);

         localStorage.setItem("token", res.access_token);

        } else {
          setLoading(false)
          toast.error(res.message)
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleForgot = () => {
    router.push("/forgot")
  }

  return (
  
    <Box 
      sx={{ 
        bgcolor: "white", 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}
    >
      <ToastContainer />

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ 
          "& .MuiTextField-root": { m: 1, width: "30ch" },
          p: 4,
          boxShadow: 3, 
          borderRadius: 2,
          bgcolor: "white",
          textAlign: "center"
        }}
        autoComplete="off"
        className="register"
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Log In
        </Typography>

        <Box className="signIn" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box>
            <TextField
              type="email"
              label="Enter Email Id"
              variant="standard"
              {...register("email")}
              error={!!errors.email}
            />
            <div style={{ color: "rgba(240, 68, 56, 1)", fontSize: "0.8rem" }}>
              {errors.email?.message}
            </div>
          </Box>

          <Box>
            <TextField
              type="password"
              label="Enter Password"
              variant="standard"
              {...register("password")}
              error={!!errors.password}
            />
            <div style={{ color: "rgba(240, 68, 56, 1)", fontSize: "0.8rem" }}>
              {errors.password?.message}
            </div>
          </Box>

          <Box sx={{ width: '100%', textAlign: 'right', mt: 1, mb: 2 }}>
            <Typography 
              variant="body2" 
              onClick={handleForgot} 
              sx={{ cursor: "pointer", color: "primary.main", mr: 1 }}
            >
              Forgot Password
            </Typography>
          </Box>

          <Button 
            type="submit" 
            variant="contained"
            sx={{ width: '100%', mt: 2 }}
            className="primary_button login_btn"
          >
            {loading && (
              <CircularProgress
                size={18}
                style={{ marginRight: 8, color: "#fff" }}
              />
            )}
            Log In
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;