"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { Box, Grid, Paper, Typography } from "@mui/material";

export default function Dashboard() {
  const [token, setToken] = useState(null);

  const [studentCourse, setStudentCourse] = useState([]);
  const [dailyExam, setDailyExam] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

 
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

 
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [studentRes, examRes, teacherRes, assignmentRes] =
          await Promise.all([
            fetch(`${BASE_URL}/allstudents`, { headers }).then((r) => r.json()),
            fetch(`${BASE_URL}/exam`, { headers }).then((r) => r.json()),
            fetch(`${BASE_URL}/teacher`, { headers }).then((r) => r.json()),
            fetch(`${BASE_URL}/allAssignment`, { headers }).then((r) =>
              r.json()
            ),
          ]);

        // Students per Course
        if (studentRes.status === "success") {
          const result = studentRes.data.reduce((acc, cur) => {
            acc[cur.course] = (acc[cur.course] || 0) + 1;
            return acc;
          }, {});
          setStudentCourse(
            Object.entries(result).map(([name, value]) => ({ name, value }))
          );
        }

        // Exam per day
        if (examRes.status === "success") {
          const result = examRes.data.reduce((acc, cur) => {
            const date = new Date(cur.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});
          setDailyExam(
            Object.entries(result).map(([date, exam]) => ({ date, exam }))
          );
        }

        // Assignment
        if (assignmentRes.status === "success") {
          const result = assignmentRes.data.reduce((acc, cur) => {
            acc[cur.course] = (acc[cur.course] || 0) + 1;
            return acc;
          }, {});
          setAssignmentData(
            Object.entries(result).map(([name, value]) => ({ name, value }))
          );
        }

        // Teacher
        if (teacherRes.status === "success") {
          const result = teacherRes.data.reduce((acc, cur) => {
            const course = cur.companyDetails?.courseName;
            if (course) acc[course] = (acc[course] || 0) + 1;
            return acc;
          }, {});
          setTeacherData(
            Object.entries(result).map(([name, value]) => ({ name, value }))
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, [token]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading)
    return (
      <Typography align="center" sx={{ mt: 10 }}>
        Loading dashboard...
      </Typography>
    );

  return (
    <Layout>
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Students */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, minHeight: 380 }}>
            <Typography variant="h6">Students per Course</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={studentCourse} dataKey="value" outerRadius={80} label>
                  {studentCourse.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Exams */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, minHeight: 380 }}>
            <Typography variant="h6">Exams</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyExam}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line dataKey="exam" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Assignment */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, minHeight: 380 }}>
            <Typography variant="h6">
              Number of Assignments by Course
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assignmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Teacher */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, minHeight: 380 }}>
            <Typography variant="h6">Teacher per Course</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={teacherData} dataKey="value" outerRadius={80} label>
                  {teacherData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
    </Layout>
  );
}
