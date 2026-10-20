import React from 'react';
import Card from '../common/Card';
import { Award, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

const OverallScoreCard = ({ overallScore = 0, counts = { high: 0, medium: 0, low: 0 }, totalSubjects = 0 }) => {
  return (
    <Card className="h-full relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8B7EA8] dark:text-[#C4B5FD]/70">
            Overall Academic Average
          </p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-[#241A3D] dark:text-[#F5F3FF] tracking-tight">
              {overallScore}%
            </span>
            <span className="text-xs font-medium text-[#8B7EA8] dark:text-[#C4B5FD]/70">
              across {totalSubjects} subjects
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] dark:bg-[#251B40] text-[#7C3AED] dark:text-[#A78BFA] flex items-center justify-center shadow-xs">
          <Award className="w-6 h-6" />
        </div>
      </div>

      {/* Progress Bar with Lavender/Violet Gradient */}
      <div className="mt-5 w-full bg-[#FAF9FF] dark:bg-[#171027] rounded-full h-2.5 overflow-hidden border border-[#EDE9FE] dark:border-[#352750]">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            overallScore >= 75
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
              : overallScore >= 60
              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
              : 'bg-gradient-to-r from-rose-400 to-rose-500'
          }`}
          style={{ width: `${Math.min(overallScore, 100)}%` }}
        ></div>
      </div>

      {/* Breakdown Pills */}
      <div className="mt-6 grid grid-cols-3 gap-2 pt-4 border-t border-[#EDE9FE] dark:border-[#352750]">
        <div className="text-center p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/40">
          <div className="flex items-center justify-center space-x-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Strong</span>
          </div>
          <p className="text-lg font-bold text-[#241A3D] dark:text-[#F5F3FF] mt-1">{counts.low}</p>
        </div>

        <div className="text-center p-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100/60 dark:border-amber-900/40">
          <div className="flex items-center justify-center space-x-1 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Moderate</span>
          </div>
          <p className="text-lg font-bold text-[#241A3D] dark:text-[#F5F3FF] mt-1">{counts.medium}</p>
        </div>

        <div className="text-center p-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100/60 dark:border-rose-900/40">
          <div className="flex items-center justify-center space-x-1 text-rose-600 dark:text-rose-400 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Weak</span>
          </div>
          <p className="text-lg font-bold text-[#241A3D] dark:text-[#F5F3FF] mt-1">{counts.high}</p>
        </div>
      </div>
    </Card>
  );
};

export default OverallScoreCard;
