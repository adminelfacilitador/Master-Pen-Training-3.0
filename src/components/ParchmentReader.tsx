import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Award, 
  Feather, 
  Sun, 
  Moon, 
  Maximize2,
  CheckCircle2,
  RotateCcw,
  Palette
} from 'lucide-react';
import { CourseBlockData, CourseSlide } from '../data/quieroSerEscritorCourse';
import { VoiceAgent } from '../services/voiceAgent';
import { MasterAudioArbiter } from '../services/audioArbiter';

export type ParchmentTheme = 'pergamino' | 'papiro' | 'sepia_nocturno';

interface ParchmentReaderProps {
  isOpen: boolean;
  onClose: () => void;
  activeBlock: CourseBlockData;
  initialSlideIndex?: number;
  onBlockChange?: (blockId: string) => void;
  onSlideChange?: (slideIndex: number) => void;
}

export const ParchmentReader: React.FC<ParchmentReaderProps> = ({
  isOpen,
  onClose,
  activeBlock,
  initialSlideIndex = 0,
  onBlockChange,
  onSlideChange
}) => {
  const [slideIndex, setSlideIndex] = useState(initialSlideIndex);
  const [theme, setTheme] = useState<ParchmentTheme>('pergamino');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [isNarrating, setIsNarrating] = useState(false);
  const [activeSentence, setActiveSentence] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);

  // Sync initial slide index when opened
  useEffect(() => {
    if (isOpen) {
      setSlideIndex(initialSlideIndex);
      setScrollProgress(0);
    }
  }, [isOpen, initialSlideIndex]);

  const currentSlide: CourseSlide = activeBlock.slides[slideIndex] || activeBlock.slides[0];
  const isLastSlide = slideIndex === activeBlock.slides.length - 1;

  // Track scroll progression inside the parchment reader
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;
      const pct = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100))) : 0;
      setScrollProgress(pct);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => el.removeEventListener('scroll', handleScroll);
  }, [isOpen, slideIndex]);

  // Audio narration controls
  const startNarration = () => {
    if (!currentSlide) return;
    VoiceAgent.stopSpeaking(false);
    setIsNarrating(true);
    setActiveSentence('');

    const narrationContent = currentSlide.michaelPenNarration || currentSlide.expandedText;

    VoiceAgent.speakMichaelPen(
      narrationContent,
      () => setIsNarrating(true),
      () => {
        setIsNarrating(false);
        setActiveSentence('');
      },
      (sentence) => setActiveSentence(sentence)
    );
  };

  const stopNarration = () => {
    VoiceAgent.stopSpeaking(false);
    setIsNarrating(false);
    setActiveSentence('');
  };

  const handleExit = () => {
    stopNarration();
    onClose();
  };

  // Keyboard navigation & Esc to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        handleExit();
      } else if (e.key === 'ArrowRight' && !isLastSlide) {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft' && slideIndex > 0) {
        handlePrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLastSlide, slideIndex]);

  // Lock body scroll and hide external widgets
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.setAttribute('data-mp-parchment-active', 'true');
      const widget = document.getElementById('michael-pen-universal-widget');
      if (widget) widget.style.display = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.removeAttribute('data-mp-parchment-active');
      const widget = document.getElementById('michael-pen-universal-widget');
      if (widget) widget.style.display = '';
      stopNarration();
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.removeAttribute('data-mp-parchment-active');
      const widget = document.getElementById('michael-pen-universal-widget');
      if (widget) widget.style.display = '';
      stopNarration();
    };
  }, [isOpen]);

  const handleNextSlide = () => {
    stopNarration();
    if (slideIndex < activeBlock.slides.length - 1) {
      const nextIdx = slideIndex + 1;
      setSlideIndex(nextIdx);
      if (onSlideChange) onSlideChange(nextIdx);
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSlide = () => {
    stopNarration();
    if (slideIndex > 0) {
      const prevIdx = slideIndex - 1;
      setSlideIndex(prevIdx);
      if (onSlideChange) onSlideChange(prevIdx);
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isOpen || !currentSlide) return null;

  // Split text for illuminated drop-cap presentation
  const fullText = currentSlide.expandedText.trim();
  const firstLetter = fullText.charAt(0);
  const remainingText = fullText.slice(1);

  // Theme palettes
  const themeClasses = {
    pergamino: {
      bg: 'bg-[#f6f0e2]',
      surface: 'bg-[#fbf7ee]',
      border: 'border-[#d8c8a8]',
      textPrimary: 'text-[#2b2118]',
      textSecondary: 'text-[#5c4a37]',
      textMuted: 'text-[#876e53]',
      accentGold: 'text-[#8b5a2b]',
      vignette: 'shadow-[inset_0_0_120px_rgba(110,80,30,0.12)]',
      calloutBg: 'bg-[#eedfc4]/70 border-[#c4ab7a]',
      progressBar: 'from-[#8b5a2b] via-[#c5a059] to-[#d4af37]',
      headerBg: 'bg-[#efe6d2]/90 border-[#d8c8a8]'
    },
    papiro: {
      bg: 'bg-[#f1e5cc]',
      surface: 'bg-[#f7edd8]',
      border: 'border-[#ceb586]',
      textPrimary: 'text-[#261c12]',
      textSecondary: 'text-[#503d29]',
      textMuted: 'text-[#7a6042]',
      accentGold: 'text-[#7a4e1d]',
      vignette: 'shadow-[inset_0_0_140px_rgba(95,65,20,0.16)]',
      calloutBg: 'bg-[#e5d4b0]/75 border-[#bca068]',
      progressBar: 'from-[#7a4e1d] via-[#b8860b] to-[#c5a059]',
      headerBg: 'bg-[#e8dcbf]/95 border-[#ceb586]'
    },
    sepia_nocturno: {
      bg: 'bg-[#181512]',
      surface: 'bg-[#211d18]',
      border: 'border-[#3d3326]',
      textPrimary: 'text-[#ebdcc4]',
      textSecondary: 'text-[#b8a78e]',
      textMuted: 'text-[#827461]',
      accentGold: 'text-[#d4af37]',
      vignette: 'shadow-[inset_0_0_140px_rgba(0,0,0,0.7)]',
      calloutBg: 'bg-[#2a241e] border-[#594833]',
      progressBar: 'from-[#856524] via-[#d4af37] to-[#f5e2a3]',
      headerBg: 'bg-[#1e1a16]/95 border-[#3d3326]'
    }
  }[theme];

  // Font size scales
  const fontSizeClasses = {
    normal: 'text-base sm:text-lg leading-relaxed sm:leading-[1.85]',
    large: 'text-lg sm:text-xl leading-relaxed sm:leading-[1.95]',
    xlarge: 'text-xl sm:text-2xl leading-relaxed sm:leading-[2.1]'
  }[fontSize];

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-[999999] ${themeClasses.bg} ${themeClasses.textPrimary} flex flex-col justify-between overflow-hidden select-text animate-in fade-in duration-300 transition-colors`}
    >
      {/* Top Reading Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-black/10 z-50 pointer-events-none">
        <div 
          className={`h-full bg-gradient-to-r ${themeClasses.progressBar} transition-all duration-150 ease-out`}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIOR DE CONCENTRACIÓN Y HERRAMIENTAS DE LECTURA */}
      {/* ========================================================================= */}
      <header className={`relative z-20 px-4 sm:px-8 py-3 ${themeClasses.headerBg} border-b backdrop-blur-md flex items-center justify-between gap-3 shadow-sm transition-colors`}>
        
        {/* Identificador de Cátedra */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-600/30 text-amber-700 dark:text-amber-400 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className={`text-[10px] font-mono uppercase tracking-widest ${themeClasses.accentGold} block font-semibold truncate`}>
              Modo Lectura • {activeBlock.title.split(':')[0]}
            </span>
            <h2 className="text-xs sm:text-sm font-bold font-serif-gold tracking-wide truncate max-w-xs sm:max-w-md">
              Lámina {currentSlide.slideNumber}: {currentSlide.title}
            </h2>
          </div>
        </div>

        {/* Acciones de Cabecera: Selector de Tono, Tipografía, Audio y Salida */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Selector de Tono de Pergamino */}
          <div className="hidden sm:flex items-center space-x-1 p-1 rounded-xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-zinc-800 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setTheme('pergamino')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                theme === 'pergamino' 
                  ? 'bg-[#efe3cb] text-[#332415] font-bold shadow-xs border border-[#cfbe9d]' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="Pergamino Clásico"
            >
              Pergamino
            </button>
            <button
              type="button"
              onClick={() => setTheme('papiro')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                theme === 'papiro' 
                  ? 'bg-[#e5d4af] text-[#2c1d0d] font-bold shadow-xs border border-[#c3aa79]' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="Papiro Dorado"
            >
              Papiro
            </button>
            <button
              type="button"
              onClick={() => setTheme('sepia_nocturno')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                theme === 'sepia_nocturno' 
                  ? 'bg-[#2b241d] text-[#f2e6cf] font-bold shadow-xs border border-[#4a3e30]' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="Sepia Nocturno (Cuidado Visual)"
            >
              Nocturno
            </button>
          </div>

          {/* Ajuste de Tamaño Tipográfico */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-zinc-800 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                fontSize === 'normal' 
                  ? 'bg-amber-600/20 font-bold text-amber-900 dark:text-amber-200' 
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
              title="Tipografía Normal (18px)"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                fontSize === 'large' 
                  ? 'bg-amber-600/20 font-bold text-amber-900 dark:text-amber-200' 
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
              title="Tipografía Aumentada (20px)"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                fontSize === 'xlarge' 
                  ? 'bg-amber-600/20 font-bold text-amber-900 dark:text-amber-200' 
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
              title="Tipografía Máxima (22px)"
            >
              A++
            </button>
          </div>

          {/* Voz Humana Michael Pen */}
          <button
            type="button"
            onClick={isNarrating ? stopNarration : startNarration}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              isNarrating
                ? 'bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 border-emerald-600/50 shadow-sm'
                : 'bg-black/5 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-400/40 dark:border-zinc-700 hover:border-amber-600'
            }`}
            title={isNarrating ? 'Pausar narrativa' : 'Escuchar cátedra narrada por Michael Pen'}
          >
            {isNarrating ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span className="hidden md:inline">Narrando</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden md:inline">Voz</span>
              </>
            )}
          </button>

          {/* Salir de Modo Lectura */}
          <button
            type="button"
            onClick={handleExit}
            className="px-3.5 py-1.5 rounded-xl bg-amber-950/10 dark:bg-zinc-800 hover:bg-amber-900/20 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-amber-800/30 dark:border-zinc-600 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
            title="Restablecer interfaz y salir del Modo Lectura (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Restablecer Interfaz</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. ESPACIO CENTRAL DE LECTURA DE CÁTEDRA (FONDO DE PERGAMINO LITERARIO) */}
      {/* ========================================================================= */}
      <main 
        ref={scrollContainerRef as React.RefObject<HTMLElement>}
        className={`relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 py-8 sm:py-12 ${themeClasses.vignette} scrollbar-thin`}
      >
        <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
          
          {/* Cabecera Clásica de Manuscrito */}
          <div className="text-center space-y-3 pb-6 border-b border-dashed border-amber-800/30 dark:border-amber-500/20">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase bg-amber-900/10 dark:bg-amber-500/10 text-amber-900 dark:text-[#f5e2a3] border border-amber-800/20">
              <Feather className="w-3.5 h-3.5" />
              <span>{activeBlock.title.split(':')[0]} • Lección {currentSlide.slideNumber} de {activeBlock.slides.length}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif-gold tracking-tight leading-tight">
              {currentSlide.title}
            </h1>

            <p className={`text-sm sm:text-base italic font-serif ${themeClasses.textSecondary} max-w-xl mx-auto`}>
              «{currentSlide.subtitle}»
            </p>
          </div>

          {/* Lámina Curricular Ilustrada (Atenuada con marco pergamino) */}
          {currentSlide.imageUrl && (
            <div className={`relative rounded-2xl overflow-hidden border-2 ${themeClasses.border} shadow-xl bg-black max-h-72 sm:max-h-96 w-full`}>
              <img 
                src={currentSlide.imageUrl} 
                alt={currentSlide.title}
                className="w-full h-full object-cover object-center filter sepia-[0.25] brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 right-3.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-sm border border-zinc-700 text-[10px] text-zinc-300 font-mono">
                Lámina Ilustrada {currentSlide.slideNumber} • {activeBlock.title.split(':')[0]}
              </div>
            </div>
          )}

          {/* Indicador de Transmisión de Voz */}
          {isNarrating && (
            <div className={`p-3.5 rounded-xl ${themeClasses.calloutBg} border flex items-center space-x-3 text-xs animate-in fade-in`}>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-[#d4af37] animate-ping shrink-0" />
              <div className="min-w-0">
                <span className={`font-bold font-serif-gold text-xs block ${themeClasses.accentGold}`}>
                  Michael Pen narrando en voz humana:
                </span>
                {activeSentence && (
                  <p className="italic text-xs truncate mt-0.5 opacity-90">
                    «{activeSentence}»
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cuerpo Literario con Letra Capitular Iluminada */}
          <article className="space-y-6 pt-2 font-serif text-justify selection:bg-amber-700/20">
            <div className={`${fontSizeClasses} text-justify`}>
              {/* Letra Capitular Iluminada */}
              <span className="float-left text-5xl sm:text-6xl md:text-7xl font-serif-gold font-black leading-none pr-3 pt-1 text-amber-800 dark:text-[#d4af37] select-none drop-shadow-xs">
                {firstLetter}
              </span>
              <span className="leading-relaxed sm:leading-[1.95]">
                {remainingText}
              </span>
            </div>
          </article>

          {/* Axioma Magistral (Pergamino Iluminado) */}
          {currentSlide.keyAxiom && (
            <div className={`p-5 sm:p-6 rounded-2xl ${themeClasses.calloutBg} border shadow-md relative overflow-hidden`}>
              <div className="flex items-center space-x-2 text-xs font-bold mb-2 uppercase tracking-widest font-serif-gold text-amber-800 dark:text-[#d4af37]">
                <Sparkles className="w-4 h-4" />
                <span>Axioma Fundamental de la Cátedra</span>
              </div>
              <p className="text-base sm:text-lg italic font-serif leading-relaxed text-amber-950 dark:text-[#f7ebd4]">
                «{currentSlide.keyAxiom}»
              </p>
            </div>
          )}

          {/* Consigna Reflexiva para el Discípulo */}
          {currentSlide.writingExercise && (
            <div className={`p-4 sm:p-5 rounded-xl border border-dashed border-amber-800/30 dark:border-amber-600/30 text-xs sm:text-sm space-y-1.5 opacity-90`}>
              <span className="font-bold font-mono text-[11px] uppercase tracking-wider text-amber-800 dark:text-[#d4af37] block">
                Consigna para la Libreta de Apuntes:
              </span>
              <p className="font-serif leading-relaxed">
                {currentSlide.writingExercise}
              </p>
            </div>
          )}

          {/* Navegación al Pie de la Cátedra */}
          <div className="pt-8 border-t border-dashed border-amber-800/30 dark:border-amber-600/20 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={slideIndex === 0}
              className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                theme === 'sepia_nocturno'
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                  : 'bg-[#ede2cb] border-[#cfbe9d] text-amber-950 hover:bg-[#e4d6bc]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Cátedra Anterior</span>
            </button>

            <span className="text-xs font-mono opacity-60">
              {slideIndex + 1} / {activeBlock.slides.length}
            </span>

            {isLastSlide ? (
              <button
                type="button"
                onClick={handleExit}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center space-x-1.5 transition cursor-pointer"
              >
                <span>Finalizar Lectura</span>
                <Award className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextSlide}
                className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer ${
                  theme === 'sepia_nocturno'
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                    : 'bg-[#ede2cb] border-[#cfbe9d] text-amber-950 hover:bg-[#e4d6bc]'
                }`}
              >
                <span>Siguiente Cátedra</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. PIE DE PÁGINA SUTIL */}
      {/* ========================================================================= */}
      <footer className={`py-2 px-4 text-center border-t text-[11px] font-mono opacity-50 ${themeClasses.headerBg}`}>
        Master Pen Training • Modo Lectura en Pergamino • Presione Esc para restablecer la interfaz
      </footer>
    </div>
  );
};
