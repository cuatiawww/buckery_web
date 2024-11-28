import React from 'react';

type ButtonProps = {
  variant: 'delete' | 'kirim' | 'cta';
  onClick: () => void;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  let buttonClass = '';

  switch (variant) {
    case 'delete':
      buttonClass = 'bg-red-500 hover:bg-red-600 text-white';
      break;
    case 'kirim':
      buttonClass = 'bg-blue-500 hover:bg-blue-600 text-white';
      break;
    case 'cta':
      buttonClass = 'bg-green-500 hover:bg-green-600 text-white';
      break;
    default:
      buttonClass = 'bg-gray-500 hover:bg-gray-600 text-white';
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${buttonClass} transition duration-300`}
    >
      {children}
    </button>
  );
};

export default Button;
