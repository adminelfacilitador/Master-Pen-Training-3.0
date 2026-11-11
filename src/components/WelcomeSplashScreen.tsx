import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, VolumeX, ArrowRight, ShieldCheck, Compass, Play } from 'lucide-react';
import { cloudState } from '../services/cloudState';
import { VoiceAgent } from '../services/voiceAgent';
import { MasterAudioArbiter } from '../services/audioArbiter';

interface WelcomeSplashScreenProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({
  isOpen,
  onComplete
}) => {
  const [branding, setBranding] = useState(cloudState.getBrandingImages());
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [audioBlockedByBrowser, setAudioBlockedByBrowser] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const hasSpokenRef = useRef(false);
  const hasFinishedRef = useRef(false);

  // Mensaje de saludo mejorado gramaticalmente con tono culto, solemne y hospitalario de Michael Pen
  const WELCOME_SPEECH_TEXT = 
    "Bienvenido a Master Pen Training. Es un auténtico honor recibirte. Disfruta del magnífico ecosistema de aprendizaje de Master Pen Studio Creations. Ingresa al panel de tu preferencia y, en breves instantes, estaré contigo.";

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setBranding(cloudState.getBrandingImages());
    });
    return () => unsub();
  }, []);

  // Iniciar la narrativa magistral de Michael Pen
  const playWelcomeSpeech = () => {
    if (isMuted) return;
    VoiceAgent.stopSpeaking(false);
    hasSpokenRef.current = true;
    setHasStartedAudio(true);
    setAudioBlockedByBrowser(false);

    try {
      VoiceAgent.speakMichaelPen(
        WELCOME_SPEECH_TEXT,
        () => {
          setHasStartedAudio(true);
        },
        () => {
          // Audio finalizado
        }
      );
    } catch (e) {
      console.warn('[WelcomeSplash] Error reproduciendo voz inicial:', e);
      setAudioBlockedByBrowser(true);
    }
  };

  // Temporizador exacto de 10 segundos antes de presentar la pantalla de login
  useEffect(() => {
    if (!isOpen) {
      hasFinishedRef.current = false;
      return;
    }

    hasFinishedRef.current = false;

    // Intentar reproducir el saludo de inmediato
    const audioTimer = setTimeout(() => {
      if (!hasSpokenRef.current) {
        playWelcomeSpeech();
      }
    }, 450);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(audioTimer);
      clearInterval(interval);
    };
  }, [isOpen]);

  // Transición segura fuera del render cycle cuando el temporizador alcanza cero
  useEffect(() => {
    if (isOpen && secondsRemaining === 0 && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      VoiceAgent.stopSpeaking(false);
      onComplete();
    }
  }, [secondsRemaining, isOpen, onComplete]);

  const handleFinishSplash = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    VoiceAgent.stopSpeaking(false);
    onComplete();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      setIsMuted(false);
      playWelcomeSpeech();
    } else {
      setIsMuted(true);
      VoiceAgent.stopSpeaking(false);
    }
  };

  if (!isOpen) return null;

  const progressPercentage = Math.min(100, Math.max(0, ((10 - secondsRemaining) / 10) * 100));

  return (
    <div 
      className="fixed inset-0 z-[9999999] bg-[#07080d] flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-500"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.12) 0%, rgba(12,14,20,0.85) 55%, #050609 100%)'
      }}
    >
      {/* Luces de fondo decorativas doradas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-[#c5a059]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Barra superior de control y distintivo */}
      <div className="w-full max-w-5xl flex items-center justify-between relative z-20">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#d4af37]/40 backdrop-blur-md shadow-lg">
          <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
          <span className="text-[11px] uppercase tracking-widest text-[#f5e2a3] font-bold font-mono">
            Campus Virtual Oficial • Master Pen
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-2.5 rounded-full bg-black/70 hover:bg-black text-[#f5e2a3] hover:text-white border border-[#d4af37]/40 transition shadow-lg flex items-center space-x-1.5 text-xs cursor-pointer"
            title={isMuted ? 'Activar voz de Michael Pen' : 'Silenciar voz'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#d4af37] animate-pulse" />}
            <span className="hidden sm:inline text-[11px] font-mono">{isMuted ? 'Silenciado' : 'Voz Activa'}</span>
          </button>

          <button
            type="button"
            onClick={handleFinishSplash}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37]/20 to-[#856524]/30 hover:from-[#d4af37] hover:to-[#c5a059] text-[#f5e2a3] hover:text-black border border-[#d4af37]/60 text-xs font-bold font-serif-gold tracking-wide transition shadow-lg flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Ir al Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ÁREA CENTRAL: Logotipo Completo Master Pen Training + Saludo de Michael Pen */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl px-4 relative z-20 my-auto space-y-7">
        
        {/* LOGOTIPO COMPLETO MASTER PEN TRAINING CON AROS CONCÉNTRICOS Y HALO DORADO */}
        <div className="relative group">
          {/* Anillos concéntricos animados de aura dorada */}
          <div className="absolute -inset-4 sm:-inset-6 rounded-full border border-[#d4af37]/30 animate-spin-slow pointer-events-none" />
          <div className="absolute -inset-8 sm:-inset-10 rounded-full border border-[#d4af37]/15 animate-reverse-spin pointer-events-none" />
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f7e7be] to-[#aa8329] opacity-75 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[#d4af37] shadow-[0_0_60px_rgba(212,175,55,0.65),0_0_100px_rgba(212,175,55,0.25)] bg-black flex items-center justify-center p-3">
            <img
              src={branding.trainingLogo}
              alt="Master Pen Training - Logotipo Oficial"
              className="w-full h-full object-contain filter contrast-110 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Título de Bienvenida e Identidad Institucional */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37]/15 via-[#c5a059]/20 to-[#856524]/15 border border-[#d4af37]/50 shadow-inner">
            <Sparkles className="w-4 h-4 text-[#d4af37] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f5e2a3] font-serif-gold">
              Master Pen Training
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif-gold text-white drop-shadow-md">
            Academia Digital & Cátedras Magistrales
          </h2>

          {/* Saludo gramaticalmente perfeccionado expresado por Michael Pen */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/70 border border-[#d4af37]/40 shadow-2xl backdrop-blur-md max-w-2xl mx-auto space-y-2.5">
            <div className="flex items-center justify-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-[#d4af37]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Voz Oficial de Michael Pen</span>
            </div>

            <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed italic font-serif">
              «{WELCOME_SPEECH_TEXT}»
            </p>
          </div>
        </div>

        {/* Notificación si el navegador requiere un clic del usuario para reproducir audio */}
        {(!hasStartedAudio || audioBlockedByBrowser) && (
          <button
            type="button"
            onClick={playWelcomeSpeech}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f7e7be] to-[#aa8329] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-105 transition flex items-center space-x-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Escuchar Saludo de Michael Pen</span>
          </button>
        )}

      </div>

      {/* BARRA INFERIOR: Temporizador de 10 segundos y progreso hacia la pantalla de login */}
      <div className="w-full max-w-xl relative z-20 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400 flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-[#d4af37] animate-spin-slow" />
            <span>Conectando con el Campus Académico...</span>
          </span>
          <span className="text-[#f5e2a3] font-bold">
            Ingresando al Login en <strong className="text-white text-sm">{secondsRemaining}s</strong>
          </span>
        </div>

        {/* Barra de progreso de 10 segundos con resplandor dorado */}
        <div className="w-full bg-zinc-900/90 h-2.5 rounded-full overflow-hidden border border-zinc-800 p-0.5 shadow-inner">
          <div 
            className="bg-gradient-to-r from-[#856524] via-[#d4af37] to-[#f7e7be] h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(212,175,55,0.7)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
          <span>Master Pen Studio Creations</span>
          <button
            type="button"
            onClick={handleFinishSplash}
            className="text-[#d4af37] hover:underline font-semibold cursor-pointer"
          >
            Omitir espera y acceder ahora →
          </button>
        </div>
      </div>
    </div>
  );
};
