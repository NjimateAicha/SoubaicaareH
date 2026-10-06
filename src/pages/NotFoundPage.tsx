import React from 'react';
import type { Language } from '../types/database';

interface NotFoundPageProps {
  currentLang: Language;
  onNavigate: (path: string) => void;
}

const COPY: Record<Language, { title: string; text: string; cta: string }> = {
  fr: { title: 'Page introuvable', text: "La page que vous recherchez n'existe pas ou a été déplacée.", cta: "Retour à l'accueil" },
  en: { title: 'Page not found', text: 'The page you are looking for does not exist or has been moved.', cta: 'Back to home' },
  ar: { title: 'الصفحة غير موجودة', text: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.', cta: 'العودة إلى الصفحة الرئيسية' },
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ currentLang, onNavigate }) => {
  const t = COPY[currentLang];
  return (
    <div className="min-h-[360px] px-4 py-16 flex items-center justify-center">
      <div className="max-w-md text-center">
        <p className="text-5xl font-extrabold text-[#15265A]">404</p>
        <h1 className="mt-3 text-xl font-bold text-[#15265A]">{t.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{t.text}</p>
        <a
          href={`/${currentLang}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(`/${currentLang}`);
          }}
          className="mt-6 inline-block rounded-xl bg-[#263B86] px-5 py-3 text-sm font-bold text-white"
        >
          {t.cta}
        </a>
      </div>
    </div>
  );
};
