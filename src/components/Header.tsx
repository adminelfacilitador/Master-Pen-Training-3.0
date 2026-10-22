import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  BookOpen, 
  Sparkles, 
  Award, 
  Sliders, 
  Upload, 
  KeyRound, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  ChevronDown,
  Smartphone,
  LogOut,
  Bot,
  Compass,
  User
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { cloudState } from '../services/cloudState';
import { BRANDING } from '../assets/branding';

interface HeaderProps {
  currentUser: UserProfile | null;
  activeTab: 'ecosystem' | 'curriculum' | 'exam' | 'certificate' | 'cms';
  setActiveTab: (tab: 'ecosystem' | 'curriculum' | 'exam' | 'certificate' | 'cms') => void;
  onOpenAuthModal: () => void;
  onOpenImageModal: () => void;
  onOpenAgentModal?: () => void;
  onOpenUserProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuthModal,
  onOpenImageModal,
  onOpenAgentModal,
  onOpenUserProfile
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Real-time branding images from cloudState
  const [brandingImages, setBrandingImages] = useState(cloudState.getBrandingImages());
  const appCheck = cloudState.getAppCheckState();

  useEffect(() => {
    const unsubscribe = cloudState.subscribe(() => {
      setBrandingImages(cloudState.getBrandingImages());
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin_principal':
        return { label: 'Admin Principal', bg: 'bg-[#d4af37]/20 text-[#f5e2a3] border-[#d4af37]/50' };
      case 'admin_vip_tester':
        return { label: 'VIP Tester (Exento)', bg: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40' };
      case 'student_enrolled':
        return { label: 'Alumno Matriculado', bg: 'bg-blue-950/50 text-blue-300 border-blue-500/40' };
      case 'visitor':
        return { label: 'Visitante (Sin Matrícula)', bg: 'bg-zinc-800/80 text-zinc-400 border-zinc-600/40' };
    }
  };

  const currentBadge = currentUser ? getRoleBadge(currentUser.role) : null;
  const isAdmin = currentUser?.role === 'admin_principal' || currentUser?.role === 'admin_vip_tester';

  return (
    <header className="sticky top-0 z-40 bg-[#0d0e12]/95 backdrop-blur-md border-b border-[#c5a059]/30 shadow-2xl py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* EXCLUSIVO: Logotipo del ecosistema (exactamente 1.5 pulgadas de diámetro) y Título Grande */}
        <div className="flex items-center space-x-5 md:space-x-7">
          
          {/* Logotipo de 1.5 pulgadas (1.5in = 144px CSS standard) */}
          <div 
            onClick={() => setActiveTab('curriculum')}
            className="cursor-pointer shrink-0 transition-transform hover:scale-105"
            style={{ width: '1.5in', height: '1.5in' }}
            title="Logotipo Oficial Master Pen Training (1.5 pulgadas de diámetro)"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.45)] bg-black flex items-center justify-center p-0.5">
              <img 
                src={brandingImages.logo} 
                alt="Logotipo Master Pen Training" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Título del ecosistema con texto grande */}
          <div>
            <h1 
              onClick={() => setActiveTab('curriculum')}
              className="cursor-pointer text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-serif-gold gold-gradient-text uppercase tracking-wider select-none leading-none"
            >
              {BRANDING.name}
            </h1>
          </div>

        </div>

        {/* Acciones de Cabecera: Botón Perfil y Menú Desplegable */}
        <div className="flex items-center space-x-2.5">

          {/* Quick Profile Button */}
          {currentUser && (
            <button
              onClick={() => onOpenUserProfile?.()}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#14161f] to-[#1c1e28] hover:from-[#1c1e28] hover:to-[#262836] border border-[#c5a059]/60 hover:border-[#d4af37] px-3 py-2.5 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all text-white focus:outline-none cursor-pointer"
              title="Ver y Editar Mi Perfil Institucional & Calificaciones"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-[#d4af37] shrink-0">
                <img 
                  src={currentUser.photoUrl || brandingImages.portrait} 
                  alt={currentUser.displayName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#f5e2a3] max-w-[110px] truncate">
                {currentUser.displayName.split(' ')[0]}
              </span>
            </button>
          )}

          {/* EXCLUSIVO: Menú Desplegable a la derecha con todos los botones */}
          <div className="relative" ref={menuRef}>
            
            {/* Dropdown Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2.5 bg-gradient-to-r from-[#14161f] to-[#1c1e28] hover:from-[#1c1e28] hover:to-[#262836] border border-[#c5a059]/60 hover:border-[#d4af37] px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all text-white focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label="Abrir Menú de Opciones"
            >
              <div className="p-1 rounded-lg bg-[#d4af37]/20 text-[#d4af37]">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </div>
              
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#f5e2a3] font-serif-gold">
                  Menú Ecosistema
                </span>
                <span className="text-[10px] text-zinc-400 truncate max-w-[130px]">
                  {currentUser ? currentUser.displayName.split(' ')[0] : 'Acceso'}
                </span>
              </div>

              <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Elegant Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0f1016] border-2 border-[#c5a059]/50 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_30px_rgba(212,175,55,0.3)] p-4 z-50 animate-in fade-in slide-in-from-top-3">
                
                {/* User Session Banner inside Dropdown */}
                {currentUser ? (
                  <div className="p-3 bg-gradient-to-r from-[#171922] to-[#12131b] rounded-xl border border-zinc-800 mb-3 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d4af37]">
                        <img 
                          src={currentUser.photoUrl || brandingImages.portrait} 
                          alt={currentUser.displayName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-between text-[10px] border-t border-zinc-800/80">
                      <span className={`px-2 py-0.5 rounded border uppercase font-semibold ${currentBadge?.bg}`}>
                        {currentBadge?.label}
                      </span>
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>2FA Activo</span>
                      </span>
                    </div>

                    {/* Edit Profile Button inside Dropdown */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenUserProfile?.();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-[#d4af37]/20 to-[#c5a059]/10 hover:from-[#d4af37]/30 hover:to-[#c5a059]/20 border border-[#d4af37]/40 text-xs text-[#f5e2a3] hover:text-white transition font-medium cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Editar Mi Perfil & Calificaciones</span>
                      </span>
                      <span className="text-[10px] text-[#c5a059]">Abrir →</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-red-950/40 rounded-xl border border-red-500/40 mb-3 text-center">
                    <p className="text-xs font-semibold text-red-200">Sin sesión activa</p>
                    <p className="text-[10px] text-zinc-400">Inicie sesión para acceder a las cátedras</p>
                  </div>
                )}

              {/* SECTION 1: Navegación del Ecosistema y Academia */}
              <div className="space-y-1 pb-3 border-b border-zinc-800">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] px-2 mb-1">
                  Ecosistema & Academia
                </p>

                <button
                  onClick={() => {
                    setActiveTab('ecosystem');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    activeTab === 'ecosystem'
                      ? 'bg-[#d4af37]/20 text-[#f5e2a3] border border-[#d4af37]/50 font-bold'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#d4af37]" />
                  <span>Ecosistema Master Pen</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('curriculum');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    activeTab === 'curriculum'
                      ? 'bg-[#d4af37]/20 text-[#f5e2a3] border border-[#d4af37]/50 font-bold'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#d4af37]" />
                  <span>Academia Master Pen Training</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('exam');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    activeTab === 'exam'
                      ? 'bg-[#d4af37]/20 text-[#f5e2a3] border border-[#d4af37]/50 font-bold'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Evaluación de Certificación</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('certificate');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    activeTab === 'certificate'
                      ? 'bg-[#d4af37]/20 text-[#f5e2a3] border border-[#d4af37]/50 font-bold'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#d4af37]" />
                  <span>Certificado Oficial</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setActiveTab('cms');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      activeTab === 'cms'
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'text-[#f5e2a3] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30'
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-[#d4af37]" />
                    <span>Consola CMS Administrador</span>
                  </button>
                )}

                {/* Agente Michael Pen (Voz & IA) */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAgentModal?.();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#f5e2a3] bg-gradient-to-r from-[#d4af37]/20 via-[#c5a059]/10 to-transparent hover:from-[#d4af37]/30 border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition mt-1.5"
                >
                  <Bot className="w-4 h-4 text-[#d4af37] animate-pulse" />
                  <div className="text-left">
                    <p className="font-bold flex items-center space-x-1.5">
                      <span>Agente Mentor Michael Pen</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-[#d4af37] text-black font-extrabold rounded">IA + Voz</span>
                    </p>
                    <p className="text-[10px] text-zinc-400">Orientación en ventas, oratoria y tratados</p>
                  </div>
                </button>
              </div>

              {/* SECTION 2: Carga de Imágenes desde PC y Celular */}
              <div className="py-3 border-b border-zinc-800 space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] px-2 mb-1">
                  Gestión de Medios & Dispositivos
                </p>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenImageModal();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-[#d4af37]/15 to-transparent hover:bg-[#d4af37]/25 text-[#f5e2a3] border border-[#d4af37]/40 transition"
                >
                  <Upload className="w-4 h-4 text-[#d4af37]" />
                  <div className="text-left">
                    <p className="font-bold">Cargar / Cambiar Imágenes</p>
                    <p className="text-[10px] text-zinc-400">Desde PC, Celular o Cámara (Logo, Banner, Perfil)</p>
                  </div>
                </button>
              </div>

              {/* SECTION 3: Autenticación, Login 2FA & Roles */}
              <div className="pt-3 space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] px-2">
                  Ciberseguridad & Conmutador de Roles
                </p>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition"
                >
                  <span className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-[#d4af37]" />
                    <span>Iniciar Sesión de Administrador</span>
                  </span>
                  <span className="text-[9px] text-[#c5a059]">Acceso</span>
                </button>

                {/* Session verification info */}
                <div className="pt-2 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-800">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Conexión Verificada</span>
                  </span>
                  <span className="text-[#c5a059]">Sesión Institucional</span>
                </div>
              </div>

            </div>
          )}

          </div>

        </div>

      </div>
    </header>
  );
};
