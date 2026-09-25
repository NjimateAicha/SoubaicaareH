import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MessageCircle, MapPin, ShieldCheck, Linkedin, Facebook } from 'lucide-react';
import type { Language, LocationItem } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink, getStaffTransportPath } from '../lib/translations';

interface FooterProps {
  currentLang: Language;
  onNavigate: (path: string) => void;
  onLanguageChange: (lang: Language) => void;
  locations: LocationItem[];
  phone: string;
  email: string;
  whatsapp: string;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate,
  onLanguageChange,
  locations,
  phone,
  email,
  whatsapp,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';
  const whatsappHref = buildWhatsAppLink(whatsapp, '', '', '', '', currentLang);

  return (
    <footer className="bg-[#15265A] text-white pt-16 pb-8 border-t-4 border-[#D92D3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Presentation */}
          <div className="flex flex-col gap-4">
            <Logo variant="dark" showTagline={true} />
            <p className="text-slate-300 text-sm leading-relaxed mt-2">
              {t.footer.aboutBrand}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#D92D3A]" />
              <span>{isRtl ? 'خدمة معتمدة وضمانات رسمية' : 'Service certifié & Flotte contrôlée'}</span>
            </div>
          </div>

          {/* Column 2: Quick Links & Navigation */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-4 border-b border-white/10 pb-2 inline-block">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate(`/${currentLang}`)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(`/${currentLang}/vehicules`)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.vehicles}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(getStaffTransportPath(currentLang))}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.staffTransport}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(`/${currentLang}/a-propos`)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(`/${currentLang}/contact`)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(`/${currentLang}/mentions-legales`)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.footer.legalNotice}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: SOUBAICAR Agencies */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-4 border-b border-white/10 pb-2 inline-block">
              {t.footer.ourAgencies}
            </h4>
            <div className="space-y-4 text-xs text-slate-300">
              {locations.map((loc) => (
                <div key={loc.id} className="group">
                  <button
                    onClick={() => onNavigate(`/${currentLang}/agences/${loc.slug}`)}
                    className="flex items-start gap-2 text-start font-semibold text-white group-hover:text-[#D92D3A] transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#D92D3A] shrink-0 mt-0.5" />
                    <span>Agence SOUBAICAR {loc.name}</span>
                  </button>
                  <p className="text-[11px] text-slate-400 ms-5 mt-0.5 line-clamp-1">{loc.address}</p>
                </div>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate(`/${currentLang}/location-voiture-dakhla`)}
                  className="text-[11px] text-slate-400 hover:text-white underline block"
                >
                  {isRtl ? 'كراء السيارات في الداخلة (المطار والمدينة)' : 'Location voiture Dakhla (Aéroport & Ville)'}
                </button>
                <button
                  onClick={() => onNavigate(`/${currentLang}/location-voiture-laayoune`)}
                  className="text-[11px] text-slate-400 hover:text-white underline block mt-1"
                >
                  {isRtl ? 'كراء السيارات في العيون (المطار والمدينة)' : 'Location voiture Laâyoune (Aéroport Hassan 1er)'}
                </button>
                <button
                  onClick={() => onNavigate(`/${currentLang}/location-voiture-boujdour`)}
                  className="text-[11px] text-slate-400 hover:text-white underline block mt-1"
                >
                  {isRtl ? 'كراء السيارات في بوجدور' : 'Location voiture Boujdour (Centre & Côte)'}
                </button>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Direct Assistance */}
          <div className="min-w-0">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-4 border-b border-white/10 pb-2 inline-block">
              {isRtl ? 'تواصل وحجز مباشر' : 'Contact & Réservations'}
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-[#D92D3A]" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{t.footer.phone}</span>
                  <span className="font-semibold tabular-nums">{phone}</span>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-white transition-colors min-w-0"
              >
                <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-[#D92D3A]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-400 block">{t.footer.email}</span>
                  <span className="font-semibold break-all">{email}</span>
                </div>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#25D366] text-white hover:bg-emerald-600 transition-colors font-bold text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isRtl ? 'محادثة واتساب مباشرة' : 'Assistance WhatsApp 24/7'}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="text-slate-400">{isRtl ? 'تابعونا' : currentLang === 'fr' ? 'Suivez-nous' : 'Follow us'}</span>
              <a
                href="https://www.linkedin.com/company/location-de-voitures-soubai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.facebook.com/SOUBAICAR/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
            </div>
            <a
              href="https://aichanjimate.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              {isRtl ? 'تم التطوير بواسطة Aicha Njimate' : currentLang === 'fr' ? 'Développé par Aicha Njimate' : 'Developed by Aicha Njimate'}
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 border-t border-white/10 pt-5">
            <p>© {new Date().getFullYear()} {t.footer.rights}</p>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">{isRtl ? 'اللغة:' : 'Langue :'}</span>
              <button
                onClick={() => onLanguageChange('fr')}
                className={`hover:text-white transition-colors ${currentLang === 'fr' ? 'text-white font-bold underline' : ''}`}
              >
                Français
              </button>
              <span>·</span>
              <button
                onClick={() => onLanguageChange('en')}
                className={`hover:text-white transition-colors ${currentLang === 'en' ? 'text-white font-bold underline' : ''}`}
              >
                English
              </button>
              <span>·</span>
              <button
                onClick={() => onLanguageChange('ar')}
                className={`hover:text-white transition-colors ${currentLang === 'ar' ? 'text-white font-bold underline' : ''}`}
              >
                العربية
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
