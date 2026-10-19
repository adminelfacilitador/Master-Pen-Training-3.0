import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  BookOpen, 
  Layers, 
  Cpu, 
  Globe, 
  Award,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AI_CHRONICLES, AIChronicle } from '../data/aiChronicles';

interface AISlideshowBannerProps {
  onSelectAI: (aiId: string) => void;
}

export const AISlideshowBanner: React.FC<AISlideshowBannerProps> = ({ onSelectAI }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeAI = AI_CHRONICLES[currentIndex] || AI_CHRONICLES[0];

  // Auto-advance slideshow every 6 seconds when not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AI_CHRONICLES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + AI_CHRONICLES.length) % AI_CHRONICLES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % AI_CHRONICLES.length);
  };

  return (
    <section 
      className="relative rounded-3xl overflow-hidden border-2 border-[#d4af37]/60 bg-gradient-to-b from-[#12141f] via-[#0d0e15] to-[#08090d] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.2)] transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Pre-header Badge */}
      <div className="px-6 py-3 bg-[#0a0b10] border-b border-[#c5a059]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse shadow-[0_0_10px_#d4af37]" />
          <span className="font-serif-gold font-bold text-[#f5e2a3] tracking-wider uppercase text-[11px] sm:text-xs">
            Observatorio Tecnológico Master Pen Training • Crónicas de la Inteligencia Artificial
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-zinc-400 font-mono">
          <span className="text-[#c5a059]">8 Arquitecturas Fundacionales</span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-300">Génesis, Creación & Literatura</span>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[460px] flex items-center overflow-hidden">
        
        {/* Background Banner with Dynamic Transition */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeAI.bannerImage}
            alt={activeAI.name}
            className="w-full h-full object-cover object-center filter brightness-90 contrast-110 scale-105 transition-all duration-1000 ease-out"
          />
          {/* Deep cinematic overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-black/40 to-transparent z-10" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-8 md:py-12">
          <div className="max-w-2xl space-y-4">
            
            {/* Badges: AI Name & Creation Year */}
            <div className="flex flex-wrap items-center gap-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider border shadow-md uppercase"
                style={{ 
                  backgroundColor: `${activeAI.accentColor}25`, 
                  borderColor: activeAI.accentColor,
                  color: '#ffffff'
                }}
              >
                {activeAI.badge}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 border border-zinc-700 text-zinc-300 flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-[#d4af37]" />
                <span>Nacimiento: {activeAI.birthYear}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 border border-zinc-700 text-zinc-300 hidden sm:inline">
                {activeAI.creator}
              </span>
            </div>

            {/* AI Title with Golden Accents */}
            <div className="space-y-1.5">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif-gold text-white tracking-tight drop-shadow-lg">
                {activeAI.name}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#f5e2a3] font-medium leading-snug max-w-xl">
                {activeAI.tagline}
              </p>
            </div>

            {/* AI Summary */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light line-clamp-3 md:line-clamp-4 max-w-xl bg-black/40 backdrop-blur-sm p-3.5 rounded-xl border border-zinc-800">
              {activeAI.summary}
            </p>

            {/* Direct Action Button: Open Internal Blog Page */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectAI(activeAI.id)}
                className="group inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] text-black font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-black" />
                <span>Leer Crónica: El Nacimiento de {activeAI.shortName}</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                Página {currentIndex + 1} de {AI_CHRONICLES.length}
              </span>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Anterior IA"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-zinc-700 hover:border-[#d4af37] transition shadow-xl"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente IA"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-zinc-700 hover:border-[#d4af37] transition shadow-xl"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Bottom Selector Strip for all 8 AIs */}
      <div className="bg-[#090a0f] p-3 sm:p-4 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] text-[#c5a059] font-mono uppercase tracking-wider">
            Selecciona una IA para acceder a su monografía histórica:
          </p>
          <div className="flex space-x-1.5">
            {AI_CHRONICLES.map((ai, idx) => (
              <button
                key={ai.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-[#d4af37]' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
                title={ai.name}
              />
            ))}
          </div>
        </div>

        {/* Horizontal scrollable pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {AI_CHRONICLES.map((ai, idx) => {
            const isSelected = currentIndex === idx;
            return (
              <button
                key={ai.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  onSelectAI(ai.id);
                }}
                className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1a1c28] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)] -translate-y-0.5'
                    : 'bg-black/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                }`}
              >
                <div 
                  className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-zinc-700 flex items-center justify-center p-0.5 bg-black"
                  style={{ borderColor: isSelected ? '#d4af37' : undefined }}
                >
                  <img src={ai.logoImage} alt={ai.shortName} className="w-full h-full object-cover rounded-md" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#f5e2a3]' : 'text-zinc-200'}`}>
                    {ai.shortName}
                  </p>
                  <p className="text-[9px] text-zinc-400 font-mono truncate">
                    {ai.birthYear}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
