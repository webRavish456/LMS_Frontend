"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Cookies from "js-cookie";
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
  const [studentCourse, setStudentCourse] = useState([]);
  const [dailyExam, setDailyExam] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (!token || !BASE_URL) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [studentRes, examRes, teacherRes, assignmentRes] =
          await Promise.all([
            fetch(`${BASE_URL}/studentlist`, { headers })
              .then((res) => res.text())
              .then(JSON.parse),

            fetch(`${BASE_URL}/exam`, { headers })
              .then((res) => res.text())
              .then(JSON.parse),

            fetch(`${BASE_URL}/faculty`, { headers })
              .then((res) => res.text())
              .then(JSON.parse),

            fetch(`${BASE_URL}/allAssignment`, { headers })
              .then((res) => res.text())
              .then(JSON.parse),
          ]);

        /* ================= STUDENTS ================= */
        if (studentRes.status === "success") {
          const result = studentRes.data.reduce((acc, item) => {
            const course = item.course;
            acc[course] = (acc[course] || 0) + 1;
            return acc;
          }, {});

          setStudentCourse(
            Object.entries(result).map(([name, value]) => ({
              name,
              value,
            }))
          );
        }

        /* ================= EXAMS ================= */
        if (examRes.status === "success") {
          const dailyCounts = examRes.data.reduce((acc, item) => {
            const date = new Date(item.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});

          setDailyExam(
            Object.entries(dailyCounts).map(([date, count]) => ({
              date,
              exam: count,
            }))
          );
        }

        /* ================= ASSIGNMENTS ================= */
        if (assignmentRes.status === "success") {
          const result = assignmentRes.data.reduce((acc, item) => {
            const course = item.course;
            acc[course] = (acc[course] || 0) + 1;
            return acc;
          }, {});

          setAssignmentData(
            Object.entries(result).map(([name, value]) => ({
              name,
              value,
            }))
          );
        }

        /* ================= TEACHERS ================= */
        if (teacherRes.status === "success") {
          const result = teacherRes.data.reduce((acc, item) => {
            const course = item.companyDetails?.courseName;
            if (course) acc[course] = (acc[course] || 0) + 1;
            return acc;
          }, {});

          setTeacherData(
            Object.entries(result).map(([name, value]) => ({
              name,
              value,
            }))
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, BASE_URL]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Students per Course</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={studentCourse} dataKey="value" outerRadius={80} label>
                    {studentCourse.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Exams */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
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

          {/* Assignments */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
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

          {/* Teachers */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Teacher per Course</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={teacherData} dataKey="value" outerRadius={80} label>
                    {teacherData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Layout>
  );
}