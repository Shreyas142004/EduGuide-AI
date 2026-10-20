import React from 'react';
import { Sparkles } from 'lucide-react';

const defaultPrompts = [
  "Explain this topic simply.",
  "Explain this as a 10-mark answer.",
  "Give me an example.",
  "Generate important questions.",
  "Create a quiz from this topic.",
  "What should I study today?",
  "What are my weak topics?",
];

const SuggestedPrompts = ({ prompts = defaultPrompts, onSelectPrompt }) => {
  return (
    <div className="py-1.5 overflow-x-auto no-scrollbar w-full min-w-0 max-w-full">
      <div className="flex items-center space-x-2 w-max pb-1">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" /> Suggestions:
        </span>
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/60 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition-colors whitespace-nowrap flex-shrink-0 shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
