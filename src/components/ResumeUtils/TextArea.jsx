import React from 'react';

const TextArea = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-700 font-medium">{label}</label>
    <textarea
      rows={3}
      value={value}
      onChange={onChange}
      className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all rounded-md"
    />
  </div>
);

export default TextArea;
