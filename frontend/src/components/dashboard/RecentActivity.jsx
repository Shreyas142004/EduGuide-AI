import React from 'react';
import Card from '../common/Card';
import { History, FileText, HelpCircle, CheckCircle2 } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  return (
    <Card title="Recent Activity" icon={History}>
      {activities.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#8B7EA8]">
          No recent activity logged. Upload a document or complete a quiz to begin!
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act, idx) => {
            const isDoc = act.type === 'document';
            const isQuiz = act.type === 'quiz';

            const Icon = isDoc ? FileText : isQuiz ? HelpCircle : CheckCircle2;
            const iconBg = isDoc
              ? 'bg-[#F5F3FF] dark:bg-[#251B40] text-[#7C3AED] dark:text-[#A78BFA]'
              : isQuiz
              ? 'bg-[#FAF9FF] dark:bg-[#1D1533] text-[#8B5CF6] dark:text-[#DDD6FE]'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400';

            return (
              <div
                key={idx}
                className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-[#FAF9FF] dark:hover:bg-[#1D1533]/60 transition-colors"
              >
                <div className={`p-2 rounded-xl ${iconBg} flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#241A3D] dark:text-[#F5F3FF] truncate">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-[#8B7EA8] dark:text-[#C4B5FD]/70 truncate mt-0.5">{act.subtitle}</p>
                </div>
                <span className="text-[10px] text-[#8B7EA8] flex-shrink-0">{act.time}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;
