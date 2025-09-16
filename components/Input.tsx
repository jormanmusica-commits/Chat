
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          {...props}
          className={`w-full bg-gray-900 border border-gray-600 rounded-md py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${icon ? 'pl-10' : 'px-3'}`}
        />
      </div>
    </div>
  );
};
