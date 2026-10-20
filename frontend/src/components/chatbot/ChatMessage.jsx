import React from 'react';
import SourceReference from './SourceReference';
import { Bot, User as UserIcon } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  // Format basic markdown elements: headings, bullets, bold, blockquotes
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={index} className={`text-base font-bold mt-3.5 mb-2 ${isUser ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Heading 4
      if (line.startsWith('#### ')) {
        return (
          <h5 key={index} className={`text-sm font-bold mt-2.5 mb-1.5 ${isUser ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {line.replace('#### ', '')}
          </h5>
        );
      }
      // Blockquote
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={index}
            className="my-3 pl-3.5 py-2.5 border-l-4 border-indigo-500 text-xs italic text-slate-900 dark:text-slate-100 bg-indigo-50/80 dark:bg-slate-800 rounded-r-lg font-medium shadow-xs"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      // Bullet list item
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <div key={index} className="flex items-start space-x-2 my-1.5 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mt-2 flex-shrink-0"></span>
            <span className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
              {renderBoldText(itemText, isUser)}
            </span>
          </div>
        );
      }
      // Numbered list item
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={index} className={`my-1.5 text-sm pl-2 leading-relaxed ${isUser ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
            {renderBoldText(line, isUser)}
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={index} className="h-2"></div>;
      }
      // Normal paragraph
      return (
        <p key={index} className={`text-sm leading-relaxed my-1.5 ${isUser ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
          {renderBoldText(line, isUser)}
        </p>
      );
    });
  };

  const renderBoldText = (text, isUserMessage = false) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong
            key={i}
            className={`font-semibold ${isUserMessage ? 'text-white font-bold' : 'text-slate-900 dark:text-white'}`}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className={`w-full min-w-0 flex items-start gap-3 my-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 flex items-center justify-center text-white flex-shrink-0 shadow-xs mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs break-words overflow-hidden ${
          isUser
            ? 'bg-primary-600 text-white rounded-tr-none'
            : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
        }`}
      >
        <div className="prose dark:prose-invert max-w-none text-sm break-words overflow-hidden">
          {renderFormattedContent(message.content)}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceReference sources={message.sources} />
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 flex items-center justify-center text-primary-700 dark:text-primary-300 flex-shrink-0 shadow-xs mt-0.5">
          <UserIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
