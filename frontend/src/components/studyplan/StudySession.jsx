import React from 'react';
import { Clock, CheckCircle2, Circle, CheckSquare, Square, Target } from 'lucide-react';

const StudySession = ({ session, onToggleComplete }) => {
  const {
    _id,
    subjectName,
    durationMinutes,
    priority,
    focusTopics = [],
    actionableTasks = [],
    completed,
  } = session;

  const isHigh = priority === 'HIGH';
  const isMed = priority === 'MEDIUM';

  const badgeColor = isHigh
    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-900/60'
    : isMed
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900/60'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60';

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        completed
          ? 'bg-lavender-light/20 dark:bg-darkSurface/40 border-border dark:border-darkSurface-border opacity-60'
          : 'bg-surface dark:bg-darkSurface-card border-border dark:border-darkSurface-border shadow-xs hover:border-primary-400 dark:hover:border-primary-600'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onToggleComplete(_id, !completed)}
            className="mt-0.5 text-text-muted hover:text-primary focus:outline-none"
          >
            {completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <Circle className="w-5 h-5 text-border dark:text-darkSurface-border" />
            )}
          </button>
          <div>
            <h3
              className={`text-base font-bold ${
                completed ? 'line-through text-text-muted dark:text-darkSurface-muted' : 'text-text dark:text-darkSurface-text'
              }`}
            >
              {subjectName}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                {priority} PRIORITY
              </span>
              <span className="text-xs font-semibold text-text-muted dark:text-darkSurface-muted flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-primary" />
                {durationMinutes} minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Topics */}
      {focusTopics.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/60 dark:border-darkSurface-border">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-text-muted dark:text-darkSurface-muted mb-2">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span>Recommended Focus Topics:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {focusTopics.map((topic, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-lavender-light/40 dark:bg-darkSurface text-text dark:text-darkSurface-text"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Tasks */}
      {actionableTasks.length > 0 && (
        <div className="mt-4 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted dark:text-darkSurface-muted block mb-1">
            Action Items
          </span>
          {actionableTasks.map((task, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-text-muted dark:text-darkSurface-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
              <span>{task}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySession;
