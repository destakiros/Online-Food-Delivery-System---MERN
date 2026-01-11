
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-ino-red hover:bg-red-700 text-white shadow-lg',
    secondary: 'bg-admas-blue hover:bg-blue-900 text-white shadow-lg',
    danger: 'bg-red-600 hover:bg-red-800 text-white',
    outline: 'border-2 border-admas-blue text-admas-blue hover:bg-admas-blue hover:text-white'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <i className="ph ph-spinner animate-spin"></i>}
      {children}
    </button>
  );
};

export default Button;
