import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Award, CheckCircle2, XCircle, Bot, CalendarCheck, RotateCcw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizResult = ({ result, onRetake }) => {
  const navigate = useNavigate();
  const { score, totalQuestions, percentage, topicResults = [] } = result;

  const weakTopics = Array.from(
    new Set(topicResults.filter((t) => !t.isCorrect).map((t) => t.topic))
  );
  const strongTopics = Array.from(
    new Set(topicResults.filter((t) => t.isCorrect).map((t) => t.topic))
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score Overview Card */}
      <Card className="text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-lavender-soft/40 dark:bg-primary-950/60 text-primary-600 dark:text-lavender flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-text dark:text-darkSurface-text">
          Quiz Evaluation Completed!
        </h2>
        <p className="text-xs text-text-muted dark:text-darkSurface-muted mt-1">
          Your topic-level diagnostic scores and subject performance have been automatically updated.
        </p>

        <div className="mt-6 flex items-center justify-center space-x-6">
          <div>
            <span className="text-4xl font-extrabold text-primary-600 dark:text-lavender">
              {score} / {totalQuestions}
            </span>
            <p className="text-xs font-semibold text-text-muted dark:text-darkSurface-muted uppercase tracking-wider mt-1">
              Correct Answers
            </p>
          </div>
          <div className="h-10 w-px bg-border dark:bg-darkSurface-border"></div>
          <div>
            <span className={`text-4xl font-extrabold ${percentage >= 75 ? 'text-emerald-500' : percentage >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
              {percentage}%
            </span>
            <p className="text-xs font-semibold text-text-muted dark:text-darkSurface-muted uppercase tracking-wider mt-1">
              Percentage
            </p>
          </div>
        </div>

        {/* Topic Breakdown Badges */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-6 border-t border-border/60 dark:border-darkSurface-border">
          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center mb-2">
              <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
              Weak Topics (Needs Revision):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {weakTopics.length > 0 ? (
                weakTopics.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-xs font-semibold bg-rose-100/70 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-600 font-medium">None! Perfect score on all tested topics.</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Strong Topics (Retained Well):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {strongTopics.length > 0 ? (
                strongTopics.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-xs font-semibold bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Review foundational concepts.</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Recommendations */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            icon={Bot}
            onClick={() => navigate('/ai-chat')}
          >
            Ask AI Assistant to Explain Weak Topics
          </Button>
          <Button
            variant="outline"
            icon={CalendarCheck}
            onClick={() => navigate('/study-plan')}
          >
            Update Study Plan
          </Button>
          <Button
            variant="ghost"
            icon={RotateCcw}
            onClick={onRetake}
          >
            Take Another Quiz
          </Button>
        </div>
      </Card>

      {/* Detailed Question Explanations List */}
      <Card title="Detailed Solution & Explanations">
        <div className="space-y-4">
          {topicResults.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-sm ${
                  item.isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    )}
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                      Q{idx + 1} • {item.topic}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      item.isCorrect ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                  </span>
                </div>

                <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                  {item.question}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <p className="text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Explanation:</span>{' '}
                    {item.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default QuizResult;
