import React from 'react';
import Card from '../common/Card';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

const WeaknessAnalysis = ({ analysis = {} }) => {
  const { allSubjects = [], highPriority = [], mediumPriority = [], lowPriority = [] } = analysis;

  return (
    <Card
      title="Academic Weakness Analysis"
      subtitle="Priority allocation based on multi-factor evaluation (exam marks, past tests, quiz trends)"
      icon={AlertCircle}
    >
      <div className="space-y-4">
        {/* Notice badge adhering to requirement 10 & 45 */}
        <div className="p-3 rounded-xl bg-lavender-soft/30 dark:bg-primary-950/40 border border-lavender/40 dark:border-primary-900/40 text-xs text-primary-900 dark:text-lavender">
          <p className="font-semibold">Evaluation Methodology Notice:</p>
          <p className="mt-0.5 text-primary-800 dark:text-lavender-soft">
            This Academic Weakness Analysis synthesizes your exam, quiz, and assignment scores to recommend study priority. It is designed for revision guidance and study planning.
          </p>
        </div>

        {allSubjects.length === 0 ? (
          <p className="text-center text-xs text-text-muted dark:text-darkSurface-muted py-6">
            Enter your subject marks to generate weakness analysis.
          </p>
        ) : (
          <div className="space-y-3">
            {allSubjects.map((s, idx) => {
              const isHigh = s.priority === 'HIGH';
              const isMed = s.priority === 'MEDIUM';

              const cardBorder = isHigh
                ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20'
                : isMed
                ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20'
                : 'border-border dark:border-darkSurface-border bg-lavender-light/20 dark:bg-darkSurface/30';

              const badgeColor = isHigh
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : isMed
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';

              return (
                <div key={idx} className={`p-4 rounded-xl border ${cardBorder} transition-all`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-text dark:text-darkSurface-text">
                        {s.subjectName}
                      </span>
                      <span className="text-xs font-semibold text-text-muted dark:text-darkSurface-muted">
                        ({s.percentage}%)
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                      {s.priority} PRIORITY
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-text-muted dark:text-darkSurface-muted leading-relaxed">
                    {s.explanation}
                  </p>

                  {/* Weak topics within this subject */}
                  {s.weakTopics && s.weakTopics.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center space-x-2">
                      <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                        Recommended Focus:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {s.weakTopics.map((wt, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-100/70 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300"
                          >
                            {typeof wt === 'string' ? wt : wt.topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeaknessAnalysis;
