import React from 'react';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  MapPin,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  X,
  Building2,
  Mail,
} from 'lucide-react';
import { Logo } from '../Logo';

export type AdminSection =
  | 'dashboard'
  | 'vehicles'
  | 'reservations'
  | 'corporateQuotes'
  | 'messages'
  | 'testimonials'
  | 'content'
  | 'settings';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  newReservationsCount: number;
  newCorporateQuotesCount: number;
  newMessagesCount: number;
  totalVehiclesCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onNavigatePublic: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  newReservationsCount,
  newCorporateQuotesCount,
  newMessagesCount,
  totalVehiclesCount,
  isOpenMobile,
  onCloseMobile,
  onNavigatePublic,
  onLogout,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as AdminSection,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'vehicles' as AdminSection,
      label: 'Véhicules',
      icon: Car,
      counter: totalVehiclesCount,
    },
    {
      id: 'reservations' as AdminSection,
      label: 'Réservations',
      icon: CalendarCheck,
      badge: newReservationsCount > 0 ? `${newReservationsCount}` : undefined,
    },
    {
      id: 'corporateQuotes' as AdminSection,
      label: 'Demandes entreprises',
      icon: Building2,
      badge: newCorporateQuotesCount > 0 ? `${newCorporateQuotesCount}` : undefined,
    },
    {
      id: 'messages' as AdminSection,
      label: 'Messages',
      icon: Mail,
      badge: newMessagesCount > 0 ? `${newMessagesCount}` : undefined,
    },
    {
      id: 'testimonials' as AdminSection,
      label: 'Avis clients',
      icon: MessageSquare,
    },
    {
      id: 'content' as AdminSection,
      label: 'Contenu',
      icon: FileText,
    },
    {
      id: 'settings' as AdminSection,
      label: 'Paramètres',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 start-0 z-50 w-64 bg-[#15265A] text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <Logo variant="dark" showTagline={true} />
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                  Administration SaaS
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            {menuItems.map((item) => {
              const active = currentSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    active
                      ? 'bg-[#D92D3A] text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] bg-white text-[#D92D3A] font-black px-1.5 py-0.2 rounded-full tabular-nums shadow-xs">
                      {item.badge}
                    </span>
                  )}

                  {item.counter !== undefined && !item.badge && (
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {item.counter}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onNavigatePublic}
            className="w-full py-2.5 px-3 text-xs text-slate-300 hover:text-white flex items-center gap-2 rounded-xl hover:bg-white/10 transition-colors font-medium cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-[#D92D3A]" />
            <span>Voir le site public</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 text-xs text-[#D92D3A] hover:text-red-400 flex items-center gap-2 rounded-xl hover:bg-white/10 transition-colors font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};
