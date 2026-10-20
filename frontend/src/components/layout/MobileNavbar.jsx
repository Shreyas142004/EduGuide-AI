import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CalendarCheck,
  Bot,
  HelpCircle,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Performance', path: '/performance', icon: BarChart3 },
  { name: 'AI Assistant', path: '/ai-chat', icon: Bot },
  { name: 'Study Plan', path: '/study-plan', icon: CalendarCheck },
  { name: 'Quiz', path: '/quiz', icon: HelpCircle },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const MobileNavbar = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose}></div>

      {/* Slide Drawer */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 p-4 shadow-xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-slate-100">EduGuide AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileNavbar;
