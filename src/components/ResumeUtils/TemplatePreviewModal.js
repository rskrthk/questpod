// TemplatePreviewModal.jsx
import React, { useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
// import html2pdf from "html2pdf.js"; // Removed for @react-pdf/renderer
// import html2canvas from "html2canvas"; // Still used for Image download
import toast, { Toaster } from "react-hot-toast"; // For notifications

import { pdf } from '@react-pdf/renderer';
import TemplateModernPdf from "../ResumeTempletes/TemplateModern";
import TemplateIntermediatePdf from "../ResumeTempletes/TemplateIntermediatePdf";
import TemplateExpertPdf from "../ResumeTempletes/TemplateExpertPdf";
import TemplateBasicPdf from "../ResumeTempletes/TemplateBasicPdf";

const TemplatePreviewModal = ({
  templateComponent: Template, // The React component for the selected resume template
  templateName, // Name of the template (e.g., "Modern")
  resumeData, // The data to populate the resume template
  onClose, // Function to close the modal
}) => {
  const previewRef = useRef(); // Ref to the resume preview element for screenshots (still used by html2canvas)
  const [isGenerating, setIsGenerating] = useState(false); // State for loading indicator
  const [generationMessage, setGenerationMessage] = useState(""); // Message for loading indicator

  /**
   * Handles the PDF download process using @react-pdf/renderer.
   */
  const handleDownloadPdf = useCallback(async () => {
    setIsGenerating(true);
    setGenerationMessage("Preparing PDF...");

    try {
      setGenerationMessage("Generating PDF...");
      const pdfComponents = {
        Modern: TemplateModernPdf,
        Intermediate: TemplateIntermediatePdf,
        Expert: TemplateExpertPdf,
        Basic: TemplateBasicPdf,
      };
      const PdfComponent = pdfComponents[templateName] || TemplateModernPdf;
      const blob = await pdf(<PdfComponent resumeData={resumeData} />).toBlob();
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element for download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${templateName}-resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error(`Failed to generate PDF: ${error.message || "An unknown error occurred."}`);
    } finally {
      setIsGenerating(false);
      setGenerationMessage("");
    }
  }, [templateName, resumeData]); // Dependencies: templateName and resumeData

  /**
   * Handles the Image (PNG) download process.
   * Uses html2canvas to convert the resume preview into a PNG image.
   */
  const handleDownloadImage = useCallback(async () => {
    if (!previewRef.current) {
      toast.error("Resume content not found for image generation.");
      return;
    }

    setIsGenerating(true);
    setGenerationMessage("Preparing Image...");
    const element = previewRef.current;

    try {
      setGenerationMessage("Generating Image...");
      // Generate canvas from the preview element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollY: 0,
        scrollX: 0,
        // Removed width and height here to let html2canvas determine them dynamically
      });

      const image = canvas.toDataURL("image/png"); // Get image data URL
      const link = document.createElement("a"); // Create a temporary link element
      link.href = image;
      link.download = `${templateName}-resume.png`; // Set download filename
      document.body.appendChild(link); // Append to body to make it clickable
      link.click(); // Programmatically click the link to trigger download
      document.body.removeChild(link); // Clean up the link element
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Image generation failed:", error);
      toast.error(
        `Failed to generate Image: ${
          error.message || "An unknown error occurred."
        }`
      );
    } finally {
      setIsGenerating(false);
      setGenerationMessage("");
    }
  }, [templateName]); // Dependency array: re-create if templateName changes

  const handleDownloadWord = useCallback(async () => {
    setIsGenerating(true);
    setGenerationMessage("Preparing Word Doc...");

    try {
      setGenerationMessage("Generating Word Doc...");

      // Make the fetch call to your Next.js API route
      const response = await fetch("/api/generate-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the entire resumeData object and templateName to the backend
        body: JSON.stringify({ resumeData, templateName }),
      });

      if (!response.ok) {
        // If the server response is not OK (e.g., 400, 500), parse the error message
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          `Server responded with status ${response.status}: ${
            errorData.message || "An unknown error occurred on the server."
          }`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob); // Create a temporary URL for the blob
      const link = document.createElement("a"); // Create a temporary link element
      link.href = url;
      link.setAttribute("download", `${templateName}-resume.docx`); // Set the download filename
      document.body.appendChild(link); // Append to body
      link.click(); // Programmatically click to trigger download
      link.parentNode.removeChild(link); // Clean up the link
      window.URL.revokeObjectURL(url); // Release the temporary URL resource

      toast.success("Word document downloaded successfully!");
    } catch (error) {
      console.error("Word document generation failed:", error);
      toast.error(
        `Failed to generate Word document: ${
          error.message || "An unknown error occurred."
        }`
      );
    } finally {
      setIsGenerating(false);
      setGenerationMessage("");
    }
  }, [templateName, resumeData]); // Dependencies: templateName and resumeData (as it's sent to backend)

  // Only render the modal if window is defined (client-side)
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/70 font-inter"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        className="relative bg-white rounded-lg shadow-xl w-full max-w-max h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white z-10">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Preview: {templateName} Template
          </h2>
          <div className="flex items-center gap-3">

            {/* Download Image Button */}
            {/* <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2
                ${
                  isGenerating && generationMessage.includes("Image")
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                }
                shadow-md hover:shadow-lg`}
              aria-label="Download Image"
            >
              {isGenerating && generationMessage.includes("Image") && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isGenerating && generationMessage.includes("Image")
                ? generationMessage
                : "Download Image"}
            </button> */}

            {/* You can uncomment this button if you have a backend API to handle Word document generation */}
            {/* <button
              onClick={handleDownloadWord}
              disabled={isGenerating}
              className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2
                ${isGenerating && generationMessage.includes("Word")
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
                }
                shadow-md hover:shadow-lg`}
              aria-label="Download Word Document"
            >
              {isGenerating && generationMessage.includes("Word") && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isGenerating && generationMessage.includes("Word") ? generationMessage : "Download Word"}
            </button> */}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75 p-1 rounded-full"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Resume Preview Area - this still uses the original HTML-based Template */}
        <div className="flex-grow overflow-y-auto bg-gray-50 scrollbar-hide p-6">
          <div
            ref={previewRef}
            className="bg-white mx-auto shadow-lg" // Removed p-3 here
            style={{
              fontFamily: "Inter, sans-serif",
              width: "9in", // Standard US Letter width
              // Removed padding here to let html2pdf's margin and @page CSS handle it.
              boxSizing: "border-box", // Include padding in the element's total width and height
              // Removed fixed height and overflow: 'hidden' to allow natural content flow and pagination
            }}
          >
            {/* Render the actual resume template component (HTML version for preview) */}
            {React.createElement(Template, { resumeData })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TemplatePreviewModal;
