import React from 'react';

const Input = ({ label, value, onChange, onBlur, type = "text", placeholder, error, errorMessage, pattern }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-700 font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder || label}
      pattern={pattern}
      className={`px-3 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-2 transition-all rounded-md ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400 focus:border-transparent"}`}
    />
    {errorMessage ? (
      <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
    ) : null}
  </div>
);

export default Input;
