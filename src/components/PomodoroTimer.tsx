import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Coffee, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Flame,
  Award
} from 'lucide-react';

export type PomodoroMode = 'focus' | 'short_break' | 'long_break';

interface PomodoroTimerProps {
  className?: string;
  defaultMode?: PomodoroMode;
  onSessionComplete?: (sessionsCompleted: number) => void;
}

const MODE_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,       // 25 minutes (Lectura de Alta Concentración)
  short_break: 5 * 60,  // 5 minutes (Pausa Breve)
  long_break: 15 * 60   // 15 minutes (Pausa Larga)
};

const MODE_LABELS: Record<PomodoroMode, { title: string; subtitle: string; icon: React.FC<{ className?: string }> }> = {
  focus: {
    title: 'Bloque de Enfoque Intelectual',
    subtitle: '25 min de lectura y asimilación profunda',
    icon: BookOpen
  },
  short_break: {
    title: 'Pausa Breve de Reflexión',
    subtitle: '5 min de descanso y desconexión',
    icon: Coffee
  },
  long_break: {
    title: 'Pausa Larga de Restauración',
    subtitle: '15 min de recuperación cognitiva',
    icon: Sparkles
  }
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  className = '',
  defaultMode = 'focus',
  onSessionComplete 
}) => {
  const [mode, setMode] = useState<PomodoroMode>(defaultMode);
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS[defaultMode]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play soft chime sound using Web Audio API synthesizer (no external audio assets required)
  const playChime = () => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playNote = (frequency: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
        
        gain.gain.setValueAtTime(0.001, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
      };

      // Gentle celebratory academic chime: E5, G#5, B5, E6
      playNote(659.25, 0, 0.4);
      playNote(830.61, 0.2, 0.45);
      playNote(987.77, 0.4, 0.5);
      playNote(1318.51, 0.6, 0.8);
    } catch (_) {}
  };

  // Timer countdown engine
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            playChime();

            if (mode === 'focus') {
              const newCount = completedSessions + 1;
              setCompletedSessions(newCount);
              setStreakCount((s) => s + 1);
              if (onSessionComplete) onSessionComplete(newCount);
              // Auto-advance to short break or long break every 4 sessions
              if (newCount % 4 === 0) {
                setMode('long_break');
                return MODE_DURATIONS.long_break;
              } else {
                setMode('short_break');
                return MODE_DURATIONS.short_break;
              }
            } else {
              setMode('focus');
              return MODE_DURATIONS.focus;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, completedSessions, isMuted, onSessionComplete]);

  const handleSelectMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  const handleTogglePlay = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const adjustMinutes = (delta: number) => {
    if (isRunning) return;
    setTimeLeft((prev) => Math.max(60, Math.min(60 * 90, prev + delta * 60)));
  };

  const totalDuration = MODE_DURATIONS[mode];
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const CurrentIcon = MODE_LABELS[mode].icon;

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border border-[#c5a059]/40 bg-gradient-to-r from-[#14151e] via-[#0f1016] to-[#161824] shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.12)] transition-all ${className}`}
    >
      {/* Subtle top gold illumination highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
      
      {/* Background ambient radial glow when running */}
      {isRunning && (
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
      )}

      {/* Main Header / Mini Bar */}
      <div className="px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Side: Status & Mode Title */}
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
            mode === 'focus' 
              ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#f5e2a3] shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
              : 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
          }`}>
            <CurrentIcon className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                Técnica Pomodoro de Estudio
              </span>
              {isRunning ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f5e2a3] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <span>En progreso</span>
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-zinc-800 border border-zinc-700 text-zinc-400">
                  Pausado
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-serif-gold text-white flex items-center space-x-1.5">
              <span>{MODE_LABELS[mode].title}</span>
            </h4>
          </div>
        </div>

        {/* Center / Right: Big Digital Timer & Quick Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4 ml-auto">
          
          {/* Big Monospace Digits */}
          <div className="text-right">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#f5e2a3] to-[#d4af37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]">
              {formattedTime}
            </span>
          </div>

          {/* Quick Play/Pause Action Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            title={isRunning ? 'Pausar bloque' : 'Iniciar bloque de lectura (25 min)'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shadow-lg cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50'
                : 'bg-gradient-to-r from-[#d4af37] to-[#b3882a] text-black hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            title="Reiniciar contador"
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-[#f5e2a3] transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Activar campana de finalización' : 'Silenciar campana'}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-[#f5e2a3] transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Minimizar panel' : 'Expandir controles y modos'}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            mode === 'focus'
              ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] shadow-[0_0_10px_#d4af37]'
              : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_#10b981]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="px-4 py-3 sm:px-5 bg-black/40 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Mode Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectMode('focus')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 cursor-pointer ${
                mode === 'focus'
                  ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#f5e2a3] font-bold'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Lectura 25m</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('short_break')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 cursor-pointer ${
                mode === 'short_break'
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-emerald-400" />
              <span>Descanso 5m</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('long_break')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 cursor-pointer ${
                mode === 'long_break'
                  ? 'bg-purple-500/20 border border-purple-500 text-purple-300 font-bold'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Restauración 15m</span>
            </button>

            {/* Quick Adjustment Buttons */}
            {!isRunning && (
              <div className="hidden sm:flex items-center space-x-1 ml-2 pl-2 border-l border-zinc-800">
                <button
                  type="button"
                  onClick={() => adjustMinutes(-1)}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-[10px] font-mono cursor-pointer"
                  title="Restar 1 minuto"
                >
                  -1m
                </button>
                <button
                  type="button"
                  onClick={() => adjustMinutes(1)}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-[10px] font-mono cursor-pointer"
                  title="Sumar 1 minuto"
                >
                  +1m
                </button>
              </div>
            )}
          </div>

          {/* Academic Session Stats & Badges */}
          <div className="flex items-center space-x-3 text-zinc-400 text-[11px]">
            <div className="flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Racha: <strong className="text-white font-mono">{streakCount}</strong></span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Completados: <strong className="text-[#f5e2a3] font-mono">{completedSessions}</strong></span>
            </div>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="hidden md:inline text-zinc-500 text-[10px]">
              {mode === 'focus' ? 'Foco en retórica y asimilación' : 'Relaja la vista y respira'}
            </span>
          </div>

        </div>
      )}
    </div>
  );
};
