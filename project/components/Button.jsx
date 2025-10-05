import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-6 py-3 font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-white';

  const variantClasses = {
    primary: 'bg-brand-blue hover:bg-brand-blue-dark focus:ring-brand-blue',
    secondary: 'bg-neutral-dark hover:bg-gray-900 focus:ring-neutral-dark',
    danger: 'bg-brand-red hover:bg-red-700 focus:ring-brand-red',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
