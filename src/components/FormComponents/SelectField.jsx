import React from "react";

const SelectField = ({ label, name, options = [], formik }) => {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  const error = touched[name] && errors[name];

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name]}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );
};

export default SelectField;
