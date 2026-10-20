import React from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';

const ProcessingStatus = ({ status = 'Ready' }) => {
  switch (status) {
    case 'Ready':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Indexed & Ready
        </span>
      );
    case 'Processing':
    case 'Indexing':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-lavender-soft/40 dark:bg-primary-950/60 text-primary-700 dark:text-lavender border border-lavender/40 dark:border-primary-800/60">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> {status}...
        </span>
      );
    case 'Uploading':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
          <Clock className="w-3 h-3 mr-1" /> Uploading
        </span>
      );
    case 'Failed':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
          <AlertCircle className="w-3 h-3 mr-1" /> Processing Failed
        </span>
      );
    default:
      return null;
  }
};

export default ProcessingStatus;
