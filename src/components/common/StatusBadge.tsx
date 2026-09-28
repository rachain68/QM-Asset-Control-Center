import React from 'react';
import { AssetStatus, ReviewStatus } from '../../types/asset';

interface StatusBadgeProps {
  status: AssetStatus | ReviewStatus | string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
}) => {
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';
  let label = status;

  switch (status) {
    case 'Good':
    case 'Optimal':
    case 'Certified':
      styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
      break;
    case 'Fair':
    case 'Calibration Due':
    case 'Under Review':
      styleClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      dotColor = 'bg-amber-500';
      break;
    case 'Poor':
    case 'Critical Fault':
    case 'Out of Tolerance':
      styleClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      dotColor = 'bg-rose-500';
      break;
    case 'Discontinue part':
    case 'Metrology':
    case 'Lab Hold':
      styleClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      dotColor = 'bg-purple-500';
      break;
    case 'Written off':
      styleClasses = 'bg-slate-100 text-slate-600 border-slate-200 line-through';
      dotColor = 'bg-slate-400';
      break;
    case 'Active':
      styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
      label = 'Active';
      break;
    case 'Waiting List':
      styleClasses = 'bg-sky-50 text-sky-700 border-sky-200';
      dotColor = 'bg-sky-500';
      label = 'Waiting Review';
      break;
    default:
      styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      dotColor = 'bg-slate-400';
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] tracking-wider'
      : 'px-2.5 py-0.5 text-xs tracking-wide';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${sizeClasses} ${styleClasses} transition-colors`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor} ${
            status === 'Waiting List' ? 'animate-ping opacity-75' : ''
          }`}
        />
      )}
      <span className="truncate">{label}</span>
    </span>
  );
};
