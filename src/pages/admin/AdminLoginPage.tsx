import React, { useState } from 'react';
import { Logo } from '../../components/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface AdminLoginPageProps {
  onLogin: (email: string) => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, onNavigateHome }) => {
  const [email, setEmail] = useState('admin@soubaicar.ma');
  const [password, setPassword] = useState('soubaicar2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#15265A] flex items-center justify-center p-4">
      {/* Background automotive subtle pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo variant="light" showTagline={true} />
          </div>
          <h1 className="text-2xl font-black text-[#15265A]">
            Portail Administration
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-medium">
            Accès sécurisé à la gestion de la flotte et des réservations
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#D92D3A] text-xs p-3 rounded-xl mb-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
              Identifiant / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#263B86] absolute top-3 start-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@soubaicar.ma"
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl py-2.5 ps-9 pe-3 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#263B86] absolute top-3 start-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl py-2.5 ps-9 pe-3 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Connexion en cours...' : 'Se connecter au tableau de bord'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 pt-6 border-t border-slate-100 bg-[#F6F7FA] -mx-8 -mb-8 sm:-mx-10 sm:-mb-10 p-5 rounded-b-3xl">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
            <span className="font-semibold text-[#15265A] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Identifiants de démonstration
            </span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
              Prêt
            </span>
          </div>
          <div className="text-[11px] text-slate-600 space-y-1 font-mono">
            <div>Email : <span className="font-bold text-[#15265A]">admin@soubaicar.ma</span></div>
            <div>Passe : <span className="font-bold text-[#15265A]">soubaicar2026</span></div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 text-center">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-bold text-[#263B86] hover:underline cursor-pointer"
            >
              ← Retour au site public SOUBAICAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
