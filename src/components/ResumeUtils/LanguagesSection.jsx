"use client";
import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Pencil, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast"; // optional for feedback

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Fluent"];

const LanguagesSection = ({ resumeData, updateResumeData, doneButton }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newLang, setNewLang] = useState({ name: "", proficiency: "" });
  const [editIndex, setEditIndex] = useState(null);

  const inputRef = useRef();

  useEffect(() => {
    if (isAdding || editIndex !== null) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAdding, editIndex]);

  const resetForm = () => {
    setNewLang({ name: "", proficiency: "" });
    setEditIndex(null);
    setIsAdding(false);
  };

  const handleAddLanguage = () => {
    const { name, proficiency } = newLang;
    if (!name || !proficiency) return;

    const duplicate = resumeData.languages.some(
      (lang) => lang.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      toast.error("This language already exists.");
      return;
    }

    const updated = [...resumeData.languages, newLang];
    updateResumeData("languages", null, updated);
    toast.success("Language added!");
    resetForm();
  };

  const handleDelete = (index) => {
    const updated = resumeData.languages.filter((_, i) => i !== index);
    updateResumeData("languages", null, updated);
    toast.success("Language removed.");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewLang(resumeData.languages[index]);
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    const updated = [...resumeData.languages];
    updated[editIndex] = newLang;
    updateResumeData("languages", null, updated);
    toast.success("Language updated.");
    resetForm();
  };

  const isFormValid = newLang.name.trim() && newLang.proficiency;

  return (
    <div className="space-y-6">
      {/* Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resumeData.languages.map((lang, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-4 relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base font-medium text-gray-900">{lang.name}</p>
                <span className="inline-flex mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full items-center gap-1">
                  <CheckCircle2 size={12} className="text-blue-600" />
                  {lang.proficiency}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(i)}
                  className="text-gray-400 hover:text-blue-600 transition"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="text-gray-400 hover:text-red-500 transition"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {(isAdding || editIndex !== null) && (
        <div className="bg-white border border-gray-200 rounded-xl shadow p-5 space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-gray-800">
            {editIndex !== null ? "Edit Language" : "Add Language"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Language</label>
              <input
                ref={inputRef}
                type="text"
                value={newLang.name}
                onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                placeholder="e.g. Tamil, Hindi, English"
                className="w-full h-[40px] px-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && isFormValid && (editIndex !== null ? handleSaveEdit() : handleAddLanguage())}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Proficiency</label>
              <select
                value={newLang.proficiency}
                onChange={(e) =>
                  setNewLang({ ...newLang, proficiency: e.target.value })
                }
                className="w-full h-[40px] px-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Proficiency</option>
                {proficiencyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={editIndex !== null ? handleSaveEdit : handleAddLanguage}
              disabled={!isFormValid}
              className={`px-4 py-2 text-sm rounded-md transition text-white ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              {editIndex !== null ? "Update Language" : "Add Language"}
            </button>
          </div>
        </div>
      )}

      {/* Add Language Button */}
      {!isAdding && editIndex === null && (
        <button
          onClick={() => {
            setIsAdding(true);
            setNewLang({ name: "", proficiency: "" });
          }}
          className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"
        >
          <Plus size={16} /> Add New Language
        </button>
      )}

      {doneButton}
    </div>
  );
};

export default LanguagesSection;
