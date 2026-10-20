import React from 'react';

const variants = {
  primary: 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white shadow-sm shadow-purple-500/25 focus:ring-[#7C3AED]',
  secondary: 'bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#251B40] dark:hover:bg-[#352750] dark:text-[#DDD6FE] focus:ring-[#7C3AED]',
  outline: 'border border-[#DDD6FE] dark:border-[#352750] hover:bg-[#FAF9FF] dark:hover:bg-[#1D1533] text-[#241A3D] dark:text-[#F5F3FF] focus:ring-[#7C3AED]',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
  ghost: 'text-[#5B4E7A] dark:text-[#C4B5FD] hover:bg-[#F5F3FF] dark:hover:bg-[#251B40] focus:ring-[#7C3AED]',
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-[#100B1F] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={`w-4 h-4 mr-1.5 ${size === 'lg' ? 'w-5 h-5 mr-2' : ''}`} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
