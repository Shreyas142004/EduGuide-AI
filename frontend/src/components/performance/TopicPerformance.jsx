import React from 'react';
import Card from '../common/Card';
import { Target, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TopicPerformance = ({ topics = [] }) => {
  const weakTopics = topics.filter((t) => t.percentage < 60);

  return (
    <Card
      title="Topic-Level Diagnostics"
      subtitle="Evaluation derived from topic quizzes, question answering, and study materials"
      icon={Target}
    >
      {/* Smart recommendation banner if weak topics present */}
      {weakTopics.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-bold">Revision Priority Recommendation:</span>
            <p className="mt-0.5">
              Focus on <strong>{weakTopics.map((w) => w.topic).join(' and ')}</strong> before revising higher-scoring areas.
            </p>
          </div>
        </div>
      )}

      {topics.length === 0 ? (
        <p className="text-center text-xs text-text-muted dark:text-darkSurface-muted py-6">
          No topic-level quiz evaluations recorded yet. Take a quiz to populate granular topic evaluations!
        </p>
      ) : (
        <div className="space-y-3">
          {topics.map((item, idx) => {
            const pct = item.percentage;
            const isWeak = pct < 60;
            const isMod = pct >= 60 && pct < 75;

            const badgeBg = isWeak
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              : isMod
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';

            const barColor = isWeak ? 'bg-rose-500' : isMod ? 'bg-amber-500' : 'bg-emerald-500';

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-lavender-light/30 dark:bg-darkSurface/50 border border-border dark:border-darkSurface-border"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-semibold text-xs text-text dark:text-darkSurface-text">
                      {item.topic}
                    </span>
                    {item.subjectName && (
                      <span className="text-[11px] text-text-muted dark:text-darkSurface-muted ml-2">
                        ({item.subjectName})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-text dark:text-darkSurface-text">
                      {pct}%
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeBg}`}>
                      {item.status || (isWeak ? 'Weak' : isMod ? 'Moderate' : 'Strong')}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-border dark:bg-darkSurface-border rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${barColor}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default TopicPerformance;
