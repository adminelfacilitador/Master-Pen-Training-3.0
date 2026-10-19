import React, { useRef, useState, useEffect } from 'react';
import { 
  Award, 
  Download, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Share2,
  Feather
} from 'lucide-react';
import { CertificateData, UserProfile } from '../types';
import { cloudState } from '../services/cloudState';
import { BRANDING } from '../assets/branding';

interface CertificateModalProps {
  currentUser: UserProfile | null;
  onRetakeExam?: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  currentUser,
  onRetakeExam
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const template = cloudState.getCertificateTemplate();
  const [brandingImages, setBrandingImages] = useState(cloudState.getBrandingImages());

  // Generate fallback or retrieve existing certificate safely without side-effects during render
  const getInitialCert = (): CertificateData => {
    if (currentUser) {
      const existing = cloudState.getUserCertificate(currentUser.uid);
      if (existing) return existing;
    }
    return {
      id: currentUser ? `CERT-MPT-${currentUser.uid.substring(0, 6).toUpperCase()}-${new Date().getFullYear()}` : 'CERT-MPT-998241-2026',
      studentUid: currentUser?.uid || 'usr_demo',
      studentName: currentUser?.displayName || 'Carlos Mendoza',
      documentType: currentUser?.documentType || 'cedula',
      documentNumber: currentUser?.documentNumber || 'V-18.452.901',
      residenceCity: currentUser?.residenceCity || 'Caracas, Venezuela',
      courseTitle: 'Quiero ser Escritor • Master Pen Training',
      issueDate: new Date().toLocaleDateString('es-419', { year: 'numeric', month: 'long', day: 'numeric' }),
      verificationHash: '0x8f3c7e9a1b2d4f5c6e7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
      instructorName: template.signatory1Name,
      instructorTitle: template.signatory1Title,
      academicDirector: template.signatory2Name,
      gradeAchieved: 'Acreditado con Distinción y Honor (>= 70%)'
    };
  };

  const [cert, setCert] = useState<CertificateData>(getInitialCert);
  const [isEditingData, setIsEditingData] = useState(false);
  const [editName, setEditName] = useState(cert.studentName);
  const [editDocType, setEditDocType] = useState<'cedula' | 'pasaporte'>(cert.documentType);
  const [editDocNumber, setEditDocNumber] = useState(cert.documentNumber);
  const [editCity, setEditCity] = useState(cert.residenceCity);

  // Subscribe to real-time branding & certificate updates
  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setBrandingImages(cloudState.getBrandingImages());
      if (currentUser) {
        const updated = cloudState.getUserCertificate(currentUser.uid);
        if (updated) {
          setCert(updated);
        }
      }
    });
    return () => unsub();
  }, [currentUser]);

  // Ensure certificate is officially registered in cloud state in an effect, not during render
  useEffect(() => {
    if (currentUser) {
      const existing = cloudState.getUserCertificate(currentUser.uid);
      if (existing) {
        setCert(existing);
      } else {
        const issued = cloudState.issueCertificateForUser(currentUser.uid);
        setCert(issued);
      }
    }
  }, [currentUser]);

  const handleSaveParticipantData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = cloudState.issueCertificateForUser(currentUser.uid, {
      studentName: editName.trim(),
      documentType: editDocType,
      documentNumber: editDocNumber.trim(),
      residenceCity: editCity.trim()
    });
    setCert(updated);
    setIsEditingData(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJPG = () => {
    const dummyLink = document.createElement('a');
    dummyLink.download = `Certificado_Master_Pen_${cert.studentName.replace(/\s+/g, '_')}.jpg`;
    dummyLink.href = brandingImages.banner;
    dummyLink.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Michael Pen Congratulations Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#c5a059]/40 bg-[#101218] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)] shrink-0">
          <img 
            src={brandingImages.portrait} 
            alt="Michael Pen" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f5e2a3] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Felicitación Oficial de Cierre • Michael Pen</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold font-serif-gold text-white">
            «¡Fantástico! ¡Felicitaciones! Has conquistado el temple de la palabra y el rigor de la forma.»
          </h2>

          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
            Estimado <strong className="text-[#f5e2a3] font-semibold">{cert.studentName}</strong>: ¡Fantástico trabajo! ¡Felicitaciones! Tu constancia y perseverancia para superar satisfactoriamente cada bloque del curso con al menos el estándar de honor te consagran como egresado oficial de Master Pen Training. Haz de tu pluma un blasón de verdad y liderazgo.
          </p>
        </div>

        <div className="shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setIsEditingData(!isEditingData)}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[#f5e2a3] border border-[#c5a059]/40 font-semibold text-xs tracking-wider transition cursor-pointer"
          >
            {isEditingData ? 'Cerrar Edición' : 'Editar Datos del Certificado'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            onClick={handleDownloadJPG}
            className="px-4 py-2 rounded-lg bg-black hover:bg-zinc-900 text-[#f5e2a3] border border-[#c5a059]/30 font-semibold text-xs tracking-wider transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#d4af37]" />
            <span>Descargar JPG HD</span>
          </button>
        </div>
      </div>

      {/* Participant Data Form (when user wants to customize / verify certificate data) */}
      {isEditingData && (
        <form 
          onSubmit={handleSaveParticipantData} 
          className="p-6 rounded-2xl bg-[#12141c] border-2 border-[#d4af37]/40 shadow-xl space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-[#f5e2a3] uppercase font-serif-gold">
              Datos Suministrados por el Participante para el Certificado
            </h3>
            <span className="text-[11px] text-zinc-400">
              Personaliza cómo se reflejarán tus datos en la acreditación
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-zinc-300 font-semibold mb-1">Nombre y Apellido:</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#d4af37] outline-none"
                placeholder="Ej. Carlos Mendoza"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-semibold mb-1">Tipo de Documento:</label>
              <select
                value={editDocType}
                onChange={e => setEditDocType(e.target.value as 'cedula' | 'pasaporte')}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-[#f5e2a3] focus:border-[#d4af37] outline-none"
              >
                <option value="cedula">Cédula</option>
                <option value="pasaporte">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-semibold mb-1">
                {editDocType === 'pasaporte' ? 'Número de Pasaporte:' : 'Número de Cédula:'}
              </label>
              <input
                type="text"
                value={editDocNumber}
                onChange={e => setEditDocNumber(e.target.value)}
                required
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#d4af37] outline-none font-mono"
                placeholder={editDocType === 'pasaporte' ? 'P-9823411' : 'V-18.452.901'}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-semibold mb-1">Ciudad de Residencia:</label>
              <input
                type="text"
                value={editCity}
                onChange={e => setEditCity(e.target.value)}
                required
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#d4af37] outline-none"
                placeholder="Ej. Caracas, Venezuela"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingData(false)}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#c5a059] shadow-md cursor-pointer"
            >
              Guardar y Actualizar Certificado
            </button>
          </div>
        </form>
      )}

      {/* THE OFFICIAL MASTER PEN TRAINING CERTIFICATE (High Definition Gold & Matte Black) */}
      <div 
        ref={certificateRef}
        className="relative bg-[#0a0b0e] text-[#f5e2a3] p-8 md:p-14 rounded-3xl border-4 border-[#c5a059] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_30px_rgba(212,175,55,0.3)] overflow-hidden select-none"
      >
        
        {/* Subtle Watermark & Background Texture */}
        <div className="absolute inset-0 bg-textured-matte opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />
        
        {/* Inner Gold Guilloche Border Frame */}
        <div className="relative border-2 border-[#c5a059]/60 p-6 md:p-10 rounded-2xl space-y-8 text-center">
          
          {/* Corner Ornaments */}
          <div className="absolute top-2 left-2 text-[#d4af37] text-lg font-serif">❖</div>
          <div className="absolute top-2 right-2 text-[#d4af37] text-lg font-serif">❖</div>
          <div className="absolute bottom-2 left-2 text-[#d4af37] text-lg font-serif">❖</div>
          <div className="absolute bottom-2 right-2 text-[#d4af37] text-lg font-serif">❖</div>

          {/* Certificate Header & Emblem */}
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)] bg-black p-2 flex items-center justify-center">
              <img 
                src={brandingImages.trainingLogo || brandingImages.logo} 
                alt="Master Pen Training Crest" 
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-bold font-serif-gold">
              {template.academyName}
            </p>

            <h1 className="text-2xl md:text-4xl font-extrabold font-serif-gold tracking-wide gold-gradient-text uppercase">
              {template.headerTitle}
            </h1>

            <div className="w-40 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>

          {/* Recipient Statement with Exact User Chosen Document Label */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-xs md:text-sm text-zinc-400 uppercase tracking-widest font-light">
              Se otorga la presente acreditación oficial a:
            </p>

            <h2 className="text-3xl md:text-5xl font-bold font-serif-gold text-white border-b border-[#c5a059]/40 pb-3 tracking-wide">
              {cert.studentName}
            </h2>

            {/* Exact Dynamic Label: strictly "Cédula: [num]" or "Pasaporte: [num]" */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm font-light">
              {cert.documentType === 'pasaporte' ? (
                <div className="px-3.5 py-1 rounded-xl bg-black/60 border border-[#d4af37]/40 text-[#f5e2a3] font-mono">
                  <span>Pasaporte: </span>
                  <strong className="text-white font-bold tracking-wider">{cert.documentNumber}</strong>
                </div>
              ) : (
                <div className="px-3.5 py-1 rounded-xl bg-black/60 border border-[#d4af37]/40 text-[#f5e2a3] font-mono">
                  <span>Cédula: </span>
                  <strong className="text-white font-bold tracking-wider">{cert.documentNumber}</strong>
                </div>
              )}

              <div className="px-3.5 py-1 rounded-xl bg-black/60 border border-zinc-700 text-zinc-300">
                <span>Ciudad de Residencia: </span>
                <strong className="text-[#f5e2a3] font-semibold">{cert.residenceCity}</strong>
              </div>
            </div>

            {/* Certificate Body Text */}
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light italic pt-2">
              {template.bodyTemplate}
            </p>

            <div className="inline-block px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e2a3] text-xs font-semibold tracking-wider">
              {cert.gradeAchieved}
            </div>
          </div>

          {/* Signatures & Seal Section: Firma de Michael Pen a la izquierda, Sello de Master Pen Training a la derecha */}
          <div className="pt-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 border-t border-[#c5a059]/30 px-4 md:px-8">
            
            {/* Left Bottom: Michael Pen Signature */}
            <div className="text-center md:text-left space-y-2">
              <div className="h-14 flex items-center justify-center md:justify-start">
                <span className="font-serif italic text-3xl md:text-4xl text-[#d4af37] tracking-wider select-none font-semibold">
                  Michael Pen
                </span>
              </div>
              <div className="w-52 border-t border-[#c5a059]/60" />
              <p className="text-xs font-bold text-white font-serif-gold uppercase tracking-wider">
                {cert.instructorName || 'Michael Pen'}
              </p>
              <p className="text-[11px] text-zinc-400 font-light">
                {cert.instructorTitle || 'Anfitrión Principal & Catedrático Literario'}
              </p>
            </div>

            {/* Right Bottom: Official Master Pen Training Seal (Logotipo) */}
            <div className="flex flex-col items-center md:items-end justify-center space-y-2">
              <div className="relative w-24 h-24 rounded-full border-2 border-[#d4af37] bg-black p-2 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                <img
                  src={brandingImages.trainingLogo || brandingImages.logo}
                  alt="Sello Master Pen Training"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold font-mono">
                SELLO OFICIAL MASTER PEN TRAINING
              </p>
            </div>

          </div>

          {/* Folio ID, Issue Date & Verification Hash */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-zinc-500 border-t border-zinc-800 gap-2">
            <span>Folio: <strong className="text-[#f5e2a3]">{cert.id}</strong></span>
            <span>Fecha de Emisión: {cert.issueDate}</span>
            <span className="truncate max-w-xs">Hash: {cert.verificationHash}</span>
          </div>

        </div>

      </div>

    </div>
  );
};
