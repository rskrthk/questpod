import React from "react";

const InputField = ({ label, name, formik, type = "text", placeholder }) => {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
      />
      {error && <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>}
    </div>
  );
};

export default InputField;
