"use client";
import React from "react";
import { X, Download } from "lucide-react";

const DownloadModal = ({ isOpen, onClose, onDownload, selectedTemplate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        <div className="text-center mt-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Use {selectedTemplate} Template?
          </h2>
          <p className="text-gray-600 mb-6">
            This will generate your resume preview and allow you to download the
            PDF.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onDownload}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              <Download size={18} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
