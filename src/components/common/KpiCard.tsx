import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  accentColor?: string;
  badge?: React.ReactNode;
  trend?: {
    text: string;
    isPositive?: boolean;
    isWarning?: boolean;
  };
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  iconBgColor = 'bg-sky-50 border-sky-100 text-sky-600',
  accentColor = 'text-slate-900',
  badge,
  trend,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel p-4 sm:p-5 bg-white border border-slate-200 rounded-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-sky-500 hover:shadow-md' : ''
      }`}
    >
      {/* Top Row: Title + Icon / Status Pill */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
          {title}
        </span>
        <div className="flex items-center space-x-2 shrink-0">
          {badge}
          {icon && (
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md border flex items-center justify-center ${iconBgColor}`}
            >
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Metric Value */}
      <div className="mt-2.5">
        <div className="flex items-baseline space-x-1.5 flex-wrap">
          <span className={`text-xl sm:text-2xl font-bold tracking-tight data-mono ${accentColor}`}>
            {value}
          </span>
          {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
        </div>

        {/* Subtitle / Contextual Note */}
        {subtitle && (
          <p className="text-xs text-slate-600 mt-1 line-clamp-1">{subtitle}</p>
        )}

        {/* Trend Indicator */}
        {trend && (
          <div
            className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${
              trend.isWarning
                ? 'text-amber-600'
                : trend.isPositive
                ? 'text-emerald-600'
                : 'text-slate-500'
            }`}
          >
            <span>{trend.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};
