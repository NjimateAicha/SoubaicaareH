import React from 'react';
import { Menu, Bell, ExternalLink, ShieldCheck, User } from 'lucide-react';
import type { AdminSection } from './AdminSidebar';

interface AdminHeaderProps {
  currentSection: AdminSection;
  onOpenMobileSidebar: () => void;
  onNavigatePublic: () => void;
  newReservationsCount: number;
  onSelectReservations: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentSection,
  onOpenMobileSidebar,
  onNavigatePublic,
  newReservationsCount,
  onSelectReservations,
}) => {
  const sectionTitles: Record<AdminSection, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Tableau de bord',
      subtitle: 'Indicateurs de performance, réservations récentes et statut du parc',
    },
    vehicles: {
      title: 'Gestion de la flotte',
      subtitle: 'Inventaire des véhicules, tarifs, caractéristiques et disponibilités',
    },
    reservations: {
      title: 'Demandes de réservation',
      subtitle: 'Suivi des dossiers, relances clients WhatsApp et confirmations de location',
    },
    corporateQuotes: {
      title: 'Demandes entreprises',
      subtitle: 'Devis de transport du personnel pour les entreprises à Laâyoune, Boujdour et Dakhla',
    },
    messages: {
      title: 'Messages',
      subtitle: 'Messages reçus via le formulaire de contact public',
    },
    testimonials: {
      title: 'Avis & Témoignages',
      subtitle: 'Gestion des retours d’expérience vérifiés des clients',
    },
    content: {
      title: 'Gestion du contenu',
      subtitle: 'Textes de la page d’accueil, sous-titres et traductions FR / EN / AR',
    },
    settings: {
      title: 'Paramètres généraux',
      subtitle: 'Coordonnées de l’entreprise, numéros WhatsApp et configurations',
    },
  };

  const currentInfo = sectionTitles[currentSection] || {
    title: 'Administration',
    subtitle: 'SOUBAICAR',
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 h-18 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile menu toggle + Contextual title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-[#15265A] hover:bg-slate-100 rounded-lg cursor-pointer"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#667085]">
              SOUBAICAR /
            </span>
            <h1 className="text-base sm:text-lg font-bold text-[#15265A]">
              {currentInfo.title}
            </h1>
          </div>
          <p className="hidden md:block text-[11px] text-[#667085] leading-none mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick actions & Admin profile */}
      <div className="flex items-center gap-3">
        {/* New Reservations Alert Bell */}
        <button
          onClick={onSelectReservations}
          className="relative p-2 rounded-xl text-[#15265A] hover:bg-slate-100 transition-colors cursor-pointer"
          title="Nouvelles réservations"
        >
          <Bell className="w-4 h-4" />
          {newReservationsCount > 0 && (
            <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-[#D92D3A]" />
          )}
        </button>

        {/* View public site button */}
        <button
          onClick={onNavigatePublic}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#263B86] hover:bg-blue-50/70 border border-blue-200/60 rounded-xl transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Site public</span>
        </button>

        {/* Admin User Profile */}
        <div className="flex items-center gap-2.5 ps-2 border-s border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#15265A] text-white flex items-center justify-center font-bold text-xs shrink-0">
            A
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-[#15265A] leading-none">
              Aicha N.
            </span>
            <span className="text-[10px] text-[#667085] leading-none mt-1">
              Admin SOUBAICAR
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
