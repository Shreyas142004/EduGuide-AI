import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Edit2, HelpCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubjectTable = ({ performances = [], onEditScore }) => {
  const navigate = useNavigate();

  return (
    <Card title="Subject Performance Records" subtitle="Track exams, assignments, and priority classifications" icon={BookOpen} padding="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-lavender-light/40 dark:bg-darkSurface/60 text-text-muted dark:text-darkSurface-muted text-[11px] uppercase font-bold tracking-wider border-b border-border dark:border-darkSurface-border">
            <tr>
              <th className="px-6 py-3.5">Subject</th>
              <th className="px-6 py-3.5">Score</th>
              <th className="px-6 py-3.5">Percentage</th>
              <th className="px-6 py-3.5">Classification</th>
              <th className="px-6 py-3.5">Priority</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 dark:divide-darkSurface-border">
            {performances.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-text-muted dark:text-darkSurface-muted text-xs">
                  No academic scores entered yet. Click "Add Performance" to begin.
                </td>
              </tr>
            ) : (
              performances.map((p) => {
                const sName = p.subjectId?.name || 'Subject';
                const sCode = p.subjectId?.code || '';
                const pct = p.percentage;

                let classification = 'Weak';
                let classBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/40';

                if (pct >= 90) {
                  classification = 'Excellent';
                  classBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40';
                } else if (pct >= 75) {
                  classification = 'Strong';
                  classBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40';
                } else if (pct >= 60) {
                  classification = 'Moderate';
                  classBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/40';
                }

                const priorityBadge =
                  p.priority === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold'
                    : p.priority === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold';

                return (
                  <tr
                    key={p._id}
                    className="hover:bg-lavender-light/30 dark:hover:bg-darkSurface-elevated/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-text dark:text-darkSurface-text">
                        {sName}
                      </div>
                      {sCode && (
                        <div className="text-xs text-text-muted dark:text-darkSurface-muted">{sCode}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-text-muted dark:text-darkSurface-muted">
                      {p.examScore} / {p.maxScore}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-text dark:text-darkSurface-text">
                          {pct}%
                        </span>
                        <div className="w-16 bg-border dark:bg-darkSurface-border rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              pct >= 75 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${classBadge}`}>
                        {classification}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${priorityBadge}`}>
                        {p.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onEditScore(p)}
                        className="p-1.5 rounded-lg text-text-muted dark:text-darkSurface-muted hover:text-primary-600 dark:hover:text-lavender hover:bg-lavender-light/50 dark:hover:bg-darkSurface-elevated transition-colors"
                        title="Edit Score"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate('/quiz')}
                        className="p-1.5 rounded-lg text-text-muted dark:text-darkSurface-muted hover:text-primary-600 dark:hover:text-lavender hover:bg-lavender-light/50 dark:hover:bg-darkSurface-elevated transition-colors"
                        title="Take Diagnostic Quiz"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
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

export default SubjectTable;
