// components/ResumeUtils/DownloadButton.jsx
"use client";
import React from "react";
import html2pdf from "html2pdf.js";

const DownloadButton = ({ resumeId = "resume-content", fileName = "resume.pdf" }) => {
  const handleDownload = () => {
    const element = document.getElementById(resumeId);
    if (!element) {
      alert("Resume content not found.");
      return;
    }
    console.log("Resume content  found",element);

    const opt = {
      margin: [0.5, 0.5],
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="text-center">
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Download PDF
      </button>
    </div>
  );
};

export default DownloadButton;
