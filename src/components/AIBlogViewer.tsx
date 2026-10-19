import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  Award, 
  Share2, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AI_CHRONICLES, AIChronicle } from '../data/aiChronicles';

interface AIBlogViewerProps {
  aiId: string;
  onBack: () => void;
  onSelectOtherAI: (id: string) => void;
}

export const AIBlogViewer: React.FC<AIBlogViewerProps> = ({ aiId, onBack, onSelectOtherAI }) => {
  const chronicle = AI_CHRONICLES.find((a) => a.id === aiId) || AI_CHRONICLES[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [aiId]);

  return (
    <article className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-black/60 hover:bg-[#d4af37] text-zinc-300 hover:text-black border border-zinc-700 hover:border-[#d4af37] transition text-xs font-semibold tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Ecosistema</span>
        </button>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e2a3] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Monografía Oficial • Master Pen Observatorio</span>
        </div>
      </div>

      {/* Main Presentation Container */}
      <div className="rounded-3xl overflow-hidden border-2 border-[#d4af37]/60 bg-[#0d0e15] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.2)]">
        
        {/* ========================================================================= */}
        {/* 1. FOTO DE PORTADA TIPO BANNER */}
        {/* ========================================================================= */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-black">
          <img
            src={chronicle.bannerImage}
            alt={`Banner de ${chronicle.name}`}
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-transparent to-black/40" />
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-zinc-700 text-zinc-200 text-xs font-mono flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Fundación: {chronicle.birthYear}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. LOGOTIPO A UN COSTADO ABAJO A LA IZQUIERDA DEL BANNER (FOTO DE PERFIL CON BORDE) */}
        {/* ========================================================================= */}
        <div className="relative px-6 sm:px-12 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            
            <div className="flex items-end space-x-5">
              {/* Profile Avatar with its own custom border */}
              <div 
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 bg-black shadow-2xl flex items-center justify-center p-1 shrink-0 transition-transform duration-300 hover:scale-105"
                style={{ borderColor: '#d4af37', boxShadow: '0 0 30px rgba(212, 175, 55, 0.45)' }}
              >
                <img
                  src={chronicle.logoImage}
                  alt={`Logotipo oficial de ${chronicle.name}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Title & Creator */}
              <div className="pb-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider border uppercase"
                    style={{ borderColor: chronicle.accentColor, color: chronicle.accentColor, backgroundColor: `${chronicle.accentColor}15` }}
                  >
                    {chronicle.badge}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    Nacimiento: {chronicle.birthYear}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif-gold text-white tracking-wide">
                  {chronicle.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#f5e2a3] font-medium">
                  Desarrollado por {chronicle.creator}
                </p>
              </div>
            </div>

            {/* Quick Share / Info Badge */}
            <div className="pb-2 flex items-center space-x-3">
              <span className="text-xs font-mono text-zinc-400 bg-black/60 px-3 py-1.5 rounded-lg border border-zinc-800">
                Crónica Monográfica
              </span>
            </div>
          </div>

          {/* Subtitle / Tagline Banner */}
          <div className="p-4 rounded-2xl bg-[#12141f] border border-[#c5a059]/40 mb-8">
            <p className="text-sm md:text-base text-zinc-200 font-serif-gold italic leading-relaxed text-center sm:text-left">
              "{chronicle.tagline}"
            </p>
          </div>

          {/* Main Chronicle Article Body */}
          <div className="space-y-10 text-zinc-300 text-sm sm:text-base leading-relaxed">
            
            {/* Section 1: Genesis Story */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold font-serif-gold text-[#f5e2a3] flex items-center space-x-2 border-b border-zinc-800 pb-2">
                <BookOpen className="w-5 h-5 text-[#d4af37]" />
                <span>1. El Génesis y Nacimiento de {chronicle.shortName}</span>
              </h2>
              {chronicle.genesisStory.map((paragraph, idx) => (
                <p key={idx} className="font-light text-zinc-200 leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </section>

            {/* Section 2: Architectural Breakthroughs */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold font-serif-gold text-[#f5e2a3] flex items-center space-x-2 border-b border-zinc-800 pb-2">
                <Cpu className="w-5 h-5 text-[#d4af37]" />
                <span>2. Innovaciones y Rupturas Arquitectónicas</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {chronicle.architecturalBreakthroughs.map((item, idx) => {
                  const [title, desc] = item.split(': ');
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-[#0a0b10] border border-zinc-800 space-y-2">
                      <p className="text-xs font-bold text-[#d4af37] font-mono uppercase">
                        {title}
                      </p>
                      <p className="text-xs text-zinc-300 font-light leading-relaxed">
                        {desc || title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 3: Impact on Authors & Literature */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold font-serif-gold text-[#f5e2a3] flex items-center space-x-2 border-b border-zinc-800 pb-2">
                <Award className="w-5 h-5 text-[#d4af37]" />
                <span>3. Trascendencia para Escritores y el Oficio Literario</span>
              </h2>
              <div className="space-y-3">
                {chronicle.impactOnAuthors.map((impact, idx) => {
                  const [title, desc] = impact.split(': ');
                  return (
                    <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl bg-black/40 border border-zinc-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white text-xs sm:text-sm font-semibold">{title}: </strong>
                        <span className="text-zinc-300 text-xs sm:text-sm font-light">{desc || title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 4: Milestones Timeline */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold font-serif-gold text-[#f5e2a3] flex items-center space-x-2 border-b border-zinc-800 pb-2">
                <Clock className="w-5 h-5 text-[#d4af37]" />
                <span>4. Cronología y Grandes Hitos</span>
              </h2>
              <div className="relative pl-6 border-l-2 border-[#d4af37]/40 space-y-6">
                {chronicle.keyMilestones.map((ms, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#d4af37] border-4 border-[#0d0e15] shadow-[0_0_10px_#d4af37]" />
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                        {ms.date}
                      </span>
                      <h4 className="text-sm font-bold text-white font-serif-gold">
                        {ms.title}
                      </h4>
                      <p className="text-xs text-zinc-300 font-light">
                        {ms.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: Philosophical Verdict */}
            <section className="p-6 rounded-2xl bg-gradient-to-r from-[#171926] via-[#10121a] to-[#171926] border-2 border-[#d4af37]/50 text-center space-y-3 shadow-xl">
              <span className="text-[11px] font-mono text-[#c5a059] uppercase tracking-widest font-semibold">
                Veredicto Epistemológico • Master Pen Training
              </span>
              <p className="text-sm sm:text-base text-zinc-100 font-serif-gold italic max-w-2xl mx-auto leading-relaxed">
                "{chronicle.philosophicalVerdict}"
              </p>
            </section>

          </div>

          {/* Bottom Switcher: Explore Other AIs */}
          <div className="mt-12 pt-8 border-t border-zinc-800 space-y-4">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-[#c5a059] uppercase tracking-wider">
              Explorar otras crónicas del observatorio:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AI_CHRONICLES.filter(a => a.id !== chronicle.id).slice(0, 4).map((other) => (
                <button
                  key={other.id}
                  type="button"
                  onClick={() => onSelectOtherAI(other.id)}
                  className="p-3 rounded-xl bg-black/60 hover:bg-[#1a1c28] border border-zinc-800 hover:border-[#d4af37] transition text-left space-y-1 group cursor-pointer"
                >
                  <p className="text-xs font-bold text-zinc-200 group-hover:text-[#f5e2a3] flex items-center justify-between">
                    <span>{other.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#d4af37]" />
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Nacimiento {other.birthYear}
                  </p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </article>
  );
};
