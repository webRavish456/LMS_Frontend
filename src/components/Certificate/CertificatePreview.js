import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";

const CertificatePreview = ({ name, course, issuer }) => {
  const certRef = useRef(null);

  return (
    <Box
      ref={certRef}
      sx={{
        width: "1123px",
        height: "794px",
        backgroundImage: "url(/sidebar/certification.png)", // ✅ FIXED PATH
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        position: "relative",
        mx: "auto",
      }}
    >
      {/* STUDENT NAME */}
      <Typography
        sx={{
          position: "absolute",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "42px",
          fontWeight: 700,
          color: "#000",
        }}
      >
        {name || "STUDENT NAME"}
      </Typography>

      {/* COURSE */}
      <Typography
        sx={{
          position: "absolute",
          top: "56%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "20px",
          color: "#000",
        }}
      >
        {course || "Course Name"}
      </Typography>

      {/* ISSUER */}
      <Typography
        sx={{
          position: "absolute",
          bottom: "18%",
          right: "15%",
          fontSize: "16px",
          color: "#000",
        }}
      >
        Issued by {issuer || "Institute"}
      </Typography>
    </Box>
  );
};

export default CertificatePreview;
