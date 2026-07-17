import React from 'react';
import { useMagneticCursor } from '../hooks/useMagneticCursor';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'gold' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /**
   * Opt-in cursor magnetism — the button is gently pulled toward the pointer
   * when it gets close. Desktop-only (auto-disabled on touch). Use sparingly
   * — most impact when reserved for a hero's primary CTA.
   */
  magnetic?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  magnetic = false,
  className = '',
  ...props
}) => {
  const magneticRef = useMagneticCursor<HTMLButtonElement>({ strength: 20, radius: 60 });

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
      ref={magnetic ? magneticRef : undefined}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
