import React, { useState } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Ask anything about your study materials..." }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <input
        type="text"
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-4 pr-12 py-3 bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:opacity-60 transition-all"
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className="absolute right-2.5 p-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 disabled:hover:bg-primary-600 transition-colors focus:outline-none shadow-xs"
        title="Send (Enter)"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};

export default ChatInput;
