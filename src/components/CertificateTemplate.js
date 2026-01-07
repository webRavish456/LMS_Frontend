import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@mui/material";

const CertificateTemplate = ({ name, issuer, onGenerated }) => {
  const certRef = useRef();

  const generatePDF = async () => {
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    const fileName = `${name}_Certificate.pdf`;
    pdf.save(fileName);

    if (onGenerated) onGenerated(fileName);
  };

  return (
    <div>
      <div
        ref={certRef}
        style={{
          width: "1123px",
          height: "794px",
          backgroundImage: `url('/sidebar/certification.png')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Certificate Content (Dynamic Text) */}
        <div
          style={{
            position: "absolute",
            top: "46%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "80%",
          }}
        >
          <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>{name}</h1>
          <p style={{ fontSize: "18px" }}>
            in recognition of his/her active participation in the Full Stack Development Internship.
          </p>
          <p style={{ marginTop: "20px", fontSize: "16px" }}>
            Issued by <strong>{issuer}</strong> — {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        sx={{ mt: 2 }}
      >
         Certificate PDF
      </Button>
    </div>
  );
};

export default CertificateTemplate;
