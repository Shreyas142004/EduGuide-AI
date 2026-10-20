import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { HelpCircle, Sparkles, BookOpen } from 'lucide-react';

const QuizSetup = ({
  subjects = [],
  onGenerateQuiz,
  loading = false,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?._id || '');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubject) return;
    onGenerateQuiz({
      subjectId: selectedSubject,
      topic: topic.trim() || 'Comprehensive Diagnostic Review',
      count,
      difficulty,
    });
  };

  return (
    <Card
      title="Create Interactive Diagnostic Quiz"
      subtitle="Evaluates your mastery on specific topics and dynamically updates your weakness score"
      icon={HelpCircle}
      className="max-w-xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-text-muted dark:text-darkSurface-muted mb-1.5">
            Target Subject <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">-- Choose Subject --</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id} className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Topic */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Focus Topic (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Neural Networks, CNN, Backpropagation, Regression, Normalization"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-[11px] text-text-muted dark:text-darkSurface-muted mt-1">
            Leave blank to test across all topics extracted from this subject's materials.
          </p>
        </div>

        {/* Difficulty Selector (Requirement 32) */}
        <div>
          <label className="block text-xs font-semibold text-text-muted dark:text-darkSurface-muted mb-1.5">
            Quiz Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  difficulty === diff
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div>
          <label className="block text-xs font-semibold text-text-muted dark:text-darkSurface-muted mb-1.5">
            Number of Questions
          </label>
          <div className="flex items-center space-x-3">
            {[3, 5, 8, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCount(num)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                  count === num
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                {num} Qs
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            icon={Sparkles}
            loading={loading}
            disabled={!selectedSubject || loading}
            className="w-full justify-center py-2.5"
          >
            {loading ? 'Synthesizing Quiz Questions...' : 'Start Quiz Now'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default QuizSetup;
