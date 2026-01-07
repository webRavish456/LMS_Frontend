'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';

const AIAttendance = () => {
  const videoRef = useRef();
  const [status, setStatus] = useState("Initializing...");
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      setStatus("Loading AI models...");
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      setStatus("Starting camera...");
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch(() => setStatus("Camera access denied!"));
  };

  const handleVideoPlay = () => {
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length > 0 && !attendanceMarked) {
        setAttendanceMarked(true);
        setStatus("✅ Face detected! Attendance marked.");

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai-attendance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 👇 अगर तुम्हारे backend में JWT token verify हो रहा है
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              userId: "student123",  // 👈 यहां तुम्हें actual studentId डालना है
              status: "Present",
              date: new Date()
            }),
          });

          const data = await res.json();
          if (data.status === "success") {
            toast.success("Attendance saved successfully!");
          } else {
            toast.error(data.message || "Failed to save attendance!");
          }
        } catch (error) {
          console.error("Error saving attendance:", error);
          toast.error("Something went wrong while saving attendance!");
        }
      } else if (detections.length === 0) {
        setStatus("No face detected.");
      }
    }, 3000);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>AI-based Attendance Detection</h2>
      <p>{status}</p>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="400"
        height="300"
        onPlay={handleVideoPlay}
        style={{ borderRadius: "10px", border: "2px solid #007bff" }}
      />
    </div>
  );
};

export default AIAttendance;
