import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  FileText, 
  Subtitles, 
  Clock, 
  Lock, 
  CheckCircle, 
  CheckCircle2,
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Headphones, 
  FileCheck,
  Video,
  Presentation,
  FileDown,
  ExternalLink,
  Layers,
  Award,
  Share2,
  Maximize2,
  Compass,
  GraduationCap
} from 'lucide-react';
import { AcademicBlock, MediaResource, UserProfile } from '../types';
import { cloudState, BrandingImages } from '../services/cloudState';
import { SecurityShield } from '../services/securityShield';
import { BRANDING } from '../assets/branding';
import { parseMediaUrl } from '../services/mediaParser';
import { Camera, Film } from 'lucide-react';
import { CourseSlideViewer } from './CourseSlideViewer';
import { EscrituraCreativaViewer } from './EscrituraCreativaViewer';

interface CurriculumViewerProps {
  currentUser: UserProfile | null;
  onOpenExam: (blockId: string) => void;
  onBackToEcosystem?: () => void;
  onOpenImageModal?: (category?: keyof BrandingImages) => void;
  onOpenAgentModal?: () => void;
}

export const CurriculumViewer: React.FC<CurriculumViewerProps> = ({
  currentUser,
  onOpenExam,
  onBackToEcosystem,
  onOpenImageModal,
  onOpenAgentModal
}) => {
  const [branding, setBranding] = useState<BrandingImages>(cloudState.getBrandingImages());
  const [blocks, setBlocks] = useState<AcademicBlock[]>(cloudState.getBlocks());
  const [selectedBlockId, setSelectedBlockId] = useState<string>('intro');
  const [selectedCourse, setSelectedCourse] = useState<'quiero_ser_escritor' | 'escritura_creativa'>('quiero_ser_escritor');
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState<boolean>(false);
  const [learningMode, setLearningMode] = useState<'slides' | 'player'>('slides');
  const [activeResourceId, setActiveResourceId] = useState<string>('res_intro_00');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [transcriptSearch, setTranscriptSearch] = useState<string>('');
  const [tokenTimeRemaining, setTokenTimeRemaining] = useState<string>('14:59');
  const [activeTabUnderVideo, setActiveTabUnderVideo] = useState<'notes' | 'transcript' | 'resources' | 'exam'>('notes');
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({
    intro: true,
    block_01: true,
    block_02: false,
    block_03: false
  });

  const isAdmin = currentUser?.role === 'admin_principal' || currentUser?.role === 'admin_vip_tester';

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setBranding(cloudState.getBrandingImages());
      setBlocks(cloudState.getBlocks());
    });
    return () => unsub();
  }, []);
  
  // Track completed lessons in cloud state / memory
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['res_intro_00']);

  const videoRef = useRef<HTMLVideoElement>(null);
  const introResource = cloudState.getIntroResource();

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setBlocks(cloudState.getBlocks());
    });
    return () => unsub();
  }, []);

  // Find active resource and block
  let activeResource: MediaResource = introResource;
  let currentBlockObj: AcademicBlock | undefined = undefined;

  if (selectedBlockId === 'intro') {
    activeResource = introResource;
  } else {
    currentBlockObj = blocks.find(b => b.id === selectedBlockId);
    if (currentBlockObj && currentBlockObj.resources.length > 0) {
      activeResource = currentBlockObj.resources.find(r => r.id === activeResourceId) || currentBlockObj.resources[0];
    }
  }

  // Parse media URL for Webview streaming (YouTube, Cloudflare, Google Storage, Vimeo, etc.)
  const mediaInfo = parseMediaUrl(activeResource.storageUrl, activeResource.type);

  // Token countdown timer (15 minutes security rule)
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenTimeRemaining(SecurityShield.formatTimeRemaining(activeResource.signedTokenExpiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeResource]);

  const handleRefreshSignedToken = () => {
    cloudState.refreshSignedToken(activeResource.id);
  };

  const toggleBlockExpanded = (blockId: string) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const handleSelectLesson = (blockId: string, resource: MediaResource) => {
    setSelectedBlockId(blockId);
    setActiveResourceId(resource.id);
    setIsPlaying(true);
  };

  const toggleLessonCompleted = (resId: string) => {
    setCompletedLessonIds(prev => 
      prev.includes(resId) ? prev.filter(id => id !== resId) : [...prev, resId]
    );
  };

  // Find flattened list of all lessons for Prev / Next navigation
  const allLessons: { blockId: string; blockTitle: string; resource: MediaResource }[] = [
    { blockId: 'intro', blockTitle: 'Cátedra Cero', resource: introResource }
  ];
  blocks.forEach(b => {
    b.resources.forEach(r => {
      allLessons.push({ blockId: b.id, blockTitle: b.title, resource: r });
    });
  });

  const currentIndex = allLessons.findIndex(item => item.resource.id === activeResource.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCurrentBlockPassed = currentUser && selectedBlockId !== 'intro'
    ? cloudState.isBlockPassedByUser(currentUser.uid, selectedBlockId)
    : false;

  const isLocked = currentBlockObj ? currentBlockObj.isLockedForStudent : false;
  const isVisitor = currentUser?.role === 'visitor';
  const isBlockedByPaywall = isVisitor && !activeResource.previewFree;

  // Calculate total course completion %
  const totalLessonsCount = allLessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessonsCount) * 100));

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'youtube':
        return { label: 'YouTube Webview', color: 'text-red-400 bg-red-950/60 border-red-500/40' };
      case 'cloudflare':
        return { label: 'Cloudflare Stream', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' };
      case 'vimeo':
        return { label: 'Vimeo CDN', color: 'text-sky-400 bg-sky-950/60 border-sky-500/40' };
      case 'slides':
        return { label: 'Diapositivas Webview', color: 'text-yellow-400 bg-yellow-950/60 border-yellow-500/40' };
      case 'pdf':
        return { label: 'Documento PDF', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' };
      case 'audio':
        return { label: 'Audio Master', color: 'text-purple-400 bg-purple-950/60 border-purple-500/40' };
      default:
        return { label: 'Google Cloud Storage', color: 'text-blue-400 bg-blue-950/60 border-blue-500/40' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* ENTORNO SUPERIOR DE LA ACADEMIA: LOGOTIPO SOBRESALIENTE MASTER PEN TRAINING */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171926] via-[#10121b] to-[#151724] border-2 border-[#d4af37]/50 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          
          {/* Prominent Master Pen Training Logo (Editable by Admin from PC or Mobile) */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-3xl overflow-hidden border-3 border-[#d4af37] shadow-[0_0_35px_rgba(212,175,55,0.45)] bg-black flex items-center justify-center p-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_45px_rgba(212,175,55,0.6)]">
              <img
                src={branding.trainingLogo}
                alt="Master Pen Training"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => onOpenImageModal?.('trainingLogo')}
                className="absolute -bottom-1 -right-1 p-2.5 rounded-full bg-black/95 hover:bg-[#d4af37] text-[#f5e2a3] hover:text-black border-2 border-[#d4af37] transition shadow-2xl cursor-pointer"
                title="Reemplazar logotipo de Master Pen Training (PC o Celular)"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e2a3] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Campus Virtual Oficial • División Formativa</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif-gold text-white tracking-wide">
              Academia Digital Master Pen Training
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl leading-relaxed">
              Cátedras magistrales, formación curricular avanzada y certificación de honor.
            </p>
          </div>
        </div>

        {/* Back to Ecosystem Button */}
        {onBackToEcosystem && (
          <button
            type="button"
            onClick={onBackToEcosystem}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-[#f5e2a3] border border-[#c5a059]/40 hover:border-[#d4af37] text-xs font-semibold transition flex items-center space-x-2 shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#d4af37]" />
            <span>Volver al Ecosistema</span>
          </button>
        )}
      </div>

      {/* Sistema de Menú de Navegación "EXPLORAR CURSOS" (Evita abultar la pantalla y escala dinámicamente) */}
      <div className="relative">
        <div className="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-[#11131c] via-[#0d0e14] to-[#141620] border-2 border-[#c5a059]/40 rounded-2xl shadow-xl">
          {/* Botón Principal EXPLORAR CURSOS */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsExploreMenuOpen(prev => !prev)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f7e7be] to-[#aa8329] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 transition cursor-pointer"
              title="Abrir menú de Cátedras y Formaciones"
            >
              <Compass className="w-4 h-4 text-black animate-spin-slow" />
              <span>EXPLORAR CURSOS</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/80 text-[#f5e2a3] text-[10px] font-bold">
                2 Cursos
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-black transition-transform duration-200 ${isExploreMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Identificador elegante del Curso Activo */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-[#c5a059]/30 text-xs">
              <span className="text-[#c5a059] font-mono uppercase text-[10px] tracking-wider">Cátedra Activa:</span>
              <span className="font-bold text-[#f5e2a3] truncate max-w-[220px] sm:max-w-[360px]">
                {selectedCourse === 'escritura_creativa' 
                  ? 'Escritura Creativa - Por: Anthony Small' 
                  : 'Quiero ser Escritor - Por: Michael Pen'}
              </span>
            </div>
          </div>

          {/* Botón rápido para alternar o desplegar catálogo */}
          <button
            type="button"
            onClick={() => setIsExploreMenuOpen(prev => !prev)}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-[#f5e2a3] border border-[#c5a059]/40 hover:border-[#d4af37] text-xs font-semibold transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isExploreMenuOpen ? 'Ocultar Menú' : 'Ver Todas las Cátedras'}</span>
          </button>
        </div>

        {/* Panel Desplegable "EXPLORAR CURSOS" para incorporar nuevos cursos sin abultar */}
        {isExploreMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-30 mt-2 p-5 bg-[#0d0e14] border-2 border-[#d4af37]/60 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(212,175,55,0.25)] animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-sm font-extrabold uppercase tracking-widest font-serif-gold text-white">
                  Menú Oficial: Explorar Cursos Master Pen
                </h3>
              </div>
              <button 
                onClick={() => setIsExploreMenuOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Curso 1: Quiero ser Escritor */}
              <div 
                onClick={() => { setSelectedCourse('quiero_ser_escritor'); setIsExploreMenuOpen(false); }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedCourse === 'quiero_ser_escritor'
                    ? 'bg-[#181a24] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#d4af37]'
                    : 'bg-[#12131b] border-zinc-800 hover:border-[#c5a059]/60 hover:bg-[#151722]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f5e2a3] border border-[#d4af37]/40">
                      Cátedra Rectoral
                    </span>
                    {selectedCourse === 'quiero_ser_escritor' ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> En pantalla
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500">
                        Disponible
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white font-serif-gold">
                    Quiero ser Escritor - Por: Michael Pen
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Maestría literaria, oratoria, estructuración de manuscritos y axiomas de estilo guiados por el anfitrión institucional.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500 font-mono">
                  <span>5 Módulos • 50 Lecciones</span>
                  <span className="text-[#d4af37] font-semibold flex items-center gap-1">
                    {selectedCourse === 'quiero_ser_escritor' ? 'Cátedra Activa' : 'Acceder →'}
                  </span>
                </div>
              </div>

              {/* Curso 2: Escritura Creativa */}
              <div 
                onClick={() => { setSelectedCourse('escritura_creativa'); setIsExploreMenuOpen(false); }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedCourse === 'escritura_creativa'
                    ? 'bg-[#181a24] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#d4af37]'
                    : 'bg-[#12131b] border-zinc-800 hover:border-[#c5a059]/60 hover:bg-[#151722]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Especialización
                    </span>
                    {selectedCourse === 'escritura_creativa' ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> En pantalla
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500">
                        Disponible
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white font-serif-gold">
                    Escritura Creativa - Por: Anthony Small
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Captura de disparadores, principio de fricción cero y registro de cuatro campos bajo evaluación psicométrica estratificada.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500 font-mono">
                  <span>Módulo 1 • 5 Clases HD + Evaluación</span>
                  <span className="text-[#d4af37] font-semibold flex items-center gap-1">
                    {selectedCourse === 'escritura_creativa' ? 'Cátedra Activa' : 'Acceder →'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Safe Injections (MÓDULO 4: Autoadministrable desde Cloud) */}
      {cloudState.getSafeInjections().filter(inj => inj.isActive && inj.placement === 'curriculum_banner').map(inj => (
        <div 
          key={inj.id} 
          className="rounded-2xl overflow-hidden animate-in fade-in"
          dangerouslySetInnerHTML={{ __html: inj.htmlContent }}
        />
      ))}

      {selectedCourse === 'escritura_creativa' ? (
        <EscrituraCreativaViewer
          currentUser={currentUser}
          onBackToCourses={() => setSelectedCourse('quiero_ser_escritor')}
        />
      ) : (
        <>
      {/* Top Banner: Course Title & Overall Progress (Udemy Style) */}
      <div className="bg-gradient-to-r from-[#14161f] via-[#101117] to-[#161822] border border-[#c5a059]/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Curso Oficial: Quiero ser Escritor</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-gold text-white mt-1">
            {learningMode === 'slides' ? 'Quiero ser Escritor: 5 Bloques & 50 Diapositivas' : (selectedBlockId === 'intro' ? 'Lección Cero: Manifiesto' : (currentBlockObj?.title || 'Cátedra'))}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Formación integral en escritura, estructura de libros, géneros, proceso artesanal y autopublicación.
          </p>
        </div>

        {/* View Mode Toggle & Progress */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <div className="flex items-center space-x-1 p-1 bg-black/80 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setLearningMode('slides')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                learningMode === 'slides'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Diapositivas y Fotovideo (Voz Humana)</span>
            </button>
            <button
              type="button"
              onClick={() => setLearningMode('player')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                learningMode === 'player'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Reproductor Multimedia</span>
            </button>
          </div>

          {/* Course Progress Widget */}
          <div className="bg-black/60 border border-zinc-800 rounded-xl p-3 sm:min-w-[180px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400">Progreso:</span>
              <span className="text-[#f5e2a3] font-bold font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#c5a059] to-[#d4af37] h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
              <span>{completedCount} de {totalLessonsCount} clases</span>
            </div>
          </div>
        </div>
      </div>

      {learningMode === 'slides' ? (
        <CourseSlideViewer
          currentBlockId={selectedBlockId === 'intro' ? 'block_01' : selectedBlockId}
          onBlockChange={(blockId) => setSelectedBlockId(blockId)}
          onTakeExam={(blockId) => onOpenExam(blockId)}
          isAdmin={isAdmin}
          onBackToWelcome={onBackToEcosystem}
        />
      ) : (
        /* Main Grid: Player on Left (8 cols) and Udemy Curriculum Sidebar on Right (4 cols) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: WEBVIEW MEDIA PLAYER & LESSON TABS (8 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Webview Player Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#101117] border border-zinc-800 rounded-xl text-xs">
            <div className="flex items-center space-x-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">Reproductor Oficial</span>
              <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-semibold ${getProviderBadge(mediaInfo.provider).color}`}>
                {getProviderBadge(mediaInfo.provider).label}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="text-[11px]">Sesión Activa:</span>
              <span className="font-mono text-[#f5e2a3] font-bold text-xs">{tokenTimeRemaining}</span>
              <button
                onClick={handleRefreshSignedToken}
                title="Sincronizar sesión"
                className="p-1 hover:text-[#d4af37] text-zinc-400 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Webview Player Frame (16:9 Aspect Ratio) */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-[#c5a059]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center select-none group">
            
            {/* Paywall Overlay for Visitors on non-free lessons */}
            {isBlockedByPaywall ? (
              <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif-gold text-white">
                    Clase Reservada para Estudiantes Matriculados
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mt-1">
                    Esta lección forma parte de la malla oficial de Master Pen Training. Suscríbete por <strong className="text-[#f5e2a3]">$5.99/mes</strong> para desbloquear todas las cátedras y exámenes.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => cloudState.switchUserByRole('admin_vip_tester')}
                    className="px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition"
                  >
                    Acceder como VIP Tester (Exento)
                  </button>
                </div>
              </div>
            ) : isLocked ? (
              /* Lock Screen if student has not passed previous block */
              <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif-gold text-white">
                  Bloque Académico Bloqueado
                </h3>
                <p className="text-xs text-zinc-400 max-w-md">
                  Para desbloquear esta unidad, debes superar la Evaluación del Bloque anterior con al menos un <strong className="text-[#f5e2a3]">70% de aciertos</strong>.
                </p>
                <button
                  onClick={() => setSelectedBlockId('block_01')}
                  className="px-4 py-2 rounded-lg bg-[#c5a059] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d4af37] transition"
                >
                  Regresar al Bloque I
                </button>
              </div>
            ) : (
              <>
                {/* 1. IFRAME WEBVIEW PLAYER (YouTube, Cloudflare Stream, Vimeo, Google Slides) */}
                {mediaInfo.isIframe && mediaInfo.embedUrl && (
                  <iframe
                    src={mediaInfo.embedUrl}
                    title={activeResource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0 rounded-2xl"
                  />
                )}

                {/* 2. DIRECT HTML5 VIDEO TAG (Google Cloud Storage, MP4, WebM) */}
                {mediaInfo.isVideoTag && (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <video
                      ref={videoRef}
                      src={activeResource.storageUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => {
                        setIsPlaying(false);
                        toggleLessonCompleted(activeResource.id);
                      }}
                    />
                  </div>
                )}

                {/* 3. AUDIO STREAM PLAYER WITH SYNCED WAVEFORM */}
                {mediaInfo.isAudioTag && (
                  <div className="relative w-full h-full bg-gradient-to-br from-[#12141f] via-[#0d0e14] to-[#181a24] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-4 animate-pulse">
                      <Headphones className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold font-serif-gold text-white max-w-lg">
                      {activeResource.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-md">
                      Cátedra en Audio de Alta Fidelidad con Narración Magistral
                    </p>
                    <audio
                      src={activeResource.audioTrackUrl || activeResource.storageUrl}
                      controls
                      className="mt-6 w-full max-w-md accent-[#d4af37]"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => toggleLessonCompleted(activeResource.id)}
                    />
                  </div>
                )}

                {/* Watermark against unauthorized screen inspection / recording */}
                <div className="absolute top-3 right-4 z-20 pointer-events-none opacity-40 text-[9px] text-[#f5e2a3] font-mono bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                  ID: {currentUser ? currentUser.uid.substring(0, 10) : 'ANON'} • MPT-1080P PROTECTED
                </div>
              </>
            )}

          </div>

          {/* Under-Player Control Strip: Previous / Next / Complete */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#12131b] border border-zinc-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => prevLesson && handleSelectLesson(prevLesson.blockId, prevLesson.resource)}
                disabled={!prevLesson}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs font-semibold text-zinc-300 flex items-center space-x-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Clase Anterior</span>
              </button>

              <button
                onClick={() => nextLesson && handleSelectLesson(nextLesson.blockId, nextLesson.resource)}
                disabled={!nextLesson}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs font-semibold text-zinc-300 flex items-center space-x-1.5 transition"
              >
                <span className="hidden sm:inline">Siguiente Clase</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleLessonCompleted(activeResource.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                  completedLessonIds.includes(activeResource.id)
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{completedLessonIds.includes(activeResource.id) ? 'Clase Completada' : 'Marcar como Vista'}</span>
              </button>

              {selectedBlockId !== 'intro' && (
                <button
                  onClick={() => onOpenExam(selectedBlockId)}
                  disabled={isLocked}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#997320] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-[0_0_12px_rgba(212,175,55,0.35)] flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rendir Examen</span>
                </button>
              )}
            </div>
          </div>

          {/* Under-Player Tabs: Descripción & Apuntes / Transcripción / Recursos Descargables / Examen */}
          <div className="bg-[#101117] border border-zinc-800 rounded-2xl overflow-hidden">
            
            <div className="flex items-center border-b border-zinc-800 overflow-x-auto scrollbar-thin">
              <button
                onClick={() => setActiveTabUnderVideo('notes')}
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition ${
                  activeTabUnderVideo === 'notes'
                    ? 'border-[#d4af37] text-[#f5e2a3] bg-[#d4af37]/10'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-[#d4af37]" />
                <span>Descripción & Cátedra</span>
              </button>

              <button
                onClick={() => setActiveTabUnderVideo('transcript')}
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition ${
                  activeTabUnderVideo === 'transcript'
                    ? 'border-[#d4af37] text-[#f5e2a3] bg-[#d4af37]/10'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <Subtitles className="w-4 h-4 text-[#d4af37]" />
                <span>Transcripción Completa</span>
              </button>

              <button
                onClick={() => setActiveTabUnderVideo('resources')}
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition ${
                  activeTabUnderVideo === 'resources'
                    ? 'border-[#d4af37] text-[#f5e2a3] bg-[#d4af37]/10'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <FileDown className="w-4 h-4 text-[#d4af37]" />
                <span>Recursos & Descargas</span>
              </button>

              {selectedBlockId !== 'intro' && (
                <button
                  onClick={() => setActiveTabUnderVideo('exam')}
                  className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition ${
                    activeTabUnderVideo === 'exam'
                      ? 'border-[#d4af37] text-[#f5e2a3] bg-[#d4af37]/10'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#d4af37]" />
                  <span>Evaluación del Bloque (70%)</span>
                </button>
              )}
            </div>

            {/* TAB 1: Descripción & Notas */}
            {activeTabUnderVideo === 'notes' && (
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-lg font-bold font-serif-gold text-white">
                    {activeResource.title}
                  </h4>
                  <p className="text-xs text-[#c5a059] mt-0.5">
                    Duración pedagógica estimada: {activeResource.durationMinutes} minutos • Orden: {activeResource.order}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2 text-xs text-zinc-300 leading-relaxed font-light">
                  <p className="font-semibold text-[#f5e2a3] uppercase tracking-wider text-[11px]">
                    Axiomas Clave por Michael Pen:
                  </p>
                  <p>
                    {activeResource.notes || activeResource.transcript.substring(0, 320)}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs">
                    <span className="font-bold text-[#f5e2a3] block mb-1">Objetivo de Dominio:</span>
                    <span className="text-zinc-400">
                      Capacidad para erradicar el titubeo sintáctico e inocular la tesis en decisores con alta resistencia emocional.
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs">
                    <span className="font-bold text-[#f5e2a3] block mb-1">Requisito de Evaluación:</span>
                    <span className="text-zinc-400">
                      El cuestionario psicométrico asignará variantes de evaluación con opción múltiple y alternancia programada.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Transcripción Completa */}
            {activeTabUnderVideo === 'transcript' && (
              <div className="p-6 space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#c5a059] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={transcriptSearch}
                    onChange={(e) => setTranscriptSearch(e.target.value)}
                    placeholder="Buscar conceptos, citas o reglas en la transcripción..."
                    className="w-full pl-9 pr-4 py-2 bg-black border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 text-xs text-zinc-300 leading-relaxed max-h-64 overflow-y-auto space-y-3 font-mono">
                  <p className="text-zinc-400">
                    {activeResource.transcript}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Recursos Descargables */}
            {activeTabUnderVideo === 'resources' && (
              <div className="p-6 space-y-4">
                <p className="text-xs text-zinc-400">
                  Material complementario de apoyo, guías en PDF y diapositivas de análisis para esta lección:
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3.5 bg-black/60 border border-zinc-800 rounded-xl hover:border-[#c5a059]/50 transition">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-red-950/60 text-red-400 border border-red-500/40">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Guía Ejecutiva de Síntesis - {activeResource.title}</p>
                        <p className="text-[10px] text-zinc-400">Documento PDF Oficial • 2.4 MB</p>
                      </div>
                    </div>
                    <a
                      href={activeResource.storageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-[#d4af37] hover:text-black text-xs font-semibold text-[#f5e2a3] transition flex items-center space-x-1.5"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-black/60 border border-zinc-800 rounded-xl hover:border-[#c5a059]/50 transition">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-yellow-950/60 text-yellow-400 border border-yellow-500/40">
                        <Presentation className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Diapositivas de la Masterclass</p>
                        <p className="text-[10px] text-zinc-400">Presentación en Alta Definición • Formato Webview</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(activeResource.storageUrl, '_blank')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-[#d4af37] hover:text-black text-xs font-semibold text-[#f5e2a3] transition flex items-center space-x-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Examen */}
            {activeTabUnderVideo === 'exam' && selectedBlockId !== 'intro' && (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-serif-gold text-white">
                    Evaluación del {currentBlockObj?.title}
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                    El examen evalúa los conocimientos impartidos en esta unidad académica. Se requiere responder correctamente al menos el 70% de las preguntas para aprobar y desbloquear el siguiente bloque.
                  </p>
                </div>
                <button
                  onClick={() => onOpenExam(selectedBlockId)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#8a6c25] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.45)] inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Comenzar Evaluación del Bloque (Mínimo 70%)</span>
                </button>
              </div>
            )}

          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: UDEMY-STYLE COURSE CURRICULUM ACCORDION (4 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 bg-[#101117] border-2 border-[#c5a059]/40 rounded-2xl shadow-xl overflow-hidden sticky top-28">
          
          {/* Header of Udemy Course Content */}
          <div className="p-4 bg-gradient-to-r from-[#171924] to-[#12131b] border-b border-[#c5a059]/30 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#d4af37]" />
                <span>Contenido del Curso</span>
              </h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                {blocks.length + 1} secciones • {allLessons.length} cátedras
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#f5e2a3] bg-black/60 px-2 py-0.5 rounded border border-[#d4af37]/30">
              Webview HD
            </span>
          </div>

          <div className="divide-y divide-zinc-800 max-h-[700px] overflow-y-auto scrollbar-thin">
            
            {/* SECTION 0: INTRO / LECCIÓN CERO */}
            <div className="bg-black/30">
              <button
                onClick={() => toggleBlockExpanded('intro')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-900/60 transition"
              >
                <div>
                  <p className="text-[10px] font-bold text-[#c5a059] uppercase">Sección Preliminar</p>
                  <p className="text-xs font-bold text-white">Lección Cero (Manifiesto Michael Pen)</p>
                  <p className="text-[10px] text-zinc-500">1 lección • 4.5 min</p>
                </div>
                {expandedBlocks['intro'] ? <ChevronUp className="w-4 h-4 text-[#d4af37]" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
              </button>

              {expandedBlocks['intro'] && (
                <div className="bg-[#0c0d12] px-2 py-1.5 space-y-1 border-t border-zinc-800/80">
                  <div
                    onClick={() => handleSelectLesson('intro', introResource)}
                    className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between text-xs transition ${
                      activeResource.id === introResource.id
                        ? 'bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#f5e2a3] font-bold'
                        : 'text-zinc-300 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={completedLessonIds.includes(introResource.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleLessonCompleted(introResource.id);
                        }}
                        className="rounded border-zinc-700 text-[#d4af37] focus:ring-0 cursor-pointer"
                      />
                      <Video className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate text-xs">{introResource.title}</p>
                        <p className="text-[10px] text-zinc-500 flex items-center space-x-1">
                          <span>{introResource.durationMinutes} min</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">Gratis</span>
                        </p>
                      </div>
                    </div>
                    {activeResource.id === introResource.id && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#d4af37] text-black font-extrabold uppercase shrink-0">
                        En curso
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ACADEMIC MODULES (BLOQUES I, II, III...) */}
            {blocks.map((block, bIdx) => {
              const isPassed = currentUser ? cloudState.isBlockPassedByUser(currentUser.uid, block.id) : false;
              const isExpanded = expandedBlocks[block.id] !== false;
              const totalBlockMinutes = block.resources.reduce((acc, r) => acc + (r.durationMinutes || 0), 0);

              return (
                <div key={block.id} className="bg-black/20">
                  
                  {/* Module Header */}
                  <button
                    onClick={() => toggleBlockExpanded(block.id)}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-900/60 transition"
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-[10px] font-bold text-[#c5a059] uppercase">
                          Módulo {bIdx + 1}
                        </p>
                        {isPassed && (
                          <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                            100% Aprobado
                          </span>
                        )}
                        {block.isLockedForStudent && (
                          <span className="text-[9px] bg-red-950 text-red-300 border border-red-500/40 px-1.5 py-0.2 rounded font-bold flex items-center space-x-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Bloqueado</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white mt-0.5 line-clamp-1">{block.title}</p>
                      <p className="text-[10px] text-zinc-500">
                        {block.resources.length} clases • {totalBlockMinutes.toFixed(1)} min
                      </p>
                    </div>

                    <div className="text-zinc-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#d4af37]" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Module Lesson Items (Udemy Style) */}
                  {isExpanded && (
                    <div className="bg-[#0b0c11] px-2 py-1.5 space-y-1 border-t border-zinc-800/80">
                      {block.resources.map((res, rIdx) => {
                        const isCurrentActive = activeResource.id === res.id;
                        const isDone = completedLessonIds.includes(res.id);
                        const isFreePreview = res.previewFree;

                        return (
                          <div
                            key={res.id}
                            onClick={() => !block.isLockedForStudent && handleSelectLesson(block.id, res)}
                            className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition ${
                              block.isLockedForStudent
                                ? 'opacity-40 cursor-not-allowed text-zinc-500'
                                : isCurrentActive
                                ? 'bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#f5e2a3] font-bold cursor-pointer'
                                : 'text-zinc-300 hover:bg-zinc-800/60 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                              <input
                                type="checkbox"
                                checked={isDone}
                                disabled={block.isLockedForStudent}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleLessonCompleted(res.id);
                                }}
                                className="rounded border-zinc-700 text-[#d4af37] focus:ring-0 cursor-pointer shrink-0"
                              />

                              {res.type === 'slide_audio' || res.type === 'slides_embed' ? (
                                <Presentation className="w-4 h-4 text-yellow-400 shrink-0" />
                              ) : res.type === 'document_pdf' ? (
                                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : res.type === 'image_tts' ? (
                                <Headphones className="w-4 h-4 text-purple-400 shrink-0" />
                              ) : (
                                <Video className="w-4 h-4 text-[#d4af37] shrink-0" />
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-xs font-medium">
                                  {rIdx + 1}. {res.title}
                                </p>
                                <p className="text-[10px] text-zinc-500 flex items-center space-x-1.5">
                                  <span>{res.durationMinutes} min</span>
                                  {isFreePreview && (
                                    <>
                                      <span>•</span>
                                      <span className="text-emerald-400 font-semibold">Vista Previa</span>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center space-x-1.5">
                              {isCurrentActive ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#d4af37] text-black font-extrabold uppercase">
                                  Reproduciendo
                                </span>
                              ) : block.isLockedForStudent ? (
                                <Lock className="w-3.5 h-3.5 text-zinc-600" />
                              ) : null}
                            </div>
                          </div>
                        );
                      })}

                      {/* Examen button inside module */}
                      <div className="pt-1 pb-1 px-1">
                        <button
                          onClick={() => onOpenExam(block.id)}
                          disabled={block.isLockedForStudent}
                          className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-[#d4af37]/20 border border-zinc-800 hover:border-[#d4af37]/40 text-[#f5e2a3] text-[11px] font-semibold flex items-center justify-between transition disabled:opacity-40"
                        >
                          <span className="flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>Examen del Módulo</span>
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                            {isPassed ? 'Aprobado 100%' : '100% Requerido'}
                          </span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </div>

    )}

        </>
      )}

  </div>
  );
};
