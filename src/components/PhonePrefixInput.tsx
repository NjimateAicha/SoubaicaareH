import React from 'react';
import { Phone } from 'lucide-react';
import type { Language } from '../types/database';

export const DEFAULT_PHONE_PREFIX = '+212';

const PREFIX_CODES = ['+212', '+33', '+34', '+32', '+31', '+44', '+1', '+966', '+971'];

const COUNTRY_NAMES: Record<Language, Record<string, string>> = {
  fr: {
    '+212': 'Maroc', '+33': 'France', '+34': 'Espagne', '+32': 'Belgique',
    '+31': 'Pays-Bas', '+44': 'Royaume-Uni', '+1': 'USA / Canada',
    '+966': 'Arabie Saoudite', '+971': 'Émirats Arabes Unis',
  },
  en: {
    '+212': 'Morocco', '+33': 'France', '+34': 'Spain', '+32': 'Belgium',
    '+31': 'Netherlands', '+44': 'United Kingdom', '+1': 'USA / Canada',
    '+966': 'Saudi Arabia', '+971': 'United Arab Emirates',
  },
  ar: {
    '+212': 'المغرب', '+33': 'فرنسا', '+34': 'إسبانيا', '+32': 'بلجيكا',
    '+31': 'هولندا', '+44': 'المملكة المتحدة', '+1': 'الولايات المتحدة / كندا',
    '+966': 'السعودية', '+971': 'الإمارات العربية المتحدة',
  },
};

interface PhonePrefixInputProps {
  currentLang: Language;
  prefix: string;
  onPrefixChange: (value: string) => void;
  number: string;
  onNumberChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const PhonePrefixInput: React.FC<PhonePrefixInputProps> = ({
  currentLang,
  prefix,
  onPrefixChange,
  number,
  onNumberChange,
  placeholder,
  required,
}) => {
  const names = COUNTRY_NAMES[currentLang];

  return (
    <div className="flex gap-2">
      <select
        value={prefix}
        onChange={(e) => onPrefixChange(e.target.value)}
        aria-label={currentLang === 'ar' ? 'مفتاح الاتصال الدولي' : 'Indicatif téléphonique'}
        className="shrink-0 w-[92px] bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-bold text-xs sm:text-sm rounded-xl px-2 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden cursor-pointer"
      >
        {PREFIX_CODES.map((code) => (
          <option key={code} value={code}>
            {code} {names[code]}
          </option>
        ))}
      </select>
      <div className="relative flex-1 min-w-0">
        <Phone className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
        <input
          type="tel"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
        />
      </div>
    </div>
  );
};
