import React, { useMemo } from 'react';
import { Phone } from 'lucide-react';
import type { Language } from '../types/database';
import {
  DEFAULT_COUNTRY_ISO2,
  getCountryByIso2,
  getCountryName,
  getSortedCountryPrefixes,
} from '../lib/countryPhonePrefixes';

export { DEFAULT_COUNTRY_ISO2 };

// Combines the selected country's dial code with the locally-entered number,
// e.g. getDialCode('MA') + ' ' + '612345678' -> '+212 612345678'.
export function getDialCode(iso2: string): string {
  return getCountryByIso2(iso2)?.code || '';
}

interface PhonePrefixInputProps {
  currentLang: Language;
  countryIso2: string;
  onCountryChange: (iso2: string) => void;
  number: string;
  onNumberChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const PhonePrefixInput: React.FC<PhonePrefixInputProps> = ({
  currentLang,
  countryIso2,
  onCountryChange,
  number,
  onNumberChange,
  placeholder,
  required,
}) => {
  const sortedCountries = useMemo(() => getSortedCountryPrefixes(currentLang), [currentLang]);

  return (
    <div className="flex gap-2">
      <select
        value={countryIso2}
        onChange={(e) => onCountryChange(e.target.value)}
        aria-label={currentLang === 'ar' ? 'مفتاح الاتصال الدولي' : 'Indicatif téléphonique'}
        className="shrink-0 w-[128px] sm:w-[168px] bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-bold text-xs sm:text-sm rounded-xl px-2 py-2.5 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden cursor-pointer truncate"
      >
        {sortedCountries.map((country) => (
          <option key={country.iso2} value={country.iso2}>
            {country.code} {getCountryName(country, currentLang)}
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
