import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Film, 
  BookOpen, 
  Award,
  Lock,
  Sparkles,
  AlertCircle,
  Compass
} from 'lucide-react';
import { QUIERO_SER_ESCRITOR_BLOCKS, CourseSlide, CourseBlockData } from '../data/quieroSerEscritorCourse';
import { VoiceAgent } from '../services/voiceAgent';
import { cloudState } from '../services/cloudState';

interface CourseSlideViewerProps {
  currentBlockId: string;
  onBlockChange: (blockId: string) => void;
  onTakeExam: (blockId: string) => void;
  isAdmin?: boolean;
  onBackToWelcome?: () => void;
}

export const CourseSlideViewer: React.FC<CourseSlideViewerProps> = ({
  currentBlockId,
  onBlockChange,
  onTakeExam,
  isAdmin = false,
  onBackToWelcome
}) => {
  const [courseBlocks, setCourseBlocks] = useState<CourseBlockData[]>(cloudState.getCourseBlocks());

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setCourseBlocks(cloudState.getCourseBlocks());
    });
    return () => unsub();
  }, []);

  const currentBlockIndex = courseBlocks.findIndex(b => b.id === currentBlockId);
  const activeBlock: CourseBlockData = courseBlocks[currentBlockIndex >= 0 ? currentBlockIndex : 0] || courseBlocks[0];

  const [slideIndex, setSlideIndex] = useState(0);
  const [isPhotoVideoMode, setIsPhotoVideoMode] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [activeSentence, setActiveSentence] = useState<string>('');
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [useMichaelPenFormat, setUseMichaelPenFormat] = useState(true);
  const [isPrologueDimmed, setIsPrologueDimmed] = useState(false);

  const branding = cloudState.getBrandingImages();
  const currentSlide: CourseSlide = activeBlock.slides[slideIndex] || activeBlock.slides[0];
  const isLastSlide = slideIndex === activeBlock.slides.length - 1;

  // Trigger Formato Michael Pen whenever slide or block changes
  const startMichaelPenPrologue = (slide: CourseSlide) => {
    VoiceAgent.stopSpeaking();
    setIsNarrating(false);

    if (!useMichaelPenFormat) {
      setIsPrologueDimmed(false);
      return;
    }

    const narrationText = slide.michaelPenNarration || `Bienvenido a la diapositiva ${slide.slideNumber} del ${activeBlock.title}. ${slide.subtitle}. Profundicemos en los axiomas fundamentales de esta lección.`;

    setIsPrologueDimmed(true);
    setIsNarrating(true);

    VoiceAgent.speakMichaelPen(
      narrationText,
      () => {
        setIsNarrating(true);
      },
      () => {
        setIsNarrating(false);
        setActiveSentence('');
        // Smooth automatic transition: La pantalla cambia y el usuario logra ver la diapositiva
        setIsPrologueDimmed(false);

        if (isPhotoVideoMode && !isLastSlide) {
          setTimeout(() => {
            setSlideIndex(prev => prev + 1);
          }, 4500);
        }
      },
      (sentence) => {
        setActiveSentence(sentence);
      }
    );
  };

  // Reset slide index and start prologue when block changes
  useEffect(() => {
    setSlideIndex(0);
    const firstSlide = activeBlock.slides[0];
    if (firstSlide) {
      startMichaelPenPrologue(firstSlide);
    }
  }, [currentBlockId]);

  // Clean up narration on unmount
  useEffect(() => {
    return () => {
      VoiceAgent.stopSpeaking();
    };
  }, []);

  // When manually changing slides
  const handleSlideChange = (newIndex: number) => {
    VoiceAgent.stopSpeaking();
    setIsNarrating(false);
    setSlideIndex(newIndex);
    const targetSlide = activeBlock.slides[newIndex];
    if (targetSlide) {
      startMichaelPenPrologue(targetSlide);
    }
  };

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      handleSlideChange(slideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (slideIndex < activeBlock.slides.length - 1) {
      handleSlideChange(slideIndex + 1);
    }
  };

  // Handle Play Narration toggle
  const handleToggleNarration = () => {
    if (isNarrating) {
      VoiceAgent.stopSpeaking();
      setIsNarrating(false);
      setIsPrologueDimmed(false);
      setActiveSentence('');
    } else {
      startMichaelPenPrologue(currentSlide);
    }
  };

  const handleBlockSelect = (blockId: string, blockNum: number) => {
    const isLocked = cloudState.isBlockLocked(blockId);
    if (isLocked) {
      setLockedNotice(`El Bloque ${blockNum} se encuentra bloqueado. Debes superar la Evaluación del Bloque ${blockNum - 1} con al menos 4 de 5 preguntas correctas para desbloquearlo.`);
      setTimeout(() => setLockedNotice(null), 5000);
      return;
    }
    setLockedNotice(null);
    onBlockChange(blockId);
  };

  return (
    <div className="space-y-6">
      
      {/* 5-Block Navigation Ribbon with Lock Sentinel */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {courseBlocks.map((blk) => {
          const isActive = blk.id === activeBlock.id;
          const isLocked = cloudState.isBlockLocked(blk.id);

          return (
            <button
              key={blk.id}
              onClick={() => handleBlockSelect(blk.id, blk.blockNumber)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold font-serif-gold tracking-wide whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] text-black border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105'
                  : isLocked
                  ? 'bg-black/40 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-75'
                  : 'bg-black/60 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
              title={isLocked ? `Bloque ${blk.blockNumber} Bloqueado (Aprobar Bloque ${blk.blockNumber - 1} con >= 4 de 5 aciertos)` : blk.title}
            >
              {isLocked ? (
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              )}
              <span>Bloque {blk.blockNumber}</span>
              {isLocked && <span className="text-[10px] text-zinc-500">(Bloqueado)</span>}
            </button>
          );
        })}
      </div>

      {/* Locked Notice Banner */}
      {lockedNotice && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/60 text-amber-200 text-xs flex items-center space-x-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{lockedNotice}</span>
        </div>
      )}

      {/* Main Slide Stage */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#d4af37]/60 bg-[#0c0d12] shadow-2xl">
        
        {/* PANTALLA ATENUADA (FORMATO MICHAEL PEN): MICHAEL PEN HABLA CON VOZ EN OFF CON LA PANTALLA ATENUADA */}
        {isPrologueDimmed && (
          <div className="absolute inset-0 z-30 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.6)] bg-black">
                <img 
                  src={branding.portrait} 
                  alt="Michael Pen" 
                  className="w-full h-full object-cover filter contrast-110"
                />
              </div>
              <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                <span className="px-3 py-1 rounded-full bg-[#d4af37] text-black text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                  Voz en Off
                </span>
              </div>
            </div>

            <div className="max-w-xl space-y-2">
              <div className="flex items-center justify-center space-x-2 text-xs text-[#c5a059] font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
                <span>Prólogo Magistral • Michael Pen</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-gold text-white">
                {currentSlide.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light italic">
                «{currentSlide.michaelPenNarration || 'Escucha la reflexión preliminar para situar el eje temático de esta lección.'}»
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  VoiceAgent.stopSpeaking();
                  setIsNarrating(false);
                  setIsPrologueDimmed(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                <span>Continuar al Contenido Visual →</span>
              </button>
            </div>
          </div>
        )}

        {/* Slide Top Bar Controls */}
        <div className="px-6 py-4 bg-[#11131c] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#d4af37]/15 border border-[#d4af37]/50 text-[#f5e2a3] font-mono">
              Diapositiva {currentSlide.slideNumber} de {activeBlock.slides.length}
            </span>
            <h3 className="text-sm font-bold text-white font-serif-gold truncate max-w-md">
              {activeBlock.title}
            </h3>
          </div>

          {/* Mode Toggles & Narration Player */}
          <div className="flex items-center space-x-3">
            
            {/* Formato Michael Pen Question / Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextVal = !useMichaelPenFormat;
                setUseMichaelPenFormat(nextVal);
                if (!nextVal) {
                  setIsPrologueDimmed(false);
                  VoiceAgent.stopSpeaking();
                  setIsNarrating(false);
                } else {
                  startMichaelPenPrologue(currentSlide);
                }
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition ${
                useMichaelPenFormat
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5e2a3] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
              title="¿Deseas aplicar el formato Michael Pen con pantalla atenuada y voz en off?"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">Formato Michael Pen:</span>
              <span>{useMichaelPenFormat ? 'Sí' : 'No'}</span>
            </button>

            {/* Fotovideo mode button */}
            <button
              type="button"
              onClick={() => setIsPhotoVideoMode(!isPhotoVideoMode)}
              className={`px-3 py-1.5 rounded-xl border text-xs flex items-center space-x-1.5 transition ${
                isPhotoVideoMode
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5e2a3] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
              title="Modo Fotovideo: Avance automático con narración"
            >
              <Film className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">Modo Fotovideo</span>
            </button>

            {/* Narrator Voice Button (Host Michael Pen) */}
            <button
              type="button"
              onClick={handleToggleNarration}
              className={`px-4 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
                isNarrating
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse'
                  : 'bg-[#d4af37] text-black border-[#d4af37] hover:bg-[#f5e2a3]'
              }`}
            >
              {isNarrating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isNarrating ? 'Pausar Narración' : 'Voz Michael Pen'}</span>
            </button>
          </div>
        </div>

        {/* Slide Canvas */}
        <div className="p-6 sm:p-10 space-y-8 bg-[#0c0d12]">
          
          {/* Active Voice Waveform Indicator */}
          {isNarrating && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs animate-in fade-in">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-serif-gold font-bold text-white">
                  Michael Pen narrando con voz humana pausada
                </span>
              </div>
              {activeSentence && (
                <p className="italic text-zinc-300 max-w-xl truncate text-[11px]">
                  "{activeSentence}"
                </p>
              )}
            </div>
          )}

          {/* Golden Slide Header: Titles */}
          <div className="space-y-2 border-b border-zinc-800/80 pb-5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5e2a3] uppercase">
                {activeBlock.title.split(':')[0]} • Lección {currentSlide.slideNumber}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif-gold text-white drop-shadow-md">
              {currentSlide.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-zinc-400 font-light max-w-3xl leading-relaxed">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Central High-Definition Illustrative Image (Widescreen 16:9 Landscape) */}
          <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] bg-black group">
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className={`w-full h-full object-cover object-center filter brightness-95 contrast-105 transition-all duration-700 ${
                isPhotoVideoMode ? 'scale-105' : 'group-hover:scale-102'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-zinc-700/80 text-[10px] text-zinc-300 font-mono">
              Ilustración Curricular Oficial • {activeBlock.title.split(':')[0]}
            </div>
          </div>

          {/* Master Educational Text (Cátedra de la Materia) */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span>Cátedra • Desarrollo de la Materia</span>
            </h4>
            <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed text-justify">
              {currentSlide.expandedText}
            </p>
          </div>

          {/* Bottom Navigation & Completion Evaluation Trigger */}
          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={handlePrevSlide}
                disabled={slideIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-black/60 hover:bg-zinc-800 text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                disabled={isLastSlide}
                className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-black/60 hover:bg-zinc-800 text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Slide Dots Picker */}
            <div className="flex items-center space-x-2 py-1">
              {activeBlock.slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    VoiceAgent.stopSpeaking();
                    setIsNarrating(false);
                    setSlideIndex(idx);
                  }}
                  className={`transition-all rounded-full cursor-pointer ${
                    slideIndex === idx
                      ? 'w-7 h-2 bg-[#d4af37] shadow-[0_0_10px_#d4af37]'
                      : 'w-2 h-2 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  title={`Diapositiva ${s.slideNumber}: ${s.title}`}
                />
              ))}
            </div>

            {/* If last slide, show Block Evaluation Trigger */}
            {isLastSlide && (
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-300">
                <button
                  type="button"
                  onClick={() => onTakeExam(activeBlock.id)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5e2a3] to-[#c5a059] text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Award className="w-4 h-4 text-black" />
                  <span>Realizar Evaluación del Bloque (Mínimo 4 de 5 Aciertos para Aprobar) →</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Botón de Escape hacia el Menú Inicial / Pantalla de Bienvenida (Justo debajo del marco dorado) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => {
            VoiceAgent.stopSpeaking();
            if (onBackToWelcome) {
              onBackToWelcome();
            }
          }}
          className="w-full sm:w-auto group inline-flex items-center justify-center space-x-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#14161f] via-[#1c1a12] to-[#14161f] hover:from-[#1e212f] hover:to-[#2b2414] border-2 border-[#d4af37]/60 hover:border-[#d4af37] text-[#f5e2a3] hover:text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] text-xs font-bold uppercase tracking-wider cursor-pointer"
          title="Regresar a la pantalla de bienvenida y menú inicial del ecosistema"
        >
          <Compass className="w-4 h-4 text-[#d4af37] group-hover:rotate-45 transition-transform duration-300" />
          <span>← Salir a la Pantalla de Bienvenida • Menú Inicial</span>
        </button>

        <span className="text-[11px] text-zinc-500 font-mono">
          Tu avance de cátedra se conserva seguro en la nube
        </span>
      </div>
    </div>
  );
};
