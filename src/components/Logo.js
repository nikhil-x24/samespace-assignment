import React from 'react';
import logo from '../assets/Logo.png'; // Replace with your logo path

const Logo = () => {
  return (
    <div className="flex items-cente absolute top-0 left-0 p-4">
      <img src={logo} alt="Logo" className="cursor-pointer w-22 h-12" />
    </div>
  );
};

export default Logo;
