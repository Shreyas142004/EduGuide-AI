import React, { useState } from 'react';
import DocumentCard from './DocumentCard';
import EmptyState from '../common/EmptyState';
import { FileText, Plus } from 'lucide-react';

const DocumentList = ({ documents = [], subjects = [], onDelete, onUploadClick }) => {
  const [filterSubject, setFilterSubject] = useState('ALL');

  const filteredDocs = filterSubject === 'ALL'
    ? documents
    : documents.filter((d) => (d.subjectId?._id || d.subjectId) === filterSubject);

  return (
    <div className="space-y-4">
      {/* Subject Filter Pills */}
      {documents.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterSubject('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterSubject === 'ALL'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-sm font-bold'
                : 'bg-surface dark:bg-darkSurface-card border border-border dark:border-darkSurface-border text-text dark:text-darkSurface-text hover:bg-lavender-light/50 dark:hover:bg-darkSurface-elevated'
            }`}
          >
            All Documents ({documents.length})
          </button>
          {subjects.map((s) => {
            const count = documents.filter((d) => (d.subjectId?._id || d.subjectId) === s._id).length;
            if (count === 0) return null;
            return (
              <button
                key={s._id}
                onClick={() => setFilterSubject(s._id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterSubject === s._id
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-sm font-bold'
                    : 'bg-surface dark:bg-darkSurface-card border border-border dark:border-darkSurface-border text-text dark:text-darkSurface-text hover:bg-lavender-light/50 dark:hover:bg-darkSurface-elevated'
                }`}
              >
                {s.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={documents.length === 0 ? "You haven't uploaded any study material yet." : "No documents match this subject."}
          description="Upload your lecture notes, reference PDFs, or syllabus to enable AI question answering and smart exam prep."
          actionLabel="Upload First Document"
          actionIcon={Plus}
          onAction={onUploadClick}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <DocumentCard key={doc._id} document={doc} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
