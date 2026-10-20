import React from 'react';
import { FileText, Bookmark } from 'lucide-react';

const SourceReference = ({ sources = [] }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
        <Bookmark className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
        <span>Referenced Study Sources ({sources.length}):</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sources.map((s, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs transition-colors hover:border-primary-400 dark:hover:border-primary-600 group"
          >
            <FileText className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div className="flex items-center space-x-1 font-medium text-slate-800 dark:text-slate-200">
              <span className="truncate max-w-[150px]">{s.filename}</span>
              <span className="text-primary-600 dark:text-primary-400 font-bold">
                • Page {s.pageNumber}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceReference;
