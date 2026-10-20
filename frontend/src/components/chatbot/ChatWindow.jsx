import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedPrompts from './SuggestedPrompts';
import { Bot, Sparkles, BookOpen, SlidersHorizontal, Plus } from 'lucide-react';

const ChatWindow = ({
  messages = [],
  loading = false,
  onSendMessage,
  suggestedPrompts = [],
  subjectName,
  documentName,
  onToggleMobileSidebar,
  onNewChat,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 || loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 w-full bg-slate-50/50 dark:bg-[#090d16] overflow-hidden">
      {/* Top Header / Scope & Mobile Navigation Bar */}
      <div className="px-3.5 py-2.5 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          {/* Mobile button to open History & Scope Drawer */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex-shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
            title="Chat History & Knowledge Scope"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span>History & Scope</span>
          </button>

          {/* Scope Indicator */}
          <div className="flex items-center text-xs text-slate-600 dark:text-slate-300 truncate">
            <BookOpen className="w-3.5 h-3.5 mr-1 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span className="truncate">
              {subjectName ? (
                <>
                  Scope: <strong className="text-slate-900 dark:text-slate-100">{subjectName}</strong>
                  {documentName ? ` (${documentName})` : ''}
                </>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 font-medium">Scope: All Subjects & Notes</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Desktop Grounding Badge */}
          <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            Strict RAG Grounding
          </span>

          {/* Quick New Chat Button on Mobile */}
          <button
            type="button"
            onClick={onNewChat}
            className="md:hidden inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white hover:opacity-95 shadow-2xs"
            title="Start New Chat"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-4 min-w-0 w-full">
        {messages.length === 0 ? (
          <div className="min-h-full py-4 px-2 sm:px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-3 sm:mb-4">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              EduGuide Academic Assistant
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ask questions about your uploaded lecture slides, notes, or syllabus.
              Answers are cited directly with verified document page numbers.
            </p>

            <div className="mt-8 w-full text-left">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Try asking:
              </p>
              <div className="space-y-1.5">
                {[
                  "Explain this topic simply.",
                  "Explain this as a 10-mark answer.",
                  "Give me an example.",
                  "Generate important questions.",
                  "Create a quiz from this topic.",
                  "What should I study today?",
                  "What are my weak topics?",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(prompt)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-primary-500 text-slate-800 dark:text-slate-200 shadow-xs transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m, idx) => <ChatMessage key={m._id || idx} message={m} />)
        )}

        {/* Loading Bubble */}
        {loading && (
          <div className="w-full min-w-0 flex items-start gap-3 my-3.5 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 flex items-center justify-center text-white flex-shrink-0 shadow-xs mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">Searching study chunks & synthesizing with Gemini...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Suggested Prompts & Chat Input Area */}
      <div className="p-3 md:p-4 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 w-full min-w-0 flex-shrink-0">
        <SuggestedPrompts
          prompts={suggestedPrompts}
          onSelectPrompt={(p) => onSendMessage(p)}
        />
        <div className="mt-2">
          <ChatInput onSendMessage={onSendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
