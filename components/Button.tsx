import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden group transition-all duration-300 rounded-full flex items-center justify-center font-sans";
  
  const variants = {
    primary: "bg-[#D4AF37] text-black font-bold tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#E5C048] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]",
    secondary: "bg-white text-black font-semibold tracking-wide hover:bg-gray-100 shadow-lg",
    outline: "bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40 font-medium",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 font-medium"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;