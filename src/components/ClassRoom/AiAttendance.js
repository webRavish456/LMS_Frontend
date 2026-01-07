'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const AIAttendance = () => {
  const videoRef = useRef();
  const [status, setStatus] = useState("Initializing...");
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  // Load models from public folder
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
      .catch((err) => setStatus("Camera access denied!"));
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
        // 👉 Here you can call your backend API to save attendance
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
