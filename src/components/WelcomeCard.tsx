import React, { useState, useEffect } from 'react';
import { Feather, Award, Shield, Sparkles, CheckCircle2, Camera, Bot } from 'lucide-react';
import { UserProfile } from '../types';
import { BRANDING } from '../assets/branding';
import { cloudState } from '../services/cloudState';

interface WelcomeCardProps {
  currentUser: UserProfile | null;
  onExploreCourse: () => void;
  onTakeExam?: () => void;
  onOpenImageModal?: () => void;
  onOpenAgentModal?: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  currentUser,
  onExploreCourse,
  onTakeExam,
  onOpenImageModal,
  onOpenAgentModal
}) => {
  const [brandingImages, setBrandingImages] = useState(cloudState.getBrandingImages());

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setBrandingImages(cloudState.getBrandingImages());
    });
    return () => unsub();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#c5a059]/40 bg-gradient-to-br from-[#121318] via-[#0d0e12] to-[#161820] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8),0_0_1px_1px_rgba(212,175,55,0.25)] p-6 md:p-8 mb-8">
      
      {/* Background ambient gold ray illumination */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#856524]/10 rounded-full blur-2xl pointer-events-none -z-0" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Michael Pen Official Oil Painting Portrait */}
        <div className="lg:col-span-4 flex flex-col items-center text-center">
          <div className="relative group">
            {/* Glowing gold border ring */}
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
            
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden border-2 border-[#d4af37] bg-black shadow-2xl">
              <img 
                src={brandingImages.portrait} 
                alt="Michael Pen - Anfitrión Absoluto" 
                className="w-full h-full object-cover object-top filter contrast-110 saturate-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-2 inset-x-2 text-center bg-black/60 backdrop-blur-sm py-1 px-2 rounded border border-[#d4af37]/30">
                <p className="text-[11px] font-bold text-[#f5e2a3] tracking-widest uppercase font-serif-gold">
                  {BRANDING.hostName}
                </p>
                <p className="text-[9px] text-[#c5a059] tracking-wider uppercase">
                  Anfitrión y Master Mentor
                </p>
              </div>

              {onOpenImageModal && (
                <button
                  onClick={onOpenImageModal}
                  title="Cambiar foto de anfitrión desde PC o Celular"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition opacity-80 hover:opacity-100"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2 text-xs text-[#c5a059]">
            <Feather className="w-3.5 h-3.5" />
            <span className="font-serif-gold tracking-widest text-[11px] uppercase">
              Doctrina de la Pluma Maestra
            </span>
          </div>
        </div>

        {/* Welcome Message & Institutional Statement */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e2a3]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Ficha Oficial de Bienvenida</span>
            </span>

            {currentUser && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/80 border border-zinc-700 text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Sesión: {currentUser.displayName}</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif-gold text-white leading-tight">
            «Las palabras ordinarias se desvanecen; <br className="hidden sm:inline" />
            <span className="gold-gradient-text">la sentencia magistral gobierna el destino.»</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-light">
            Te doy la bienvenida al santuario intelectual de <strong className="text-[#f5e2a3] font-semibold">Master Pen Training</strong>. 
            Aquí no formamos escribientes; esculpimos líderes con la capacidad de articular tesis inquebrantables, gobernar el tempo cognitivo de sus audiencias y proyectar una autoridad irrevocable en cada renglón.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2 border-y border-[#c5a059]/20">
            <div className="flex items-center space-x-2 text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Plataforma Académica Oficial</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Evaluaciones Dinámicas Curriculares</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Certificación Oficial de Honor</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreCourse}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#b3882a] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center space-x-2"
            >
              <span>Acceder al Aula y Reproducción</span>
              <Award className="w-4 h-4" />
            </button>

            {onTakeExam && (
              <button
                onClick={onTakeExam}
                className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[#f5e2a3] border border-[#c5a059]/50 font-semibold text-xs uppercase tracking-wider transition-all flex items-center space-x-2"
              >
                <span>Rendir Evaluación Activa</span>
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
              </button>
            )}

            {onOpenAgentModal && (
              <button
                onClick={onOpenAgentModal}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#1c180e] to-[#2b220e] hover:from-[#2a2414] hover:to-[#3b2f15] text-[#f5e2a3] border border-[#d4af37]/70 font-semibold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
              >
                <Bot className="w-4 h-4 text-[#d4af37] animate-pulse" />
                <span>Consultar al Mentor (Voz & IA)</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
