import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'red' | 'navy' | 'emerald' | 'gray';
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-[#263B86]/40 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-[#F6F7FA] border border-slate-200/60 flex items-center justify-center text-[#263B86] shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-3xl font-black text-[#15265A] tabular-nums">
          {value}
        </span>

        {badge && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              badge.variant === 'red'
                ? 'bg-red-50 text-[#D92D3A] border border-red-200/60'
                : badge.variant === 'emerald'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : badge.variant === 'navy'
                ? 'bg-blue-50 text-[#263B86] border border-blue-200/60'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-[#667085] mt-2 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};
