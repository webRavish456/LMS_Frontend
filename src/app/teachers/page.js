"use client";
import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${Base_url}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const res = await response.json();

      if (res.success || res.status === "success") {
        // चेक करें कि क्या लॉगिन करने वाला सच में टीचर है?
        if (res.role === "teacher") {
          localStorage.setItem("token", res.token);
          localStorage.setItem("role", "teacher");
          toast.success("Teacher Login Successful!");
          
          // टीचर को उसके डैशबोर्ड पर भेजें
          router.push("/teacher/dashboard");
        } else {
          toast.error("Unauthorized! This is only for Teachers.");
        }
      } else {
        toast.error(res.message || "Invalid Credentials");
      }
    } catch (error) {
      toast.error("Server Error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <ToastContainer />
      <Box sx={{ mt: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={6} sx={{ p: 4, width: "100%", borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Teacher Portal
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Please enter your teacher credentials to continue.
          </Typography>

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Teacher Email"
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
            >
              {loading ? "Authenticating..." : "Login to Teacher Panel"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TeacherLogin;