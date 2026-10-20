import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`p-2 rounded-xl text-[#5B4E7A] hover:text-[#241A3D] dark:text-[#C4B5FD] dark:hover:text-[#F5F3FF] hover:bg-[#FAF9FF] dark:hover:bg-[#1D1533] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-300 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-[#7C3AED] transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
