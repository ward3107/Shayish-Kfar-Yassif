import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'gold' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center uppercase tracking-widest font-medium transition-all duration-500 rounded-none disabled:opacity-50 disabled:cursor-not-allowed border focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white";
  
  const variants = {
    primary: "bg-white text-black border-white hover:bg-transparent hover:text-white",
    outline: "bg-transparent text-white border-white hover:bg-white hover:text-black",
    gold: "bg-accent text-white border-accent hover:bg-transparent hover:text-accent",
    white: "bg-transparent text-white border-white hover:bg-white hover:text-black"
  };

  const sizes = {
    sm: "text-xs px-6 py-2",
    md: "text-sm px-8 py-3",
    lg: "text-sm px-10 py-4"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;