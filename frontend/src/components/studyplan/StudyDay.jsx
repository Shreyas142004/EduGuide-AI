import React from 'react';
import StudySession from './StudySession';
import { Calendar } from 'lucide-react';

const StudyDay = ({ date, sessions = [], onToggleComplete }) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : "Today's Schedule";

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-xs font-semibold text-text-muted dark:text-darkSurface-muted uppercase tracking-wider mb-2">
        <Calendar className="w-3.5 h-3.5 text-primary" />
        <span>{formattedDate}</span>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <StudySession
            key={session._id}
            session={session}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default StudyDay;
