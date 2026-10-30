import React from 'react';
import { DataSourceBadge } from '../../data/schema';
import { ShieldCheck, Radio, Calculator, HelpCircle, AlertCircle } from 'lucide-react';

interface BadgeProps {
  source: DataSourceBadge | string;
  className?: string;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ source, className = '', showIcon = true }) => {
  let bg = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
  let icon = <HelpCircle className="w-3 h-3 mr-1 inline" />;

  switch (source) {
    case 'TEAM VERIFIED':
      bg = 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-700';
      icon = <ShieldCheck className="w-3 h-3 mr-1 inline text-teal-600 dark:text-teal-400" />;
      break;
    case 'LIVE API DATA':
      bg = 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300 dark:border-sky-700';
      icon = <Radio className="w-3 h-3 mr-1 inline text-sky-600 dark:text-sky-400 animate-pulse" />;
      break;
    case 'CALCULATED FROM PROVIDED DATA':
      bg = 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700';
      icon = <Calculator className="w-3 h-3 mr-1 inline text-indigo-600 dark:text-indigo-400" />;
      break;
    case 'PLACEHOLDER':
      bg = 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      icon = <AlertCircle className="w-3 h-3 mr-1 inline text-amber-600 dark:text-amber-400" />;
      break;
    case 'NOT AVAILABLE':
      bg = 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      icon = <AlertCircle className="w-3 h-3 mr-1 inline text-rose-600 dark:text-rose-400" />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide border uppercase ${bg} ${className}`}
      title={`Data Provenance: ${source}`}
    >
      {showIcon && icon}
      {source}
    </span>
  );
};
