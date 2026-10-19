import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RefreshCcw,
  BookOpen,
  Lock,
  AlertCircle,
  Sparkles,
  Play
} from 'lucide-react';
import { OptionLetter, PsychometricRole, UserProfile } from '../types';
import { cloudState } from '../services/cloudState';
import { AntiCheatEngine, ActiveExamSession } from '../services/antiCheatEngine';
import { VoiceAgent } from '../services/voiceAgent';

interface ExamEngineProps {
  currentUser: UserProfile | null;
  defaultBlockId?: string;
  onBlockPassed: (blockId: string) => void;
  onGoToCertificate: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  currentUser,
  defaultBlockId = 'block_01',
  onBlockPassed,
  onGoToCertificate
}) => {
  const blocks = cloudState.getBlocks();
  const [selectedBlockId, setSelectedBlockId] = useState<string>(defaultBlockId);
  const [session, setSession] = useState<ActiveExamSession | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, OptionLetter>>({});
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [isPrologueDimmed, setIsPrologueDimmed] = useState<boolean>(true);
  const branding = cloudState.getBrandingImages();

  // Initialize or re-roll exam session
  const initializeExam = (blockId: string) => {
    // 5 dynamic questions per block (min 4/5 = 80% to pass)
    const newSession = AntiCheatEngine.generateExamSession(blockId, 5);
    setSession(newSession);
    setUserAnswers({});
    setEvaluationResult(null);
    setIsPrologueDimmed(true);

    const blk = cloudState.getBlockById(blockId);
    VoiceAgent.stopSpeaking();
    VoiceAgent.speakMichaelPen(
      `Bienvenido a la evaluación oficial del ${blk?.title || 'Bloque Curricular'}. Se requiere responder correctamente al menos 4 de las 5 preguntas para habilitar el siguiente bloque. Procede con serenidad y rigor intelectual.`,
      () => {},
      () => {
        setIsPrologueDimmed(false);
      }
    );
  };

  useEffect(() => {
    initializeExam(selectedBlockId);
    return () => {
      VoiceAgent.stopSpeaking();
    };
  }, [selectedBlockId]);

  if (!session) return null;

  const currentBlock = cloudState.getBlockById(selectedBlockId);
  const allAnswered = session.questions.every(q => !!userAnswers[q.id]);

  const handleSelectOption = (questionId: string, letter: OptionLetter) => {
    if (evaluationResult) return; // prevent edit after submission
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: letter
    }));
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !currentUser) return;

    const baseResult = AntiCheatEngine.evaluateExam(session, userAnswers);
    // Persist with authoritative minimum 4/5 rule in cloudState
    const recorded = cloudState.recordBlockEvaluation(
      currentUser.uid, 
      session.blockId, 
      baseResult.correctCount, 
      session.questions.length
    );

    setEvaluationResult({
      ...baseResult,
      ...recorded
    });

    if (recorded.passed) {
      onBlockPassed(session.blockId);
    }
  };

  const handleRetryExam = () => {
    initializeExam(selectedBlockId);
  };

  const handleBlockSelect = (blockId: string, blockNum: number) => {
    const isLocked = cloudState.isBlockLocked(blockId);
    if (isLocked) {
      setLockedNotice(`El Bloque ${blockNum} se encuentra bloqueado. Debes superar la Evaluación del Bloque ${blockNum - 1} con al menos 4 de las 5 preguntas correctas para habilitarlo.`);
      setTimeout(() => setLockedNotice(null), 5000);
      return;
    }
    setLockedNotice(null);
    setSelectedBlockId(blockId);
  };

  const isCourseComplete = currentUser ? cloudState.hasUserCompletedCourse(currentUser.uid) : false;
  const courseDecision = currentUser ? cloudState.getUserAcademicDecision(currentUser.uid) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 relative">
      
      {/* PANTALLA ATENUADA (FORMATO MICHAEL PEN PARA LA EVALUACIÓN) */}
      {isPrologueDimmed && (
        <div className="absolute inset-0 z-30 bg-black/92 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-300 min-h-[500px]">
          <div className="relative group">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.6)] bg-black">
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
              <span>Instrucción Magistral • Michael Pen</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-gold text-white">
              Evaluación del {currentBlock?.title || 'Bloque'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light italic">
              «Se requiere un mínimo estricto de 4 de las 5 preguntas respondidas correctamente para acreditar este bloque y habilitar el siguiente. Concéntrate en la precisión de los axiomas estudiados.»
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                VoiceAgent.stopSpeaking();
                setIsPrologueDimmed(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
            >
              <span>Ingresar a la Evaluación →</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Academic Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#12141c] via-[#0d0e12] to-[#161822] border-2 border-[#c5a059]/40 shadow-xl space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40">
              <BookOpen className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#c5a059] font-mono">
                Master Pen Training • Evaluación Oficial
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-gold text-white">
                Evaluación del Bloque: {currentBlock?.title || 'Quiero ser Escritor'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-xs px-3.5 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f5e2a3] font-bold tracking-wide">
              Meta: Mínimo 4 de 5 Preguntas Correctas
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
          Para garantizar la asimilación conceptual rigurosa, se exige responder correctamente al menos <strong>4 preguntas</strong> del examen (de 5 reactivos). El acceso a los próximos bloques depende estrictamente de superar la evaluación del bloque previo.
        </p>

        {/* Block Selector with Sequential Locking */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium shrink-0">Seleccionar Evaluación:</span>
          <div className="flex flex-wrap gap-2">
            {blocks.map(b => {
              const isLocked = cloudState.isBlockLocked(b.id);
              const isSelected = selectedBlockId === b.id;

              return (
                <button
                  key={b.id}
                  onClick={() => handleBlockSelect(b.id, b.blockNumber)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] text-black font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : isLocked
                      ? 'bg-black/30 border border-zinc-900 text-zinc-600 cursor-not-allowed opacity-75'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                  title={isLocked ? `Bloque ${b.blockNumber} Bloqueado (Aprobar Bloque previo con >= 4/5)` : b.title}
                >
                  {isLocked && <Lock className="w-3 dot3 text-zinc-500" />}
                  <span>Bloque {b.blockNumber}</span>
                  {isLocked && <span className="text-[9px] text-zinc-600">(Bloqueado)</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locked Warning */}
        {lockedNotice && (
          <div className="p-3.5 bg-amber-950/60 border border-amber-500/60 rounded-xl text-xs text-amber-200 flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{lockedNotice}</span>
          </div>
        )}

      </div>

      {/* EVALUATION RESULT BANNER IF SUBMITTED */}
      {evaluationResult && (
        <div className={`p-6 sm:p-8 rounded-2xl border-2 transition-all space-y-6 ${
          evaluationResult.passed
            ? 'bg-emerald-950/70 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-emerald-200'
            : 'bg-red-950/70 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)] text-red-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-2xl shrink-0 ${evaluationResult.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {evaluationResult.passed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold font-serif-gold text-white">
                  {evaluationResult.passed 
                    ? `¡Fantástico! ¡Felicitaciones! Has obtenido ${evaluationResult.correctCount} de ${evaluationResult.totalQuestions} aciertos` 
                    : `Calificación Insuficiente: ${evaluationResult.correctCount} de ${evaluationResult.totalQuestions} aciertos`}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed max-w-xl">
                  {evaluationResult.passed ? (
                    `Has superado la exigencia de al menos 4 preguntas correctas. El siguiente bloque curricular y su correspondiente evaluación quedan formalmente habilitados.`
                  ) : (
                    `Has respondido ${evaluationResult.correctCount} de ${evaluationResult.totalQuestions} preguntas correctamente. La norma académica exige al menos 4 aciertos para pasar al siguiente bloque. Por favor, reintenta este examen.`
                  )}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center space-x-3">
              {evaluationResult.passed ? (
                isCourseComplete ? (
                  <button
                    onClick={onGoToCertificate}
                    className="px-6 py-3 rounded-xl bg-[#d4af37] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#c5a059] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Ver Certificado Oficial</span>
                    <Award className="w-4 h-4 text-black" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const nextBlockNum = (currentBlock?.blockNumber || 1) + 1;
                      const next = blocks.find(b => b.blockNumber === nextBlockNum);
                      if (next) setSelectedBlockId(next.id);
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer"
                  >
                    Continuar al Siguiente Bloque →
                  </button>
                )
              ) : (
                <button
                  onClick={handleRetryExam}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition flex items-center space-x-2 shadow-lg cursor-pointer"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Reintentar Evaluación del Bloque</span>
                </button>
              )}
            </div>
          </div>

          {/* AVISO / DECISIÓN OFICIAL SI SE FINALIZAN LOS 5 BLOQUES */}
          {evaluationResult.decision && (
            <div className="p-5 rounded-2xl bg-black/80 border-2 border-[#d4af37] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold">
                  Decisión Académica Final del Sistema
                </span>
                <span className="text-lg font-black font-serif-gold text-white">
                  {evaluationResult.decision.decisionText}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-1">
                <p>
                  <strong>Dictamen: </strong>
                  {evaluationResult.decision.recommendation}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-zinc-400">
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-emerald-400 font-bold block">50 Aciertos = A</span>
                    <span>Certificado Inmediato</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-blue-400 font-bold block">46 - 49 Aciertos = B</span>
                    <span>Reevaluar &lt; 5/5</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-amber-400 font-bold block">40 - 45 Aciertos = C</span>
                    <span>Mejorar no perfectos</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-red-400 font-bold block">&lt; 40 Aciertos = D</span>
                    <span>Reprobado (Rehacer)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmitExam} className="space-y-6">
        
        {session.questions.map((question, qIdx) => {
          const selectedLetter = userAnswers[question.id];
          const feedback = evaluationResult?.detailedFeedback?.find((f: any) => f.questionId === question.id);

          return (
            <div 
              key={question.id} 
              className={`p-6 sm:p-7 rounded-2xl border bg-[#111219] transition-all shadow-md ${
                feedback 
                  ? feedback.isCorrect 
                    ? 'border-emerald-500/40 bg-emerald-950/15' 
                    : 'border-red-500/40 bg-red-950/15'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5e2a3]">
                  Pregunta {qIdx + 1} de {session.questions.length}
                </span>

                {feedback && (
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                    feedback.isCorrect ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{feedback.isCorrect ? 'Correcta' : 'Incorrecta'}</span>
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base font-medium text-white mb-6 leading-relaxed">
                {question.prompt || question.question}
              </p>

              <div className="space-y-3">
                {question.options.map((opt: any) => {
                  const isChecked = selectedLetter === opt.letter;
                  const isOptionCorrect = evaluationResult && opt.letter === question.correctLetter;

                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(question.id, opt.letter)}
                      className={`flex items-start p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : isOptionCorrect
                          ? 'border-emerald-500 bg-emerald-950/20 text-white'
                          : 'bg-black/50 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={opt.letter}
                        checked={isChecked}
                        onChange={() => {}}
                        disabled={!!evaluationResult}
                        className="mt-0.5 mr-3 text-[#d4af37] focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-[#c5a059] mr-2">[{opt.letter}]</span>
                        <span>{opt.text}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {feedback && (
                <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <span className="text-[#c5a059] font-bold block uppercase tracking-wider">
                    Fundamento Académico de Michael Pen:
                  </span>
                  <p>{feedback.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Action Bar */}
        {!evaluationResult && (
          <div className="p-6 rounded-2xl bg-[#0f1016] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-400">
              {allAnswered ? (
                <span className="text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Todos los reactivos han sido respondidos. Listo para evaluar.</span>
                </span>
              ) : (
                <span className="text-amber-400">⚠ Responde los {session.questions.length} reactivos para procesar la evaluación.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={!allAnswered}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] text-black font-extrabold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              Procesar y Enviar Evaluación del Bloque →
            </button>
          </div>
        )}

      </form>

    </div>
  );
};
