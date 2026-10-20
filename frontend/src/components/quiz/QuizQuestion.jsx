import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const QuizQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onSubmit,
  isSubmitting = false,
}) => {
  const isLast = currentIndex === totalQuestions - 1;
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <Card className="max-w-2xl mx-auto">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between text-xs text-text-muted dark:text-darkSurface-muted mb-2">
        <span className="font-semibold uppercase tracking-wider">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="font-bold text-primary-600 dark:text-lavender">
          {progressPct}% Completed
        </span>
      </div>

      <div className="w-full bg-lavender-light/40 dark:bg-darkSurface rounded-full h-1.5 overflow-hidden mb-6">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>

      {/* Topic Tag */}
      {question.topic && (
        <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-lavender-soft/40 dark:bg-primary-950/60 text-primary-700 dark:text-lavender mb-2">
          Topic: {question.topic}
        </span>
      )}

      {/* Question Text */}
      <h3 className="text-base md:text-lg font-bold text-text dark:text-darkSurface-text leading-snug">
        {question.question}
      </h3>

      {/* Options */}
      <div className="mt-6 space-y-2.5">
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const letter = String.fromCharCode(65 + idx);

          return (
            <div
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              className={`p-3.5 rounded-xl border text-sm font-medium cursor-pointer transition-all flex items-center space-x-3 ${
                isSelected
                  ? 'border-[#7C3AED] bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ring-2 ring-[#7C3AED]/30 shadow-xs'
                  : 'border-border dark:border-darkSurface-border hover:border-purple-300 dark:hover:border-purple-600 bg-surface dark:bg-darkSurface-card text-text dark:text-darkSurface-text'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-xs'
                    : 'bg-lavender-light/50 dark:bg-darkSurface text-text-muted dark:text-darkSurface-muted'
                }`}
              >
                {letter}
              </span>
              <span className="flex-1">{opt}</span>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-4 border-t border-border/60 dark:border-darkSurface-border flex justify-end">
        {isLast ? (
          <Button
            variant="primary"
            icon={CheckCircle2}
            loading={isSubmitting}
            disabled={selectedAnswer === undefined || selectedAnswer === null || isSubmitting}
            onClick={onSubmit}
          >
            Submit Quiz for Evaluation
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={selectedAnswer === undefined || selectedAnswer === null}
            onClick={onNext}
          >
            Next Question <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizQuestion;
