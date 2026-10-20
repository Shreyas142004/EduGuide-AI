import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { Save, Plus } from 'lucide-react';

const ScoreForm = ({ subjects = [], initialData = null, onSave, onCancel, onAddNewSubject }) => {
  const [subjectId, setSubjectId] = useState(initialData?.subjectId?._id || initialData?.subjectId || subjects[0]?._id || '');
  const [examScore, setExamScore] = useState(initialData?.examScore ?? '');
  const [maxScore, setMaxScore] = useState(initialData?.maxScore ?? 100);
  const [previousScore, setPreviousScore] = useState(initialData?.previousScore ?? '');
  const [assignmentScore, setAssignmentScore] = useState(initialData?.assignmentScore ?? '');
  const [quizScore, setQuizScore] = useState(initialData?.quizScore ?? '');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setSubjectId(initialData.subjectId?._id || initialData.subjectId || '');
      setExamScore(initialData.examScore ?? '');
      setMaxScore(initialData.maxScore ?? 100);
      setPreviousScore(initialData.previousScore ?? '');
      setAssignmentScore(initialData.assignmentScore ?? '');
      setQuizScore(initialData.quizScore ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!subjectId && !newSubjectName.trim()) {
      setError('Please select or specify a subject name.');
      return;
    }

    if (examScore === '' || Number(examScore) < 0 || Number(examScore) > Number(maxScore)) {
      setError(`Exam score must be between 0 and ${maxScore}.`);
      return;
    }

    onSave({
      subjectId: isAddingNew ? null : subjectId,
      newSubjectName: isAddingNew ? newSubjectName.trim() : null,
      examScore: Number(examScore),
      maxScore: Number(maxScore),
      previousScore: previousScore !== '' ? Number(previousScore) : 0,
      assignmentScore: assignmentScore !== '' ? Number(assignmentScore) : 0,
      quizScore: quizScore !== '' ? Number(quizScore) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Subject Selector or New Subject Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Subject <span className="text-rose-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="text-xs text-primary-600 dark:text-lavender hover:underline font-medium"
          >
            {isAddingNew ? 'Select Existing Subject' : '+ Create New Subject'}
          </button>
        </div>

        {isAddingNew ? (
          <input
            type="text"
            placeholder="e.g. AI/ML, Operating Systems, Cloud Computing"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ) : (
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">-- Choose Subject --</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id} className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">
                {s.name} {s.code ? `(${s.code})` : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Exam Score <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            max={maxScore}
            value={examScore}
            onChange={(e) => setExamScore(e.target.value)}
            placeholder="e.g. 48"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Max Marks
          </label>
          <input
            type="number"
            min="10"
            max="1000"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            placeholder="100"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Previous Exam Score (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={previousScore}
            onChange={(e) => setPreviousScore(e.target.value)}
            placeholder="e.g. 52"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Assignment Score (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={assignmentScore}
            onChange={(e) => setAssignmentScore(e.target.value)}
            placeholder="e.g. 60"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Recent Quiz Score (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={quizScore}
          onChange={(e) => setQuizScore(e.target.value)}
          placeholder="e.g. 50"
          className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" icon={Save}>
          Save Performance
        </Button>
      </div>
    </form>
  );
};

export default ScoreForm;
