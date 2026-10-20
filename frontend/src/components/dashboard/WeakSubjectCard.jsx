import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WeakSubjectCard = ({ weakSubject }) => {
  const navigate = useNavigate();

  if (!weakSubject) {
    return (
      <Card className="h-full flex flex-col justify-center items-center text-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-[#241A3D] dark:text-[#F5F3FF] text-base">All Subjects Balanced</h4>
        <p className="text-xs text-[#8B7EA8] dark:text-[#C4B5FD]/70 mt-1 max-w-xs">
          No critical weak areas detected. Continue maintaining your study schedule to retain strong grades.
        </p>
      </Card>
    );
  }

  const { subjectName, percentage, weakTopics = [], explanation } = weakSubject;

  return (
    <Card className="h-full border-rose-200/80 dark:border-rose-950/60 bg-gradient-to-br from-white to-rose-50/20 dark:from-[#1D1533] dark:to-rose-950/20">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            HIGHEST PRIORITY
          </span>
          <h3 className="mt-2 text-xl font-bold text-[#241A3D] dark:text-[#F5F3FF]">
            {subjectName}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {percentage}%
          </span>
          <p className="text-[11px] font-medium text-[#8B7EA8] dark:text-[#C4B5FD]/70">Recorded Score</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#5B4E7A] dark:text-[#C4B5FD] leading-relaxed">
        {explanation}
      </p>

      {/* Recommended Focus Topics */}
      <div className="mt-4 pt-3 border-t border-[#EDE9FE] dark:border-[#352750]">
        <p className="text-xs font-semibold text-[#241A3D] dark:text-[#F5F3FF] uppercase tracking-wider">
          Focus Topics:
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {weakTopics.length > 0 ? (
            weakTopics.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40"
              >
                {typeof t === 'string' ? t : t.topic}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#8B7EA8] italic">Core syllabus review recommended</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center space-x-2">
        <Button
          variant="primary"
          size="sm"
          className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 focus:ring-rose-500 text-white"
          onClick={() => navigate('/ai-chat')}
        >
          Study Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/quiz')}
        >
          Take Quiz
        </Button>
      </div>
    </Card>
  );
};

export default WeakSubjectCard;
