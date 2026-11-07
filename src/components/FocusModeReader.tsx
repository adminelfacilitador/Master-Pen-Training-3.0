import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Award, 
  Eye, 
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { CourseBlockData, CourseSlide } from '../data/quieroSerEscritorCourse';
import { VoiceAgent } from '../services/voiceAgent';
import { MasterAudioArbiter } from '../services/audioArbiter';

interface FocusModeReaderProps {
  isOpen: boolean;
  onClose: () => void;
  activeBlock: CourseBlockData;
  initialSlideIndex?: number;
  brandingPortrait?: string;
  onBlockChange?: (blockId: string) => void;
}

export const FocusModeReader: React.FC<FocusModeReaderProps> = ({
  isOpen,
  onClose,
  activeBlock,
  initialSlideIndex = 0,
  brandingPortrait,
  onBlockChange
}) => {
  const [slideIndex, setSlideIndex] = useState(initialSlideIndex);
  const [isNarrating, setIsNarrating] = useState(false);
  const [activeSentence, setActiveSentence] = useState('');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [completedNotice, setCompletedNotice] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial slide index when opened
  useEffect(() => {
    if (isOpen) {
      setSlideIndex(initialSlideIndex);
      setCompletedNotice(false);
    }
  }, [isOpen, initialSlideIndex]);

  const currentSlide: CourseSlide = activeBlock.slides[slideIndex] || activeBlock.slides[0];
  const isLastSlide = slideIndex === activeBlock.slides.length - 1;

  // Iniciar la narrativa del anfitrión Michael Pen
  const startNarration = () => {
    if (!currentSlide) return;
    VoiceAgent.stopSpeaking(false);
    setIsNarrating(true);
    setActiveSentence('');

    const narrationContent = currentSlide.michaelPenNarration || currentSlide.expandedText;

    VoiceAgent.speakMichaelPen(
      narrationContent,
      () => {
        setIsNarrating(true);
      },
      () => {
        // Al finalizar la lectura de la narrativa, restablecer automáticamente la normalidad del entorno
        setIsNarrating(false);
        setActiveSentence('');
        setCompletedNotice(true);
        setTimeout(() => {
          handleExit();
        }, 1800);
      },
      (sentence) => {
        setActiveSentence(sentence);
      }
    );
  };

  // Detener la narrativa
  const stopNarration = () => {
    VoiceAgent.stopSpeaking(false);
    setIsNarrating(false);
    setActiveSentence('');
  };

  // Manejo de salida y restauración de la normalidad
  const handleExit = () => {
    stopNarration();
    onClose();
  };

  // Cuando el usuario pulsa la pantalla (fuera o dentro del canvas) para suspender la narrativa
  const handleScreenTap = (e: React.MouseEvent | React.TouchEvent) => {
    // Si se hizo clic en un botón interactivo, no interceptar
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }

    if (isNarrating) {
      stopNarration();
    }
  };

  // Escuchar tecla Escape para salir
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        handleExit();
      } else if (e.key === 'ArrowRight' && !isLastSlide) {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft' && slideIndex > 0) {
        handlePrevSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (isNarrating) {
          stopNarration();
        } else {
          startNarration();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isNarrating, isLastSlide, slideIndex]);

  // Bloquear scroll de fondo y ocultar widget externo mientras está activo el modo enfoque
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.setAttribute('data-mp-focus-active', 'true');
      
      // Ocultar widget universal de Michael Pen si está en el DOM
      const widget = document.getElementById('michael-pen-universal-widget');
      if (widget) {
        widget.style.display = 'none';
      }

      // Iniciar automáticamente la lectura guiada al entrar al modo enfoque
      startNarration();
    } else {
      document.body.style.overflow = '';
      document.documentElement.removeAttribute('data-mp-focus-active');
      const widget = document.getElementById('michael-pen-universal-widget');
      if (widget) {
        widget.style.display = '';
      }
      stopNarration();
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.removeAttribute('data-mp-focus-active');
      const widget = document.getElementById('michael-pen-universal-widget');
      if (widget) {
        widget.style.display = '';
      }
      stopNarration();
    };
  }, [isOpen]);

  const handleNextSlide = () => {
    stopNarration();
    if (slideIndex < activeBlock.slides.length - 1) {
      setSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    stopNarration();
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      onClick={handleScreenTap}
      onTouchStart={handleScreenTap}
      className="fixed inset-0 z-[999999] bg-[#050608] text-[#f0f0f2] flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300"
    >
      {/* Luces sutiles de fondo para estética de santuario literario */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#856524]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIOR DE CONCENTRACIÓN (MINIMALISTA) */}
      {/* ========================================================================= */}
      <header className="relative z-20 px-4 sm:px-8 py-3.5 bg-gradient-to-b from-[#090a0f] to-transparent border-b border-[#c5a059]/20 flex items-center justify-between gap-4">
        
        {/* Identificador de Cátedra */}
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse shadow-[0_0_8px_#d4af37]" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059] block">
              Modo Enfoque • {activeBlock.title.split(':')[0]}
            </span>
            <h2 className="text-xs sm:text-sm font-bold font-serif-gold text-white tracking-wide truncate max-w-xs sm:max-w-md">
              Lección {currentSlide.slideNumber}: {currentSlide.title}
            </h2>
          </div>
        </div>

        {/* Acciones de Cabecera: Tamaño de fuente, Voz & Salida */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Ajuste de Tamaño de Lectura */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFontSize((prev) => (prev === 'normal' ? 'large' : 'normal'));
            }}
            className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-[#f5e2a3] transition cursor-pointer"
            title="Alternar tamaño de fuente"
          >
            {fontSize === 'normal' ? 'A+' : 'A-'}
          </button>

          {/* Toggle de Narración de Michael Pen */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isNarrating) {
                stopNarration();
              } else {
                startNarration();
              }
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
              isNarrating
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
            title={isNarrating ? 'Pausar narrativa' : 'Reanudar narrativa de Michael Pen'}
          >
            {isNarrating ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Narrando</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline">Voz Pausada</span>
              </>
            )}
          </button>

          {/* Botón Salir / Restablecer Normalidad */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleExit();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 hover:border-[#d4af37]/60 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            title="Restablecer normalidad y salir del Modo Enfoque (Esc)"
          >
            <X className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. ESPACIO CENTRAL DE LECTURA Y ASIMILACIÓN PROFUNDA */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 py-6 sm:py-10 max-w-4xl mx-auto w-full scrollbar-thin">
        
        {/* Aviso de Culminación de Lectura */}
        {completedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-center animate-in fade-in duration-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <h4 className="text-sm font-bold font-serif-gold text-white">Lectura Completada</h4>
            <p className="text-xs text-zinc-300 mt-0.5">Restableciendo la normalidad del entorno...</p>
          </div>
        )}

        <article className="space-y-6 sm:space-y-8">
          
          {/* Cabecera del Texto */}
          <div className="text-center space-y-2.5 pb-4 border-b border-[#c5a059]/20">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e2a3] uppercase tracking-wider">
              {activeBlock.title.split(':')[0]} • Lección {currentSlide.slideNumber} de {activeBlock.slides.length}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif-gold text-white leading-tight">
              {currentSlide.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#c5a059] font-light max-w-2xl mx-auto leading-relaxed">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Imagen Ilustrativa de la Cátedra (Con formato apaisado sutil) */}
          {currentSlide.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-black max-h-72 sm:max-h-96 w-full">
              <img 
                src={currentSlide.imageUrl} 
                alt={currentSlide.title}
                className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 right-3.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-sm border border-zinc-800 text-[10px] text-zinc-400 font-mono">
                Lámina Curricular {currentSlide.slideNumber}
              </div>
            </div>
          )}

          {/* Onda Sonora de Voz Activa */}
          {isNarrating && (
            <div className="p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center space-x-3 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-[#f5e2a3] font-serif-gold text-[11px] block">
                  Voz Oficial de Michael Pen en Transmisión
                </span>
                {activeSentence && (
                  <p className="text-zinc-300 italic text-[11px] truncate">
                    «{activeSentence}»
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cuerpo Magistral del Texto de la Cátedra */}
          <div className="space-y-4 pt-1">
            <p className={`text-zinc-200 font-light leading-relaxed sm:leading-loose text-justify ${
              fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}>
              {currentSlide.expandedText}
            </p>
          </div>

          {/* Axioma Fundamental de la Pluma */}
          {currentSlide.keyAxiom && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171924] via-[#101117] to-[#1a1c26] border border-[#d4af37]/50 shadow-lg relative">
              <div className="flex items-center space-x-2 text-xs text-[#d4af37] font-serif-gold font-bold mb-1 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Axioma Magistral</span>
              </div>
              <p className="text-sm sm:text-base italic text-[#f5e2a3] font-serif leading-relaxed">
                «{currentSlide.keyAxiom}»
              </p>
            </div>
          )}

          {/* Ejercicio de Escritura Reflexiva */}
          {currentSlide.writingExercise && (
            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 text-xs sm:text-sm text-zinc-300 space-y-1">
              <span className="font-bold text-[#c5a059] font-mono text-[11px] uppercase tracking-wider block">
                Consigna de Reflexión:
              </span>
              <p className="leading-relaxed">
                {currentSlide.writingExercise}
              </p>
            </div>
          )}

          {/* Botones de Navegación entre Diapositivas */}
          <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevSlide();
              }}
              disabled={slideIndex === 0}
              className="px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-mono text-zinc-500">
              {slideIndex + 1} de {activeBlock.slides.length}
            </span>

            {isLastSlide ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleExit();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#856524] text-black font-extrabold text-xs tracking-wider transition hover:brightness-110 flex items-center space-x-1.5 cursor-pointer shadow-lg"
              >
                <span>Finalizar Cátedra</span>
                <Award className="w-4 h-4 text-black" />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white flex items-center space-x-1.5 transition cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </article>
      </main>

      {/* ========================================================================= */}
      {/* 3. MENSAJE TENUE FUERA DEL ESPACIO ENFOCADO: "Pulse para detener la narrativa" */}
      {/* ========================================================================= */}
      <footer className="relative z-20 py-2.5 px-4 text-center border-t border-zinc-900 bg-[#06070a]/90 select-none">
        <p className="text-[11px] sm:text-xs text-amber-200/40 tracking-wider font-light transition-opacity duration-300">
          {isNarrating ? (
            <span className="animate-pulse">
              Pulse en la pantalla para detener la narrativa
            </span>
          ) : (
            <span className="text-zinc-600/60">
              Narrativa pausada • Toque para reanudar o presione Esc para salir
            </span>
          )}
        </p>
      </footer>
    </div>
  );
};
