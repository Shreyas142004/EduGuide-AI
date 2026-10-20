import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#DDD6FE] dark:border-[#352750] bg-[#FAF9FF]/60 dark:bg-[#171027]/40 ${className}`}>
      {Icon && (
        <div className="p-4 rounded-2xl bg-[#F5F3FF] dark:bg-[#251B40] text-[#7C3AED] dark:text-[#A78BFA] mb-4 shadow-sm shadow-purple-500/10">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[#241A3D] dark:text-[#F5F3FF]">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-[#8B7EA8] dark:text-[#C4B5FD]/70 max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="md" icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
