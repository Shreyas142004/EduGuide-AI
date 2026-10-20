import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import { LogOut, BookOpen, Clock } from 'lucide-react';

const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 transition-colors">
      {/* Mobile brand & toggle */}
      <div className="flex items-center space-x-3 md:hidden">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-base text-slate-900 dark:text-slate-100">EduGuide AI</span>
      </div>

      {/* Student Meta Badges (Desktop) */}
      <div className="hidden md:flex items-center space-x-3">
        {user?.course && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/60">
            <BookOpen className="w-3.5 h-3.5 mr-1 text-primary-600 dark:text-primary-400" />
            {user.course} {user.semester ? `• Sem ${user.semester}` : ''}
          </span>
        )}
        {user?.dailyStudyTime && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 mr-1 text-primary-600 dark:text-primary-400" />
            {Math.round(user.dailyStudyTime / 60)} hrs / day target
          </span>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        <ThemeToggle />

        {user && (
          <div className="flex items-center pl-3 border-l border-slate-200 dark:border-slate-800 space-x-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-semibold text-xs shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-tight">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
