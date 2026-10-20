import React from 'react';
import Button from '../common/Button';
import { Plus, MessageSquare, Trash2, Filter, BookOpen, FileText, X } from 'lucide-react';

const ChatSidebar = ({
  sessions = [],
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  subjects = [],
  documents = [],
  selectedSubject,
  onSelectSubject,
  selectedDocument,
  onSelectDocument,
  isOpen = false,
  onClose,
}) => {
  const sidebarBody = (
    <>
      {/* New Chat Button */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <Button
          variant="primary"
          className="w-full justify-center"
          icon={Plus}
          onClick={() => {
            onNewChat();
            if (onClose) onClose();
          }}
        >
          New Academic Chat
        </Button>
      </div>

      {/* Scope Filters (Subject & Document) */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-[#111827]">
        <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          <Filter className="w-3.5 h-3.5 mr-1 text-primary-600 dark:text-primary-400" />
          <span>Knowledge Scope</span>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1">Filter by Subject</label>
          <select
            value={selectedSubject || ''}
            onChange={(e) => onSelectSubject(e.target.value || null)}
            className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary font-medium"
          >
            <option value="" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">All Subjects & Notes</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id} className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Document Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1">Filter by Document</label>
          <select
            value={selectedDocument || ''}
            onChange={(e) => onSelectDocument(e.target.value || null)}
            className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary font-medium"
          >
            <option value="" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">All Uploaded Documents</option>
            {documents.map((d) => (
              <option key={d._id} value={d._id} className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">
                {d.originalName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Previous Sessions List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 px-2 py-1">
          Chat History
        </p>

        {sessions.length === 0 ? (
          <p className="text-center text-xs text-slate-400 dark:text-slate-400 py-6">No previous conversations</p>
        ) : (
          sessions.map((s) => {
            const isSelected = s._id === currentSessionId;
            return (
              <div
                key={s._id}
                onClick={() => {
                  onSelectSession(s._id);
                  if (onClose) onClose();
                }}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-white border-l-2 border-primary-600 shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 truncate mr-2">
                  <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-300'}`} />
                  <span className="truncate">{s.title || 'Academic Discussion'}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(s._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                  title="Delete Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on md screens and up) */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex-col h-full flex-shrink-0">
        {sidebarBody}
      </aside>

      {/* Mobile Drawer (visible on screens < md when toggled) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-80 max-w-[85vw] bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10 h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827]">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Chat History & Scope</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sidebarBody}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSidebar;
