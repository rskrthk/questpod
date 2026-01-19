import React from "react";

const TextareaField = ({ label, name, formik, rows = 4, placeholder }) => {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  const error = touched[name] && errors[name];

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name]}
      />
      {error && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );
};

export default TextareaField;
