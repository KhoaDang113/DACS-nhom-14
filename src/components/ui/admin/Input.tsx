import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const inputClasses = `
    block px-4 py-2 w-full text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
    ${error ? "border-red-300" : ""}
    ${icon ? "pl-10" : ""}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input className={inputClasses} {...props} />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
