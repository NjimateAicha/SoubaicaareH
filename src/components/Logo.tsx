import React from 'react';
import logoUrl from '../public/logo.png';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'light', className = '', showTagline = false }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`flex items-center justify-center w-12 h-12 shrink-0 ${isDark ? 'rounded-lg bg-white p-1' : ''}`}>
        <img
          src={logoUrl}
          alt="LVS"
          width={512}
          height={512}
          className="block w-full h-full object-contain"
        />
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
