import React from 'react';

const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-10 h-10 border-4 border-[#DDD6FE] dark:border-[#352750] border-t-[#7C3AED] rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-[#5B4E7A] dark:text-[#C4B5FD] animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#FAF9FF]/80 dark:bg-[#100B1F]/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
