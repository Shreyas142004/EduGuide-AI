import React from 'react';
import StudyDay from './StudyDay';
import StudyProgress from './StudyProgress';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import { RefreshCw, CalendarCheck, Plus } from 'lucide-react';

const StudyPlan = ({
  plan,
  loading = false,
  onGeneratePlan,
  onToggleSession,
}) => {
  if (!plan || !plan.sessions || plan.sessions.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="Complete your performance profile to generate a personalized study plan."
        description="Enter your subject marks and academic goals, then EduGuide AI will distribute your available daily study time dynamically."
        actionLabel="Generate Today's Study Plan"
        actionIcon={Plus}
        onAction={onGeneratePlan}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-surface dark:bg-darkSurface-card border border-border dark:border-darkSurface-border shadow-xs">
        <div>
          <h2 className="text-base font-bold text-text dark:text-darkSurface-text">
            Daily Academic Time Allocation
          </h2>
          <p className="text-xs text-text-muted dark:text-darkSurface-muted mt-0.5">
            Dynamically recalibrates when your exam marks or quiz performance update
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          loading={loading}
          onClick={onGeneratePlan}
        >
          Regenerate Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Progress & Weights */}
        <div className="lg:col-span-1">
          <StudyProgress
            totalTime={plan.totalStudyTime}
            completedTime={plan.completedTime}
            sessions={plan.sessions}
          />
        </div>

        {/* Right Column: Sessions */}
        <div className="lg:col-span-2">
          <StudyDay
            date={plan.date}
            sessions={plan.sessions}
            onToggleComplete={onToggleSession}
          />
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;
