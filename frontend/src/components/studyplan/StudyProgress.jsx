import React from 'react';
import Card from '../common/Card';
import { Clock, CheckCircle2, PieChart } from 'lucide-react';

const StudyProgress = ({ totalTime = 180, completedTime = 0, sessions = [] }) => {
  const percentage = totalTime > 0 ? Math.min(100, Math.round((completedTime / totalTime) * 100)) : 0;
  const completedCount = sessions.filter((s) => s.completed).length;

  return (
    <Card title="Today's Study Progress" icon={PieChart}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-3xl font-extrabold text-text dark:text-darkSurface-text">
            {completedTime} <span className="text-sm font-semibold text-text-muted dark:text-darkSurface-muted">/ {totalTime} min</span>
          </span>
          <p className="text-xs text-text-muted dark:text-darkSurface-muted mt-0.5">
            {completedCount} of {sessions.length} sessions completed
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-600 dark:text-lavender">
            {percentage}%
          </span>
          <p className="text-[11px] text-text-muted dark:text-darkSurface-muted">Daily Target Met</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-lavender-light/40 dark:bg-darkSurface rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] transition-all duration-500 shadow-sm"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Priority Distribution Explanation */}
      <div className="mt-5 pt-4 border-t border-border/60 dark:border-darkSurface-border text-xs">
        <p className="font-semibold text-text dark:text-darkSurface-text mb-2">
          Time Distribution Algorithm:
        </p>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-300">
            <span className="font-bold block">50% High</span>
            <span>Weak Subjects</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-amber-700 dark:text-amber-300">
            <span className="font-bold block">30% Med</span>
            <span>Moderate Subjects</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300">
            <span className="font-bold block">20% Low</span>
            <span>Strong Subjects</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StudyProgress;
