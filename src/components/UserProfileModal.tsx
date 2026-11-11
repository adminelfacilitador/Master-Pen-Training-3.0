import React, { useState, useEffect } from 'react';
import { 
  User, 
  Camera, 
  Image as ImageIcon, 
  ShieldCheck, 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  X, 
  Sparkles, 
  BookOpen, 
  RefreshCcw, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText,
  MapPin,
  ExternalLink,
  BarChart3,
  TrendingUp,
  Target,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';
import { cloudState } from '../services/cloudState';
import { compressImageFile } from '../utils/imageCompressor';
import { CurriculumRadarChart } from './CurriculumRadarChart';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToExam: (blockId?: string) => void;
  onGoToCertificate: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onGoToExam,
  onGoToCertificate
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(cloudState.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
  const [documentType, setDocumentType] = useState<'cedula' | 'pasaporte'>('cedula');
  const [documentNumber, setDocumentNumber] = useState('');
  const [residenceCity, setResidenceCity] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [showDocumentNumber, setShowDocumentNumber] = useState(false);

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      const u = cloudState.getCurrentUser();
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const parts = (currentUser.displayName || '').split(' ');
      setFirstName(currentUser.firstName || parts[0] || '');
      setLastName(currentUser.lastName || parts.slice(1).join(' ') || '');
      setPhotoUrl(currentUser.photoUrl || '');
      setCoverPhotoUrl(currentUser.coverPhotoUrl || '');
      setDocumentType(currentUser.documentType || 'cedula');
      setDocumentNumber(currentUser.documentNumber || '');
      setResidenceCity(currentUser.residenceCity || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const academicDecision = cloudState.getUserAcademicDecision(currentUser.uid);
  const blockScores = cloudState.getUserBlockScores(currentUser.uid);
  const blocks = cloudState.getBlocks();

  // Academic KPI Calculations for Visual Dashboard
  let totalCorrect = 0;
  let totalQuestions = 0;
  let passedBlocksCount = 0;
  blocks.forEach(blk => {
    const sc = blockScores[blk.id];
    if (sc) {
      totalCorrect += sc.correct;
      totalQuestions += sc.total;
      if (sc.passed) passedBlocksCount++;
    } else {
      totalQuestions += 5;
    }
  });
  const overallPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || currentUser.displayName;

    cloudState.updateUserProfile(currentUser.uid, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: fullName,
      photoUrl: photoUrl.trim() || currentUser.photoUrl,
      coverPhotoUrl: coverPhotoUrl.trim() || currentUser.coverPhotoUrl,
      documentType,
      documentNumber: documentNumber.trim(),
      residenceCity: residenceCity.trim()
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'photo' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (target === 'photo') setIsUploadingPhoto(true);
      if (target === 'cover') setIsUploadingCover(true);

      const compressed = await compressImageFile(file, target === 'photo' ? 400 : 1200, 0.85);
      if (target === 'photo') {
        setPhotoUrl(compressed);
      } else {
        setCoverPhotoUrl(compressed);
      }
    } catch (err) {
      console.warn('Error compressing image:', err);
    } finally {
      setIsUploadingPhoto(false);
      setIsUploadingCover(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c0d12] border-2 border-[#d4af37]/60 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.3)] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#171924] via-[#101117] to-[#1a1c26] border-b border-[#c5a059]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40">
              <GraduationCap className="w-5 h-5 text-[#d4af37]" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] font-mono">
                Expediente Institucional & Dashboard de Rendimiento
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif-gold text-white">
                {currentUser.displayName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard / Profile Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2.5 bg-[#0f1118] border-b border-zinc-800 flex items-center space-x-2 shrink-0 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-serif-gold tracking-wide transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] text-black shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                : 'bg-black/60 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard & Radar Curricular</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-serif-gold tracking-wide transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] text-black shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                : 'bg-black/60 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Expediente & Datos Personales</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          
          {activeTab === 'dashboard' ? (
            /* TAB 1: VISUAL DASHBOARD & RECHARTS RADAR */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Executive Student Identification Pill */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#141622] via-[#0d0e14] to-[#151724] border border-[#d4af37]/40 shadow-lg">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.35)] bg-black shrink-0">
                    <img 
                      src={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'} 
                      alt={currentUser.displayName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold font-serif-gold text-white">
                        {currentUser.displayName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5e2a3]">
                        {currentUser.role === 'admin_principal' ? 'Admin Rector' : currentUser.role === 'admin_vip_tester' ? 'Auditor VIP' : 'Estudiante'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">{currentUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-medium transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Editar Perfil & Foto</span>
                  </button>
                </div>
              </div>

              {/* 4 Executive KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* KPI 1: Dominio Curricular Global */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141624] to-[#0c0d14] border border-[#c5a059]/40 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-mono uppercase tracking-wider">Dominio Global</span>
                    <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-black font-serif-gold text-[#f5e2a3]">
                      {overallPercentage}%
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {totalCorrect}/{totalQuestions}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#856524] to-[#d4af37] h-full rounded-full transition-all duration-500" 
                      style={{ width: `${overallPercentage}%` }} 
                    />
                  </div>
                </div>

                {/* KPI 2: Bloques Acreditados */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141624] to-[#0c0d14] border border-[#c5a059]/40 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-mono uppercase tracking-wider">Módulos Aprobados</span>
                    <Target className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-black font-serif-gold text-white">
                      {passedBlocksCount} <span className="text-base text-zinc-500">/ {blocks.length}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    {passedBlocksCount === blocks.length ? '100% Malla completa' : `${blocks.length - passedBlocksCount} módulos por rendir`}
                  </p>
                </div>

                {/* KPI 3: Calificación Oficial Rango A/B/C/D */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141624] to-[#0c0d14] border border-[#c5a059]/40 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-mono uppercase tracking-wider">Rango Académico</span>
                    <Award className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl sm:text-3xl font-black font-serif-gold ${
                      academicDecision.academicGrade === 'A' ? 'text-[#f5e2a3]' :
                      academicDecision.academicGrade === 'B' ? 'text-blue-300' :
                      academicDecision.academicGrade === 'C' ? 'text-amber-300' : 'text-red-300'
                    }`}>
                      Rango {academicDecision.academicGrade}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate" title={academicDecision.decisionText}>
                    {academicDecision.decisionText}
                  </p>
                </div>

                {/* KPI 4: Estatus de Titulación */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141624] to-[#0c0d14] border border-[#c5a059]/40 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-mono uppercase tracking-wider">Titulación Oficial</span>
                    <GraduationCap className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <span className={`text-sm font-bold font-serif-gold block ${
                      academicDecision.canIssueCertificate ? 'text-emerald-400' : 'text-zinc-400'
                    }`}>
                      {academicDecision.canIssueCertificate ? 'Acreditado con Honores' : 'En Formación'}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    {academicDecision.canIssueCertificate ? 'Certificado habilitado' : 'Requiere Rango A (>=90%)'}
                  </p>
                </div>

              </div>

              {/* Official Recommendation Banner */}
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed flex items-start space-x-3 ${
                academicDecision.academicGrade === 'A'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : academicDecision.academicGrade === 'B'
                  ? 'bg-blue-950/40 border-blue-500/40 text-blue-200'
                  : academicDecision.academicGrade === 'C'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}>
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-1 font-serif-gold">
                    Directriz Institucional de Evaluación:
                  </strong>
                  <span>{academicDecision.recommendation}</span>
                </div>
              </div>

              {/* VISUAL DASHBOARD RADAR CHART POWERED BY RECHARTS */}
              <CurriculumRadarChart 
                blocks={blocks} 
                blockScores={blockScores} 
                overallProgress={overallPercentage}
              />

              {/* 5-Block Score Breakdown Table */}
              <div className="p-5 rounded-2xl bg-[#0f1118] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-[#c5a059] font-mono tracking-wider flex items-center space-x-2">
                    <Target className="w-4 h-4 text-[#d4af37]" />
                    <span>Desglose Analítico por Bloques Curriculares (Mínimo 4/5 para aprobar)</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                  {blocks.map((blk) => {
                    const score = blockScores[blk.id];
                    const hasPassed = score?.passed || false;
                    const correct = score ? score.correct : 0;
                    const total = score ? score.total : 5;

                    return (
                      <div 
                        key={blk.id}
                        className={`p-3.5 rounded-xl border text-center space-y-2 transition ${
                          hasPassed
                            ? correct === 5 
                              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                              : 'bg-[#141620] border-[#d4af37]/40'
                            : 'bg-black/60 border-zinc-800'
                        }`}
                      >
                        <span className="text-[10px] font-mono text-zinc-400 block font-semibold">
                          Bloque {blk.blockNumber}
                        </span>
                        <p className="text-xs font-bold text-white line-clamp-1" title={blk.title}>
                          {blk.title.replace(/^Bloque\s+[IVX]+:\s*/, '')}
                        </p>

                        <div className="py-1">
                          <span className={`text-lg font-black font-serif-gold ${
                            correct === 5 ? 'text-emerald-400' : correct >= 4 ? 'text-[#d4af37]' : 'text-zinc-500'
                          }`}>
                            {score ? `${correct} / ${total}` : 'Pendiente'}
                          </span>
                        </div>

                        <div className="pt-1 border-t border-zinc-800/80">
                          {hasPassed ? (
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              correct === 5 ? 'text-emerald-300' : 'text-amber-300'
                            }`}>
                              {correct === 5 ? '100% Perfecto' : 'Aprobado (>= 4)'}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onGoToExam(blk.id);
                              }}
                              className="text-[10px] text-[#d4af37] hover:underline font-semibold cursor-pointer"
                            >
                              Realizar Examen →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick action buttons according to academic rules */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                {academicDecision.canIssueCertificate ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onGoToCertificate();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-black" />
                    <span>Ver Mi Certificado Oficial (Calificación A)</span>
                  </button>
                ) : academicDecision.academicGrade === 'B' || academicDecision.academicGrade === 'C' ? (
                  <button
                    type="button"
                    onClick={() => {
                      cloudState.retakeNonPerfectEvaluationsForUser(currentUser.uid);
                      onClose();
                      onGoToExam();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <RefreshCcw className="w-4 h-4 text-black" />
                    <span>Optimizar Evaluaciones para Alcanzar Calificación A</span>
                  </button>
                ) : academicDecision.academicGrade === 'D' ? (
                  <button
                    type="button"
                    onClick={() => {
                      cloudState.resetAllEvaluationsForUser(currentUser.uid);
                      onClose();
                      onGoToExam('block_01');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    <span>Reiniciar Todas las Evaluaciones Obligatorias</span>
                  </button>
                ) : null}
              </div>

            </div>
          ) : (
            /* TAB 2: EXPEDIENTE PERSONAL & DOCUMENTACIÓN */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* SECTION 1: COVER & AVATAR PRESENTATION */}
              <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-black shadow-lg">
                
                {/* Banner Cover */}
                <div className="relative h-36 sm:h-48 w-full bg-gradient-to-r from-[#171926] via-[#12131a] to-[#201d14] overflow-hidden">
                  {coverPhotoUrl ? (
                    <img 
                      src={coverPhotoUrl} 
                      alt="Portada del perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-serif-gold">
                      Sin foto de portada personalizada
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Cover upload button */}
                  <label className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-[#d4af37] text-zinc-300 hover:text-black border border-zinc-700 hover:border-[#d4af37] text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 shadow-lg">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{isUploadingCover ? 'Subiendo...' : 'Cambiar Portada'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, 'cover')} 
                    />
                  </label>
                </div>

                {/* Profile Avatar & Info Header */}
                <div className="px-5 pb-5 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                    {/* Avatar with edit icon */}
                    <div className="relative group">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.4)] bg-black shrink-0">
                        <img 
                          src={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'} 
                          alt={currentUser.displayName} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <label className="absolute bottom-1 right-1 p-2 rounded-full bg-black hover:bg-[#d4af37] text-[#f5e2a3] hover:text-black border-2 border-[#d4af37] transition cursor-pointer shadow-lg flex items-center justify-center">
                        <Camera className="w-3.5 h-3.5" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'photo')} 
                        />
                      </label>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold font-serif-gold text-white">
                          {currentUser.displayName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f5e2a3]">
                          {currentUser.role === 'admin_principal' ? 'Administrador' : currentUser.role === 'admin_vip_tester' ? 'Auditor VIP' : 'Estudiante'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Status pill */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Usuario Verificado</span>
                    </span>
                  </div>

                </div>

              </div>

              {/* SECTION 2: FORMULARIO DE EDICIÓN DE PERFIL & DATOS CONFIDENCIALES */}
          <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-[#0f1118] border border-zinc-800 space-y-6">
            
            <div className="flex items-center space-x-3 border-b border-zinc-800 pb-3">
              <span className="p-2 rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-base font-bold font-serif-gold text-white">
                  Editar Datos Personales y de Identificación
                </h4>
                <p className="text-xs text-zinc-400">
                  Actualiza tu nombre, apellidos y documento oficial para la emisión de títulos.
                </p>
              </div>
            </div>

            {/* Privacy Alert for Document Number */}
            <div className="p-3.5 rounded-xl bg-[#141824] border border-[#3b82f6]/40 text-[#bfdbfe] text-xs flex items-start space-x-3">
              <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Garantía de Confidencialidad:</strong> Tu cédula o número de documento de identidad es estrictamente confidencial. Solo es visible para ti en este perfil privado y nunca será revelada a terceros ni al público general.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Nombre:
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre de pila"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Apellido:
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tus apellidos oficiales"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Correo Electrónico (Google / Cuenta):
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Ciudad de Residencia:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={residenceCity}
                    onChange={(e) => setResidenceCity(e.target.value)}
                    placeholder="Ej. Ciudad de Panamá, Panamá"
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black border border-zinc-700 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                  <MapPin className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Tipo de Documento:
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as 'cedula' | 'pasaporte')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="cedula">Cédula de Identidad Personal</option>
                  <option value="pasaporte">Pasaporte Internacional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Número de Documento (Privado):</span>
                  <button
                    type="button"
                    onClick={() => setShowDocumentNumber(!showDocumentNumber)}
                    className="text-[10px] text-zinc-400 hover:text-white flex items-center space-x-1"
                  >
                    {showDocumentNumber ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showDocumentNumber ? 'Ocultar' : 'Ver'}</span>
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showDocumentNumber ? 'text' : 'password'}
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="Ej. 8-732-1325"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              {saveSuccess ? (
                <span className="text-emerald-400 text-xs font-bold flex items-center space-x-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Perfil y credenciales actualizados exitosamente en la nube.</span>
                </span>
              ) : (
                <span className="text-[11px] text-zinc-500">
                  Tus datos se sincronizan con tu expediente en la nube institucional.
                </span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#856524] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center space-x-2 transition cursor-pointer"
              >
                <Save className="w-4 h-4 text-black" />
                <span>Guardar Cambios</span>
              </button>
            </div>

          </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
