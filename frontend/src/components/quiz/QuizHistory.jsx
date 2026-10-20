import React from 'react';
import Card from '../common/Card';
import { History, Calendar } from 'lucide-react';

const QuizHistory = ({ attempts = [] }) => {
  return (
    <Card title="Past Diagnostic Quiz Attempts" icon={History} padding="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-lavender-light/40 dark:bg-darkSurface/60 text-text-muted dark:text-darkSurface-muted text-[11px] uppercase font-bold tracking-wider border-b border-border dark:border-darkSurface-border">
            <tr>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Topic</th>
              <th className="px-6 py-3">Score</th>
              <th className="px-6 py-3">Percentage</th>
              <th className="px-6 py-3 text-right">Completed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 dark:divide-darkSurface-border">
            {attempts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-text-muted dark:text-darkSurface-muted text-xs">
                  No quiz history recorded yet.
                </td>
              </tr>
            ) : (
              attempts.map((att) => {
                const sName = att.subjectId?.name || 'Subject';
                const topic = att.quizId?.topic || 'General';
                const date = new Date(att.completedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr key={att._id} className="hover:bg-lavender-light/30 dark:hover:bg-darkSurface-elevated/40">
                    <td className="px-6 py-3.5 font-semibold text-text dark:text-darkSurface-text">
                      {sName}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-text-muted dark:text-darkSurface-muted">
                      {topic}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-text-muted dark:text-darkSurface-muted">
                      {att.score} / {att.totalQuestions}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${
                          att.percentage >= 75
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : att.percentage >= 60
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-xs text-text-muted dark:text-darkSurface-muted">
                      {date}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default QuizHistory;
