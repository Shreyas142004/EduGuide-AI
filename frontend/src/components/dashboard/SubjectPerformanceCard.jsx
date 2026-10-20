import React from 'react';
import Card from '../common/Card';
import { BookOpen } from 'lucide-react';

const SubjectPerformanceCard = ({ subjects = [] }) => {
  return (
    <Card title="Subject Summary & Priorities" icon={BookOpen}>
      <div className="space-y-3">
        {subjects.map((s, idx) => {
          const isHigh = s.priority === 'HIGH';
          const isMed = s.priority === 'MEDIUM';

          const badgeColor = isHigh
            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/40'
            : isMed
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/40'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40';

          const barColor = isHigh
            ? 'bg-gradient-to-r from-rose-400 to-rose-500'
            : isMed
            ? 'bg-gradient-to-r from-amber-400 to-amber-500'
            : 'bg-gradient-to-r from-emerald-400 to-emerald-500';

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#FAF9FF] dark:bg-[#1D1533]/80 border border-[#EDE9FE] dark:border-[#352750] flex items-center justify-between transition-colors hover:border-[#7C3AED]/40 dark:hover:border-[#A78BFA]/40"
            >
              <div className="flex-1 mr-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm text-[#241A3D] dark:text-[#F5F3FF]">
                    {s.subjectName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#241A3D] dark:text-[#F5F3FF]">
                      {s.percentage}%
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                      {s.priority} PRIORITY
                    </span>
                  </div>
                </div>

                {/* Micro progress bar */}
                <div className="w-full bg-[#EDE9FE] dark:bg-[#171027] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${barColor}`}
                    style={{ width: `${Math.min(s.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SubjectPerformanceCard;
