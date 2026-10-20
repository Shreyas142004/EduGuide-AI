import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { CalendarCheck, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudyRecommendation = ({ studyPlan, onToggleSession }) => {
  const navigate = useNavigate();

  const sessions = studyPlan?.sessions || [];
  const totalTime = studyPlan?.totalStudyTime || 180;
  const completedCount = sessions.filter((s) => s.completed).length;

  return (
    <Card
      title="Today's Recommended Study Plan"
      icon={CalendarCheck}
      action={
        <Button variant="ghost" size="sm" onClick={() => navigate('/study-plan')}>
          View Full Plan <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      }
    >
      <div className="flex items-center justify-between text-xs text-[#8B7EA8] dark:text-[#C4B5FD]/70 mb-4 pb-3 border-b border-[#EDE9FE] dark:border-[#352750]">
        <span className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1 text-[#7C3AED] dark:text-[#A78BFA]" />
          Total: {Math.round(totalTime / 60)} hrs ({totalTime} mins)
        </span>
        <span>
          {completedCount} of {sessions.length} sessions completed
        </span>
      </div>

      {sessions.length === 0 ? (
        <div className="py-6 text-center text-[#8B7EA8] text-xs">
          No active study sessions. Click below to generate your tailored daily plan.
        </div>
      ) : (
        <div className="space-y-2.5">
          {sessions.map((session, idx) => {
            const isHigh = session.priority === 'HIGH';
            const isMed = session.priority === 'MEDIUM';

            const badgeBg = isHigh
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/50'
              : isMed
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50';

            return (
              <div
                key={idx}
                onClick={() => onToggleSession && onToggleSession(session._id, !session.completed)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  session.completed
                    ? 'bg-[#FAF9FF]/50 dark:bg-[#100B1F]/40 border-[#EDE9FE] dark:border-[#352750] opacity-60'
                    : 'bg-white dark:bg-[#1D1533] border-[#EDE9FE] dark:border-[#352750] hover:border-[#7C3AED] dark:hover:border-[#A78BFA]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    className="text-[#8B7EA8] hover:text-[#7C3AED] dark:hover:text-[#A78BFA] focus:outline-none"
                  >
                    {session.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#DDD6FE] dark:text-[#352750]" />
                    )}
                  </button>
                  <div>
                    <h4
                      className={`text-sm font-semibold ${
                        session.completed
                          ? 'line-through text-[#8B7EA8] dark:text-[#9D8DC0]'
                          : 'text-[#241A3D] dark:text-[#F5F3FF]'
                      }`}
                    >
                      {session.subjectName}
                    </h4>
                    <p className="text-xs text-[#8B7EA8] dark:text-[#C4B5FD]/70">
                      Focus: {(session.focusTopics || session.topics || []).slice(0, 2).join(', ') || 'Core concepts'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badgeBg}`}>
                    {session.durationMinutes} min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default StudyRecommendation;
