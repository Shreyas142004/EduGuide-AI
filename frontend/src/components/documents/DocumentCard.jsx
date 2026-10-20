import React from 'react';
import Card from '../common/Card';
import ProcessingStatus from './ProcessingStatus';
import { FileText, Trash2, Layers, BookOpen, Calendar } from 'lucide-react';

const DocumentCard = ({ document, onDelete }) => {
  const {
    _id,
    originalName,
    fileType,
    subjectId,
    processingStatus,
    pageCount = 1,
    chunkCount = 0,
    extractedTopics = [],
    uploadedAt,
  } = document;

  const subjectName = subjectId?.name || 'General';

  const formattedDate = uploadedAt
    ? new Date(uploadedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Card className="hover:border-primary-300 dark:hover:border-primary-700 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-lavender-soft/40 dark:bg-primary-950/60 text-primary-600 dark:text-lavender mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text dark:text-darkSurface-text line-clamp-1" title={originalName}>
                {originalName}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center text-xs text-primary-600 dark:text-lavender font-medium">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {subjectName}
                </span>
                <span className="text-border dark:text-darkSurface-border">•</span>
                <span className="text-[11px] uppercase font-bold text-text-muted dark:text-darkSurface-muted">
                  {fileType}
                </span>
              </div>
            </div>
          </div>

          <ProcessingStatus status={processingStatus} />
        </div>

        {/* Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-lavender-light/40 dark:bg-darkSurface/50 border border-border dark:border-darkSurface-border text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pages</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{pageCount}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Vector Chunks</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{chunkCount}</span>
          </div>
        </div>

        {/* Extracted Topics Chips */}
        {extractedTopics && extractedTopics.length > 0 && (
          <div className="mt-3">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1.5">
              Extracted Topics
            </span>
            <div className="flex flex-wrap gap-1">
              {extractedTopics.slice(0, 4).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {topic}
                </span>
              ))}
              {extractedTopics.length > 4 && (
                <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                  +{extractedTopics.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center text-[11px]">
          <Calendar className="w-3 h-3 mr-1" /> {formattedDate}
        </span>
        <button
          onClick={() => onDelete(_id)}
          title="Delete document and remove vectors"
          className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};

export default DocumentCard;
