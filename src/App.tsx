/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { WelcomeCard } from './components/WelcomeCard';
import { EcosystemPortal } from './components/EcosystemPortal';
import { CurriculumViewer } from './components/CurriculumViewer';
import { ExamEngine } from './components/ExamEngine';
import { CertificateModal } from './components/CertificateModal';
import { VisitorPaywall } from './components/VisitorPaywall';
import { AuthModal } from './components/AuthModal';
import { ImageUploadModal, UploadCategory } from './components/ImageUploadModal';
import { MichaelPenAgentModal } from './components/MichaelPenAgentModal';
import { MichaelPenFloatingWidget } from './components/MichaelPenFloatingWidget';
import { UserProfileModal } from './components/UserProfileModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { cloudState, BrandingImages } from './services/cloudState';
import { SecurityShield } from './services/securityShield';
import { UserProfile } from './types';
import { BRANDING } from './assets/branding';
import { BookOpen, Sparkles, Award, Sliders, Shield, Smartphone, Upload, Bot, MessageSquare, Compass, User, RefreshCw } from 'lucide-react';

// Lazy-loaded AdminCMS to prevent main-thread execution bottleneck and black screen on load
const AdminCMS = lazy(() => import('./components/AdminCMS').then(m => ({ default: m.AdminCMS })));

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => cloudState.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'ecosystem' | 'curriculum' | 'exam' | 'certificate' | 'cms'>('ecosystem');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [selectedUploadCategory, setSelectedUploadCategory] = useState<UploadCategory>('studioCreationsLogo');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);
  const [targetExamBlockId, setTargetExamBlockId] = useState<string>('block_01');

  // Initialize Webview perimeter security shield (anti-F12, anti-inspect, anti-copy)
  useEffect(() => {
    SecurityShield.initialize();
  }, []);

  // Regla 1: Prioridad Absoluta de Firebase al iniciar la app
  useEffect(() => {
    cloudState.ensureBrandingLoaded();
  }, []);

  // Subscribe to real-time Cloud State updates
  useEffect(() => {
    const unsubscribe = cloudState.subscribe(() => {
      const user = cloudState.getCurrentUser();
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Hash-based routing to prevent black screen or frozen state on direct URL navigation / Cloudflare Pages reloads
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = (window.location.hash || '').replace('#', '').toLowerCase();
      if (['ecosystem', 'curriculum', 'exam', 'certificate', 'cms'].includes(rawHash)) {
        setActiveTab(rawHash as any);
      } else if (rawHash === 'admin') {
        setActiveTab('cms');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: 'ecosystem' | 'curriculum' | 'exam' | 'certificate' | 'cms') => {
    if (isVisitor && (tab === 'curriculum' || tab === 'exam' || tab === 'certificate')) {
      setIsOfferModalOpen(true);
      return;
    }
    setActiveTab(tab);
    try {
      if (typeof window !== 'undefined') {
        const hashTarget = tab === 'ecosystem' ? '' : tab;
        if (window.location.hash.replace('#', '') !== hashTarget) {
          window.location.hash = hashTarget;
        }
      }
    } catch (_) {}
  };

  const handleOpenExam = (blockId: string) => {
    setTargetExamBlockId(blockId);
    handleTabChange('exam');
  };

  const handleBlockPassed = (blockId: string) => {
    console.log(`[Master Pen Training] Bloque ${blockId} acreditado con 100%.`);
  };

  const handleOpenImageUpload = (category?: UploadCategory) => {
    if (category) {
      setSelectedUploadCategory(category);
    }
    setIsImageModalOpen(true);
  };

  const isVisitor = currentUser?.role === 'visitor';
  const isAdmin = currentUser?.role === 'admin_principal' || currentUser?.role === 'admin_vip_tester';

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#e6e6e8] flex flex-col font-sans selection:bg-[#c5a059]/30 selection:text-[#f5e2a3]">
      
      {/* Top Navigation: Exclusively 1.5in logo, Big Title, and Dropdown on the right */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenImageModal={() => handleOpenImageUpload('logo')}
        onOpenAgentModal={() => setIsAgentModalOpen(true)}
        onOpenUserProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Container protected with Root ErrorBoundary */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
        <ErrorBoundary fallbackTitle="Ecosistema Master Pen">
          
          {/* Module 1 & 4 Access Control: If Visitor attempts direct access to curriculum/exam/certificate */}
          {isVisitor && (activeTab === 'curriculum' || activeTab === 'exam' || activeTab === 'certificate') ? (
            <VisitorPaywall
              onEnrollSuccess={() => {
                handleTabChange('curriculum');
              }}
              onLoginAsVipTester={() => {
                cloudState.switchUserByRole('admin_vip_tester');
                handleTabChange('curriculum');
              }}
              onClose={() => handleTabChange('ecosystem')}
            />
          ) : (
            <div className="space-y-8">
              
              {/* TAB VIEWS */}
              {/* 1. MAIN HOMEPAGE: Call To Action and Friend Buttons */}
              {activeTab === 'ecosystem' && (
                <EcosystemPortal
                  onNavigateToAcademy={() => {
                    if (isVisitor) {
                      setIsOfferModalOpen(true);
                    } else {
                      handleTabChange('curriculum');
                    }
                  }}
                  isAdmin={isAdmin}
                  onOpenImageModal={handleOpenImageUpload}
                />
              )}

              {/* 2. ACADEMY PAGE: Curriculum & Slides */}
              {activeTab === 'curriculum' && (
                <div className="space-y-8">
                  <CurriculumViewer
                    currentUser={currentUser}
                    onOpenExam={handleOpenExam}
                    onBackToEcosystem={() => handleTabChange('ecosystem')}
                    onOpenImageModal={handleOpenImageUpload}
                    onOpenAgentModal={() => setIsAgentModalOpen(true)}
                  />
                </div>
              )}

              {activeTab === 'exam' && (
                <ExamEngine
                  currentUser={currentUser}
                  defaultBlockId={targetExamBlockId}
                  onBlockPassed={handleBlockPassed}
                  onGoToCertificate={() => handleTabChange('certificate')}
                />
              )}

              {activeTab === 'certificate' && (
                <CertificateModal
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'cms' && isAdmin && (
                <ErrorBoundary fallbackTitle="Panel de Administración Master Pen">
                  <Suspense fallback={
                    <div className="min-h-[420px] flex flex-col items-center justify-center p-8 bg-[#0e1017] border-2 border-[#d4af37]/40 rounded-3xl text-center space-y-4 my-8 max-w-xl mx-auto shadow-2xl animate-pulse">
                      <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
                      <h3 className="text-lg font-bold font-serif-gold text-white">Inicializando Consola de Administración...</h3>
                      <p className="text-xs text-zinc-400">Verificando credenciales autorizadas y cargando módulos curriculares.</p>
                    </div>
                  }>
                    <AdminCMS />
                  </Suspense>
                </ErrorBoundary>
              )}

              {activeTab === 'cms' && !isAdmin && (
                <div className="p-8 rounded-3xl bg-[#0e1017] border-2 border-[#d4af37]/40 text-center space-y-5 max-w-lg mx-auto shadow-2xl my-8 animate-in fade-in">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#d4af37]/15 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                    <Sliders className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif-gold text-white">Acceso a Consola de Administración</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
                      Por favor, inicie sesión con sus credenciales autorizadas de Administrador para gestionar el ecosistema y las cátedras.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#8a6c25] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
                    >
                      Iniciar Sesión de Administrador
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        cloudState.switchUserByRole('admin_principal');
                        setCurrentUser(cloudState.getCurrentUser());
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[#f5e2a3] font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Acceso Rápido (Michael Pen)
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </ErrorBoundary>
      </main>

      {/* APK & Mobile Floating Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0e14]/95 backdrop-blur-lg border-t border-[#c5a059]/30 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => handleTabChange('ecosystem')}
          className={`flex flex-col items-center text-[10px] uppercase font-semibold tracking-wider transition ${
            activeTab === 'ecosystem' ? 'text-[#d4af37]' : 'text-zinc-500'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Ecosistema</span>
        </button>

        <button
          onClick={() => {
            if (isVisitor) {
              setIsOfferModalOpen(true);
            } else {
              handleTabChange('curriculum');
            }
          }}
          className={`flex flex-col items-center text-[10px] uppercase font-semibold tracking-wider transition ${
            activeTab === 'curriculum' ? 'text-[#d4af37]' : 'text-zinc-500'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Academia</span>
        </button>

        <button
          onClick={() => {
            if (isVisitor) {
              setIsOfferModalOpen(true);
            } else {
              handleTabChange('exam');
            }
          }}
          className={`flex flex-col items-center text-[10px] uppercase font-semibold tracking-wider transition ${
            activeTab === 'exam' ? 'text-[#d4af37]' : 'text-zinc-500'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Exámenes</span>
        </button>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex flex-col items-center text-[10px] uppercase font-semibold tracking-wider text-[#f5e2a3] hover:text-[#d4af37] transition"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Mi Perfil</span>
        </button>

        <button
          onClick={() => {
            if (isVisitor) {
              setIsOfferModalOpen(true);
            } else {
              handleTabChange('certificate');
            }
          }}
          className={`flex flex-col items-center text-[10px] uppercase font-semibold tracking-wider transition ${
            activeTab === 'certificate' ? 'text-[#d4af37]' : 'text-zinc-500'
          }`}
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span>Título</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => handleTabChange('cms')}
            className={`flex flex-col items-center text-[10px] uppercase font-semibold tracking-wider transition ${
              activeTab === 'cms' ? 'text-[#d4af37]' : 'text-zinc-500'
            }`}
          >
            <Sliders className="w-5 h-5 mb-0.5" />
            <span>Admin</span>
          </button>
        )}
      </div>

      {/* Ventana Modal de Oferta de Acceso a la Academia (Suscripción $5.99 / $2.99 Inicial) */}
      <VisitorPaywall
        isModal={true}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onEnrollSuccess={() => {
          setIsOfferModalOpen(false);
          handleTabChange('curriculum');
        }}
        onLoginAsVipTester={() => {
          setIsOfferModalOpen(false);
          cloudState.switchUserByRole('admin_vip_tester');
          handleTabChange('curriculum');
        }}
      />

      {/* Modal de Perfil de Usuario, Cédula Confidencial & Expediente de Calificaciones */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onGoToExam={(blockId) => {
          setIsProfileModalOpen(false);
          if (isVisitor) {
            setIsOfferModalOpen(true);
          } else if (blockId) {
            handleOpenExam(blockId);
          } else {
            handleTabChange('exam');
          }
        }}
        onGoToCertificate={() => {
          setIsProfileModalOpen(false);
          if (isVisitor) {
            setIsOfferModalOpen(true);
          } else {
            handleTabChange('certificate');
          }
        }}
      />

      {/* Enterprise Authentication & 2FA Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin_principal' || user.role === 'admin_vip_tester') {
            handleTabChange('cms');
          }
        }}
      />

      {/* Direct PC & Mobile Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        defaultTarget={selectedUploadCategory}
        onClose={() => setIsImageModalOpen(false)}
      />

      {/* Michael Pen AI & Voice Host Agent Modal */}
      <MichaelPenAgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />

      {/* Official Universal Agent Michael Pen Floating Widget (Manga Creator, Training & Ecosystem) */}
      <MichaelPenFloatingWidget ecosystemId="training" />

      {/* Footer */}
      <footer className="border-t border-[#c5a059]/20 bg-[#08090b] py-6 px-4 text-center text-xs text-zinc-500 space-y-2">
        <p className="font-serif-gold tracking-widest text-zinc-400">
          MASTER PEN TRAINING • PLATAFORMA DE ALTA RETÓRICA Y MAESTRÍA INTELECTUAL
        </p>
        <p className="text-[11px] text-zinc-600 flex items-center justify-center space-x-2">
          <span>© 2026 Michael Pen. Todos los derechos reservados.</span>
          <span>•</span>
          <span className="text-[#c5a059]">Master Pen Studio Creations</span>
          <span>•</span>
          <span className="text-emerald-500/80">Sesión Institucional</span>
        </p>
      </footer>

    </div>
  );
}
