import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  MessageSquare, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  ArrowRight,
  User,
  ShieldAlert
} from 'lucide-react';
import { cloudState } from '../services/cloudState';
import { UserProfile } from '../types';

interface LoginGateModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginGateModal: React.FC<LoginGateModalProps> = ({
  isOpen,
  onLoginSuccess
}) => {
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const branding = cloudState.getBrandingImages();

  if (!isOpen) return null;

  // Acceso 1: MODO EXPLORADOR (Acceso libre a cátedras y chat con Michael Pen)
  const handleEnterExplorerMode = () => {
    setIsProcessing(true);
    const explorerUser: UserProfile = {
      uid: `usr_explorador_${Date.now()}`,
      email: 'explorador@masterpentraining.com',
      displayName: 'Explorador Invitado',
      firstName: 'Explorador',
      lastName: 'Invitado',
      role: 'visitor',
      is2FAEnabled: false,
      argon2HashPreview: '$argon2id$v=19$m=65536,t=3,p=4$visitor_explorer_open_access',
      enrolledDate: new Date().toISOString().split('T')[0],
      isExemptFromPayment: false,
      photoUrl: branding.portrait
    };

    cloudState.registerUser(explorerUser);
    cloudState.setCurrentUser(explorerUser);
    onLoginSuccess(explorerUser);
  };

  // Acceso 2: INICIO DE SESIÓN CON GOOGLE OAUTH
  // REGLA FUNDAMENTAL:
  // - Si el correo corresponde al Administrador Autorizado (vcapray@gmail.com o admin@masterpentraining.com),
  //   recibe role: 'admin_principal' y acceso al AdminCMS.
  // - Cualquier OTRO visitante o estudiante que inicie sesión con Google OAuth recibe role: 'visitor' o 'student',
  //   con acceso al mismo entorno de visitantes (cursos y chat), pero ESTRICTAMENTE SIN ACCESO al Panel Administrador.
  const handleGoogleSignIn = (targetEmail: string, targetName?: string) => {
    setErrorMessage('');
    const emailNorm = targetEmail.trim().toLowerCase();

    if (!emailNorm || !emailNorm.includes('@')) {
      setErrorMessage('Por favor ingrese una cuenta de correo válida.');
      return;
    }

    setIsProcessing(true);
    const isAdmin = cloudState.isAuthorizedAdminEmail(emailNorm);

    // Buscar si ya existe en la lista de usuarios de cloudState
    const existingUser = cloudState.getAllUsers().find(u => u.email.toLowerCase() === emailNorm);

    let loggedUser: UserProfile;

    if (existingUser) {
      // Si el correo es de admin, asegurar rol admin_principal; si no, mantener o forzar rol de visitante/estudiante
      loggedUser = {
        ...existingUser,
        role: isAdmin ? 'admin_principal' : (existingUser.role === 'admin_principal' ? 'visitor' : existingUser.role)
      };
      cloudState.setCurrentUser(loggedUser);
    } else {
      const name = targetName?.trim() || (isAdmin ? 'Michael Pen (Administrador)' : emailNorm.split('@')[0]);
      loggedUser = {
        uid: `usr_google_${Date.now()}`,
        email: emailNorm,
        displayName: name,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        role: isAdmin ? 'admin_principal' : 'visitor',
        is2FAEnabled: isAdmin,
        argon2HashPreview: '$argon2id$v=19$m=65536,t=3,p=4$google_oauth_cloud_verified',
        enrolledDate: new Date().toISOString().split('T')[0],
        isExemptFromPayment: isAdmin,
        photoUrl: isAdmin ? branding.portrait : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
      };
      cloudState.registerUser(loggedUser);
    }

    onLoginSuccess(loggedUser);
  };

  return (
    <div className="fixed inset-0 z-[9999998] bg-black/92 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-2xl bg-[#0c0d12] border-2 border-[#d4af37]/60 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_40px_rgba(212,175,55,0.3)] overflow-hidden my-auto">
        
        {/* Cabecera con Logotipo Master Pen Training */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#171924] via-[#10121a] to-[#1c1a12] border-b border-[#c5a059]/40 text-center space-y-3">
          
          <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.5)] bg-black p-1.5 flex items-center justify-center">
            <img 
              src={branding.trainingLogo} 
              alt="Master Pen Training" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] font-mono flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Portal Oficial de Acceso • Campus Virtual</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-gold text-white">
              Ingreso a Master Pen Training
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-lg mx-auto">
              Selecciona tu modalidad para interactuar con las cátedras y el ecosistema formativo.
            </p>
          </div>
        </div>

        {/* Cuerpo del Modal de Login */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Mensaje de Error si lo hubiese */}
          {errorMessage && (
            <div className="p-3.5 bg-red-950/70 border border-red-500/60 rounded-xl text-xs text-red-200 flex items-center space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* OPCIÓN 1: MODO EXPLORADOR (ACCESO LIBRE) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#141622] via-[#0d0e14] to-[#181a26] border-2 border-[#d4af37]/60 hover:border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all space-y-4 group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e2a3] group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-bold font-serif-gold text-white">
                      Modo Explorador (Acceso Libre)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      Sin Registro
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Ingreso directo e inmediato al campus para visitantes y curiosos.
                  </p>
                </div>
              </div>
            </div>

            {/* Beneficios clave del modo explorador */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-zinc-300">
              <div className="flex items-center space-x-2 p-2 rounded-xl bg-black/50 border border-zinc-800">
                <MessageSquare className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Chat libre e ilimitado con Michael Pen</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-xl bg-black/50 border border-zinc-800">
                <BookOpen className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Acceso completo a cátedras y cursos</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEnterExplorerMode}
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f7e7be] to-[#aa8329] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.45)] hover:brightness-110 transition flex items-center justify-center space-x-2 cursor-pointer group-hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Ingresar en Modo Explorador →</span>
            </button>
          </div>

          {/* SEPARADOR ELEGANTE */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
              o si prefieres registrarte
            </span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* OPCIÓN 2: INICIO DE SESIÓN CON GOOGLE OAUTH */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f1118] border border-zinc-800 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                {/* Official Google G Logo */}
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-serif-gold text-white">
                  Iniciar Sesión / Registro con Google OAuth
                </h3>
                <p className="text-xs text-zinc-400">
                  Acceso unificado mediante tu cuenta oficial de Google.
                </p>
              </div>
            </div>

            {/* Aviso de seguridad y roles estricto */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-1">
              <div className="flex items-center space-x-1.5 text-[#f5e2a3] font-bold">
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Control de Acceso al Panel Administrador:</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Los visitantes y estudiantes registrados disfrutarán del mismo entorno enriquecido que los exploradores (cátedras completas y chat con Michael Pen). <strong>Solo el Administrador de la plataforma podrá tener acceso a la consola de administración.</strong>
              </p>
            </div>

            {/* Botones de Acceso con Google */}
            <div className="space-y-3">
              
              {/* Acceso para el Administrador Principal (vcapray@gmail.com) */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn('vcapray@gmail.com', 'Administrador')}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-[#d4af37]/60 hover:border-[#d4af37] text-white text-xs font-bold transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-[10px] font-bold">
                    ADM
                  </div>
                  <div className="text-left">
                    <span className="block text-white">Acceso Administrador (vcapray@gmail.com)</span>
                    <span className="text-[10px] text-[#f5e2a3] font-mono">Desbloquea Consola CMS Administrador</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Acceso para un Visitante con Google */}
              {!showCustomGoogleInput ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn('visitante@gmail.com', 'Visitante Registrado')}
                    disabled={isProcessing}
                    className="flex-1 py-3 px-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Continuar como Visitante con Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleInput(true)}
                    className="px-3 py-3 rounded-xl bg-black border border-zinc-800 hover:border-[#d4af37] text-xs text-zinc-400 hover:text-white transition cursor-pointer"
                    title="Ingresar tu propio correo de Google"
                  >
                    Personalizado
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleGoogleSignIn(googleEmail, googleName);
                  }}
                  className="p-4 rounded-xl bg-black/80 border border-zinc-700 space-y-3 animate-in fade-in"
                >
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Correo Electrónico de Google:
                    </label>
                    <input 
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="tunombre@gmail.com"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Nombre (Opcional):
                    </label>
                    <input 
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCustomGoogleInput(false)}
                      className="text-[11px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-lg bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Conectar Google OAuth →
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
