import React, { useState } from 'react';
import { Logo } from '../../components/Logo';
import { Lock, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import { AuthService, isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setError('');
    setIsLoading(true);
    const { session, error: authError } = await AuthService.signIn(email, password);
    setIsLoading(false);

    if (authError || !session) {
      setError(authError || 'Identifiants incorrects.');
      return;
    }

    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#15265A] flex items-center justify-center p-4 relative">
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

        {!isSupabaseConfigured ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Supabase non configuré</p>
              <p>
                Renseignez <code className="font-mono">VITE_SUPABASE_URL</code> et{' '}
                <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> dans <code className="font-mono">.env.local</code>,
                puis créez un compte administrateur dans Supabase Auth pour activer la connexion.
              </p>
            </div>
          </div>
        ) : (
          <>
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
                    autoComplete="username"
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
                    autoComplete="current-password"
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl py-2.5 ps-9 pe-3 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#D92D3A] hover:bg-[#b8222e] disabled:opacity-60 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isLoading ? 'Connexion en cours...' : 'Se connecter au tableau de bord'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
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
  );
};
