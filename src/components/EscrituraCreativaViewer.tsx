import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  Layers, 
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../types';
import { 
  ESCRITURA_CREATIVA_CONFIG_M1, 
  ESCRITURA_CREATIVA_M1_SLIDES 
} from '../data/escrituraCreativaCourse';
import { AssessmentEngineV1 } from '../services/assessmentEngineV1';
import { ActiveV1Session, ModuleProgressState, ClientAssessmentItem } from '../types/assessmentSchemaV1';
import { VoiceAgent } from '../services/voiceAgent';

interface EscrituraCreativaViewerProps {
  currentUser: UserProfile | null;
  onBackToCourses: () => void;
}

export const EscrituraCreativaViewer: React.FC<EscrituraCreativaViewerProps> = ({
  currentUser,
  onBackToCourses
}) => {
  const userId = currentUser?.uid || 'guest_user';
  const [progress, setProgress] = useState<ModuleProgressState>(() => 
    AssessmentEngineV1.getModuleProgress(userId, 'M1')
  );

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  // Assessment Modal / Mode state
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<ActiveV1Session | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [examResult, setExamResult] = useState<{
    passed: boolean;
    score: number;
    points: number;
    total_items: number;
    result_summary: string;
    review_pointers: string[];
    cooldown_hours_remaining?: number;
  } | null>(null);

  // Initialize module state on mount: AVAILABLE -> IN_PROGRESS
  useEffect(() => {
    const updated = AssessmentEngineV1.openModule(userId, 'M1');
    setProgress(updated);
  }, [userId]);

  const slides = ESCRITURA_CREATIVA_M1_SLIDES;
  const currentSlide = slides[currentSlideIndex];

  // Stop speaking when slide changes or unmounts
  useEffect(() => {
    VoiceAgent.stopSpeaking();
    setIsSpeaking(false);
    return () => {
      VoiceAgent.stopSpeaking();
    };
  }, [currentSlideIndex]);

  const handleToggleNarration = () => {
    if (isSpeaking) {
      VoiceAgent.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      VoiceAgent.speakMichaelPen(
        currentSlide.michaelPenNarration,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const handleMarkSlideCompleted = () => {
    const updated = AssessmentEngineV1.markSlideCompleted(userId, currentSlide.id, 'M1');
    setProgress(updated);
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handleStartExam = () => {
    setAssessmentError(null);
    setExamResult(null);
    setUserAnswers({});

    const res = AssessmentEngineV1.startAssessmentSession(userId, 'M1');
    if (res.error) {
      setAssessmentError(res.error);
      return;
    }

    setCurrentSession(res.session);
    setIsExamActive(true);

    VoiceAgent.stopSpeaking();
    VoiceAgent.speakMichaelPen(
      `Bienvenido a la evaluación oficial del Módulo 1 de Escritura Creativa. Se han seleccionado diez reactivos estratificados según el esquema oficial. Se requiere un ochenta por ciento para acreditar. Mucho éxito.`,
      () => {},
      () => {}
    );
  };

  const handleSelectAnswer = (itemId: string, optionId: string) => {
    if (examResult) return;
    setUserAnswers(prev => ({
      ...prev,
      [itemId]: optionId
    }));
  };

  const handleSubmitExam = () => {
    if (!currentSession) return;
    try {
      const res = AssessmentEngineV1.submitAssessment(userId, currentSession.session_id, userAnswers);
      setExamResult(res);
      const updated = AssessmentEngineV1.getModuleProgress(userId, 'M1');
      setProgress(updated);

      if (res.passed) {
        VoiceAgent.speakMichaelPen(
          `¡Enhorabuena! Has aprobado la evaluación con ${res.points} de ${res.total_items} puntos. El Módulo 1 ha sido acreditado exitosamente.`,
          () => {},
          () => {}
        );
      } else {
        VoiceAgent.speakMichaelPen(
          `Evaluación no superada. Has obtenido ${res.points} de ${res.total_items} puntos. Revisa los punteros de estudio y las diapositivas indicadas antes de realizar tu siguiente intento.`,
          () => {},
          () => {}
        );
      }
    } catch (e: any) {
      setAssessmentError(e.message || 'Error al procesar la evaluación.');
    }
  };

  const isAllAnswered = currentSession 
    ? currentSession.client_items.every(item => !!userAnswers[item.item_id])
    : false;

  const getStatusBadge = () => {
    switch (progress.state) {
      case 'PASSED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Acreditado (PASSED)</span>;
      case 'ASSESSMENT_PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Listo para Evaluación</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> En Progreso</span>;
      case 'AVAILABLE':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-700/50 text-zinc-300 border border-zinc-600 flex items-center gap-1.5">Disponible</span>;
      case 'LOCKED':
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5">Bloqueado</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1118] border border-[#d4af37]/30 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCourses}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[#d4af37] transition flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            title="Volver al Catálogo de Cursos"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif-gold text-white tracking-wide">
                Escritura Creativa - Por: Anthony Small
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Módulo 1: Captura, Disparadores y Sistema de Ideas • Regla de Fricción Cero y Registro de 4 Campos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <button
            onClick={handleStartExam}
            disabled={progress.cooldown_until ? Date.now() < progress.cooldown_until : false}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-lg ${
              progress.state === 'PASSED'
                ? 'bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300'
                : 'bg-gradient-to-r from-[#d4af37] to-[#aa8329] hover:brightness-110 text-black'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{progress.state === 'PASSED' ? 'Revisar Evaluación' : 'Realizar Evaluación M1'}</span>
          </button>
        </div>
      </div>

      {/* Review Required Warning Banner */}
      {progress.requires_review && !isExamActive && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs flex items-start gap-3 shadow-lg animate-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Revisión Pedagógica Obligatoria Antes del Reintento</p>
            <p className="text-amber-300/80 leading-relaxed">
              Tu intento anterior no alcanzó el umbral mínimo del 80%. Para habilitar el reintento, repasa con atención las diapositivas y los axiomas indicados en los punteros de estudio.
            </p>
            {progress.last_review_pointers && progress.last_review_pointers.length > 0 && (
              <div className="mt-2 pt-2 border-t border-amber-800/40 space-y-1">
                <span className="font-semibold text-amber-400">Punteros de estudio prioritarios:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90">
                  {progress.last_review_pointers.slice(0, 3).map((ptr, idx) => (
                    <li key={idx}>{ptr}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cooldown Active Banner */}
      {progress.cooldown_until && Date.now() < progress.cooldown_until && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-600/50 text-red-200 text-xs flex items-start gap-3 shadow-lg">
          <Clock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Período de Enfriamiento de 24 Horas Activo</p>
            <p className="text-red-300/80 leading-relaxed">
              Has alcanzado el límite de 3 intentos permitidos para el Módulo 1. Conforme a las directrices de Anthony Small, el sistema impone un reposo de 24 horas para decantar los conceptos.
            </p>
          </div>
        </div>
      )}

      {/* SLIDE VIEWER SECTION */}
      {!isExamActive && (
        <div className="bg-[#0f1118] border border-[#d4af37]/30 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Slide Sub-Header & Selector */}
          <div className="px-6 py-4 bg-[#141722] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Diapositiva {currentSlide.slideNumber} de {slides.length}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-[#d4af37] font-medium">
                {currentSlide.thematicGroup}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleNarration}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 animate-pulse'
                    : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300'
                }`}
                title="Escuchar locución oficial de Michael Pen (Anfitrión de Master Pen Training)"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Pausar Narrador' : 'Locución Maestro Michael Pen'}</span>
              </button>
            </div>
          </div>

          {/* Slide Content Grid */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] group">
                <img 
                  src={currentSlide.imageUrl} 
                  alt={currentSlide.title} 
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                    Lección Fundamental {currentSlide.slideNumber}
                  </span>
                  <h4 className="text-base font-bold text-white font-serif-gold">
                    {currentSlide.title}
                  </h4>
                </div>
              </div>

              {/* Key Axiom Card */}
              <div className="p-4 rounded-xl bg-[#141724] border border-[#d4af37]/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Axioma Maestro de Anthony Small</span>
                </div>
                <p className="text-xs text-zinc-300 italic font-serif leading-relaxed">
                  "{currentSlide.keyAxiom}"
                </p>
              </div>

              {/* Writing Exercise */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Ejercicio Práctico en Libreta
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {currentSlide.writingExercise}
                </p>
              </div>
            </div>

            {/* Exposition & Pedagogical Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  {currentSlide.subtitle}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold font-serif-gold text-white mt-1">
                  {currentSlide.title}
                </h3>
              </div>

              <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed space-y-4">
                <p className="text-justify font-sans">
                  {currentSlide.expandedText}
                </p>
              </div>

              {/* Narrator Card Quote */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#171a26] to-[#12131d] border-l-4 border-[#d4af37] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f5e2a3] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                    Locución Oficial: Michael Pen (Anfitrión de la Academia)
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Cadencia Humana • Barítono Solemne
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{currentSlide.michaelPenNarration}"
                </p>
              </div>

              {/* Slide Navigation Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-3 h-3 rounded-full transition ${
                        idx === currentSlideIndex 
                          ? 'bg-[#d4af37] scale-125 shadow-[0_0_8px_#d4af37]' 
                          : progress.completed_slides.includes(slides[idx].id)
                            ? 'bg-emerald-500/80'
                            : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                      title={`Ir a Diapositiva ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleMarkSlideCompleted}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#967425] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{currentSlideIndex === slides.length - 1 ? 'Finalizar Lecciones' : 'Siguiente'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ASSESSMENT MODAL / SCREEN */}
      {isExamActive && currentSession && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#0f1118] border-2 border-[#d4af37]/50 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-xl font-bold font-serif-gold text-white">
                  Evaluación Oficial Módulo 1 • Escritura Creativa - Por: Anthony Small
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                10 reactivos seleccionados dinámicamente sin reemplazo (1 por cada grupo temático + 3 adicionales). Umbral mínimo de aprobación: 80% (8/10).
              </p>
            </div>

            <button
              onClick={() => setIsExamActive(false)}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Cerrar y Volver a Slides
            </button>
          </div>

          {assessmentError && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-600/50 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{assessmentError}</span>
            </div>
          )}

          {/* Exam Result Display */}
          {examResult && (
            <div className={`p-6 rounded-2xl border ${
              examResult.passed 
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' 
                : 'bg-red-950/30 border-red-500/50 text-red-200'
            } space-y-4 animate-in zoom-in-95`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {examResult.passed ? (
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold font-serif-gold text-white">
                      {examResult.passed ? '¡Acreditación Aprobada con Honores!' : 'Evaluación No Aprobada'}
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Puntuación obtenida: <strong className="text-white">{examResult.points} / {examResult.total_items}</strong> ({Math.round(examResult.score * 100)}%) • Umbral requerido: 80%
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-zinc-400">
                    Intento {progress.attempts.length} de {ESCRITURA_CREATIVA_CONFIG_M1.attempts.max_before_cooldown}
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-zinc-200">
                {examResult.result_summary}
              </p>

              {/* Review Pointers if failed */}
              {!examResult.passed && examResult.review_pointers.length > 0 && (
                <div className="pt-3 border-t border-red-800/40 space-y-2">
                  <h5 className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Punteros de Estudio Sugeridos por Anthony Small</span>
                  </h5>
                  <ul className="space-y-1">
                    {examResult.review_pointers.map((ptr, idx) => (
                      <li key={idx} className="text-xs text-red-200/90 bg-red-950/50 p-2 rounded-lg border border-red-900/30">
                        {ptr}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                {!examResult.passed && (
                  <button
                    onClick={handleStartExam}
                    disabled={progress.cooldown_until ? Date.now() < progress.cooldown_until : false}
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Intentar Nuevamente</span>
                  </button>
                )}
                <button
                  onClick={() => setIsExamActive(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#967425] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Volver a las Diapositivas
                </button>
              </div>
            </div>
          )}

          {/* Question List */}
          {!examResult && (
            <div className="space-y-8">
              {currentSession.client_items.map((item, qIdx) => (
                <div 
                  key={item.item_id}
                  className="p-5 rounded-2xl bg-[#141622] border border-zinc-800 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                      Reactivo {qIdx + 1} de {currentSession.client_items.length} • {item.group}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      ID: {item.item_id}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {item.stem}
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {item.options.map(opt => {
                      const isSelected = userAnswers[item.item_id] === opt.option_id;
                      return (
                        <button
                          key={opt.option_id}
                          onClick={() => handleSelectAnswer(item.item_id, opt.option_id)}
                          className={`p-3.5 rounded-xl text-left text-xs transition flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-[#d4af37]/20 border-2 border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                              : 'bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-zinc-300'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? 'bg-[#d4af37] text-black' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {opt.label}
                          </span>
                          <span className="mt-0.5 leading-relaxed">
                            {opt.option_text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Submit Button */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {Object.keys(userAnswers).length} de {currentSession.client_items.length} respondidas
                </span>

                <button
                  onClick={handleSubmitExam}
                  disabled={!isAllAnswered}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8329] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-xl flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Calificar y Enviar Evaluación</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
