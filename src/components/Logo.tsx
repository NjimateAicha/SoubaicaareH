import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'light', className = '', showTagline = false }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SOUBAICAR / LVS Brand Emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#263B86] shadow-sm border border-white/15 overflow-hidden shrink-0">
        {/* Dynamic automotive red accent line */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#D92D3A] rounded-bl-lg" />
        <div className="flex flex-col items-center justify-center font-bold leading-none tracking-tighter">
          <span className="text-[11px] font-black text-white">LVS</span>
          <span className="text-[8px] font-semibold text-[#D92D3A] tracking-wider">CAR</span>
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#15265A]'}`}>
            SOUBAI
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#D92D3A]">
            CAR
          </span>
        </div>
        {showTagline && (
          <span className={`text-[9px] uppercase tracking-widest font-semibold ${isDark ? 'text-slate-300' : 'text-[#667085]'}`}>
            Laâyoune · Boujdour · Dakhla
          </span>
        )}
      </div>
    </div>
  );
};
