
import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading = false, variant = 'primary', icon, ...props }) => {
  const baseClasses = 'w-full font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const variantClasses = {
    primary: 'bg-teal-600 text-white hover:bg-teal-500 focus:ring-teal-500',
    secondary: 'bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-gray-500'
  };

  const disabledClasses = 'disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed';

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
