import React from 'react';

const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  icon: Icon,
  padding = 'p-6',
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all duration-200 ${
        hover ? 'hover:border-primary-400 dark:hover:border-primary-500/50 hover:shadow-md cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {(title || action || Icon) && (
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
    </div>
  );
};

export default Card;
