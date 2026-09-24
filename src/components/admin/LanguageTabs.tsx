import React from 'react';
import type { Language } from '../../types/database';

interface LanguageTabsProps {
  activeLang: Language;
  onChange: (lang: Language) => void;
  className?: string;
}

export const LanguageTabs: React.FC<LanguageTabsProps> = ({
  activeLang,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 p-1 bg-[#F6F7FA] border border-slate-200 rounded-xl inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => onChange('fr')}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          activeLang === 'fr'
            ? 'bg-white text-[#15265A] shadow-xs border border-slate-200/80'
            : 'text-[#667085] hover:text-[#15265A]'
        }`}
      >
        Français (FR)
      </button>

      <button
        type="button"
        onClick={() => onChange('en')}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          activeLang === 'en'
            ? 'bg-white text-[#15265A] shadow-xs border border-slate-200/80'
            : 'text-[#667085] hover:text-[#15265A]'
        }`}
      >
        English (EN)
      </button>

      <button
        type="button"
        onClick={() => onChange('ar')}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
          activeLang === 'ar'
            ? 'bg-white text-[#15265A] shadow-xs border border-slate-200/80'
            : 'text-[#667085] hover:text-[#15265A]'
        }`}
      >
        <span className="font-semibold">العربية (AR)</span>
        <span className="text-[10px] text-[#263B86] bg-blue-50 px-1 py-0.2 rounded font-mono">RTL</span>
      </button>
    </div>
  );
};
