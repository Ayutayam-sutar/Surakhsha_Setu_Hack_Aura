import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white p-8 mt-auto">
      <div className="container mx-auto text-center">
        <p className="font-bold text-xl mb-2">Suraksha Setu</p>
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Suraksha Setu (Juggernaut). All rights reserved.</p>
      </div>
    </footer>
  );
};
