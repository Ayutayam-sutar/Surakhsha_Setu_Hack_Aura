import React from 'react';

export const Badge = ({ icon, label }) => {
  return (
    <div className="flex flex-col items-center text-center p-3 bg-neutral-light rounded-lg shadow-sm w-32 transform hover:scale-105 transition-transform duration-300" title={label}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-xs font-semibold text-neutral-dark truncate w-full">{label}</p>
    </div>
  );
};
