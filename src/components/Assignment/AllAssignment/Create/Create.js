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
  MenuItem
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const schema = yup.object().shape({
  assignmentTitle: yup.string().required("Assignment Title Name is required"),
  course: yup.string().required("Course is required"),
  teacher: yup.string().required("Teacher Name is required"),
  dueDate: yup.string().required("Due Date is required"),
});

const CreateAllAssignment = ({ handleCreate, handleClose }) => {
  // Random data fallback taaki dropdown khali na dikhe
  const [courseName, setCourseName] = useState([
    { courseName: "Random Course A" },
    { courseName: "Random Course B" }
  ]);
  const [teacherName, setTeacherName] = useState([
    { teacherName: "Random Teacher X" },
    { teacherName: "Random Teacher Y" }
  ]);
  
  const [loading, setLoading] = useState(false);
  const isSmScreen = useMediaQuery("(max-width:768px)");
   const token =  localStorage.getItem("token");
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [resCourse, resTeacher] = await Promise.all([
          fetch(`${Base_url}/courselist`, { headers }),
          fetch(`${Base_url}/teacher`, { headers })
        ]);
        const dataCourse = await resCourse.json();
        const dataTeacher = await resTeacher.json();

        // Agar API se data milta hai toh update karein, warna random data rahega
        if (dataCourse.status === "success" && dataCourse.data.length > 0) setCourseName(dataCourse.data);
        if (dataTeacher.status === "success" && dataTeacher.data.length > 0) setTeacherName(dataTeacher.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    if (token) fetchData();
  }, [token, Base_url]);

  const onSubmit = (data) => {
    setLoading(true);
    const formdata = new FormData();
    formdata.append("assignmentTitle", data.assignmentTitle);
    formdata.append("course", data.course);
    formdata.append("teacher", data.teacher);
    formdata.append("dueDate", data.dueDate);

    fetch(`${Base_url}/allAssignment`, {
      method: "POST",
      body: formdata,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.status === "success") {
          toast.success("Assignment Created Successfully!");
          handleCreate(true);
          handleClose();
          reset();
        } else {
          toast.error(res.message);
        }
      })
      .catch(() => setLoading(false));
  };

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Grid container with spacing for better look */}
        <Grid container spacing={2}>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label={<>Assignment Title <span style={{ color: "red" }}>*</span></>}
              {...register("assignmentTitle")}
              error={!!errors.assignmentTitle}
              helperText={errors.assignmentTitle?.message}
            />
          </Grid>

          {/* Course Name Dropdown - Same style as Due Date */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.course}>
              <InputLabel id="course-label">Course Name *</InputLabel>
              <Select
                labelId="course-label"
                label="Course Name *"
                defaultValue=""
                {...register("course")}
              >
                {courseName.map((course, index) => (
                  <MenuItem key={index} value={course.courseName}>
                    {course.courseName}
                  </MenuItem>
                ))}
              </Select>
              {errors.course && (
                <div style={{ color: "red", fontSize: "0.75rem", paddingLeft: "14px", marginTop: "4px" }}>
                  {errors.course.message}
                </div>
              )}
            </FormControl>
          </Grid>

          {/* Teacher Name Dropdown - Same style as Due Date */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.teacher}>
              <InputLabel id="teacher-label">Teacher Name *</InputLabel>
              <Select
                labelId="teacher-label"
                label="Teacher Name *"
                defaultValue=""
                {...register("teacher")}
              >
                {teacherName.map((teacher, index) => (
                  <MenuItem key={index} value={teacher.teacherName}>
                    {teacher.teacherName}
                  </MenuItem>
                ))}
              </Select>
              {errors.teacher && (
                <div style={{ color: "red", fontSize: "0.75rem", paddingLeft: "14px", marginTop: "4px" }}>
                  {errors.teacher.message}
                </div>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              label={<>Due Date <span style={{ color: "red" }}>*</span></>}
              {...register("dueDate")}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
            />
          </Grid>
        </Grid>

        {/* Buttons logic */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
          <Button type="button" onClick={handleClose} className="secondary_button">
            Cancel
          </Button>
          <Button type="submit" className="primary_button">
            {loading ? (
              <><CircularProgress size={18} sx={{ color: "white", mr: 1 }} /> Submitting</>
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default CreateAllAssignment;