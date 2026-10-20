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

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 z-20 flex-shrink-0 select-none transition-colors">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              EduGuide<span className="text-primary-600 dark:text-primary-400"> AI</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 -mt-1">
              Academic Support
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links - Exactly 7 Required Sections */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 mr-3 transition-colors ${
                      isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info Badge */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Gemini RAG Engine</p>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Grounded Document Assistant</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
