import React from 'react';
import { Trash2 } from "lucide-react";
import Input from './Input.jsx';

const EducationEntry = ({ education, onUpdate, onDelete, isLast }) => (
  <div className="space-y-6 bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
    {/* Header */}
    <div className="flex justify-between items-center pb-3">
      <h4 className="text-base font-semibold text-gray-800">Education Entry</h4>
      {!isLast && (
        <button
          type="button"
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>

    {/* Degree / University */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Degree"
        value={education.degree}
        onChange={(e) => onUpdate("degree", e.target.value)}
        placeholder="e.g. B.Tech Computer Science"
      />
      <Input
        label="University / College"
        value={education.university}
        onChange={(e) => onUpdate("university", e.target.value)}
        placeholder="e.g. Anna University"
      />
    </div>

    {/* Start and End Date */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        type="month"
        label="Start Date"
        value={education.startDate}
        onChange={(e) => onUpdate("startDate", e.target.value)}
      />
      <Input
        type="month"
        label="End Date"
        value={education.endDate}
        onChange={(e) => onUpdate("endDate", e.target.value)}
      />
    </div>
  </div>
);

export default EducationEntry;
