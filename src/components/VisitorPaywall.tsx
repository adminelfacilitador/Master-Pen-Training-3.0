import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  UserCheck,
  Tag,
  CreditCard,
  X
} from 'lucide-react';
import { cloudState } from '../services/cloudState';

interface VisitorPaywallProps {
  onEnrollSuccess: () => void;
  onLoginAsVipTester: () => void;
  onClose?: () => void;
  isModal?: boolean;
  isOpen?: boolean;
}

export const VisitorPaywall: React.FC<VisitorPaywallProps> = ({
  onEnrollSuccess,
  onLoginAsVipTester,
  onClose,
  isModal = false,
  isOpen = true
}) => {
  const [branding, setBranding] = useState(cloudState.getBrandingImages());
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalRenderedRef = useRef(false);

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setBranding(cloudState.getBrandingImages());
    });
    return () => unsub();
  }, []);

  if (isModal && !isOpen) return null;

  // Dynamically load PayPal Hosted Buttons SDK and render the container
  useEffect(() => {
    const containerId = 'paypal-container-4ARLZ5CDEP45U';
    
    const renderButton = () => {
      const win = window as any;
      if (win.paypal && win.paypal.HostedButtons && !paypalRenderedRef.current) {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = ''; // prevent duplicates
          try {
            win.paypal.HostedButtons({
              hostedButtonId: "4ARLZ5CDEP45U",
            }).render(`#${containerId}`);
            paypalRenderedRef.current = true;
            setPaypalLoaded(true);
          } catch (err) {
            console.warn('[PayPal HostedButtons notice]:', err);
          }
        }
      }
    };

    const win = window as any;
    if (win.paypal && win.paypal.HostedButtons) {
      renderButton();
    } else {
      // Inject official PayPal SDK script with hosted-buttons component
      const existingScript = document.getElementById('paypal-sdk-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'paypal-sdk-script';
        script.src = 'https://www.paypal.com/sdk/js?client-id=BAA2Yt68e_N3j3kYjXf2Fq4r1e2Q0d1h5&components=hosted-buttons';
        script.async = true;
        script.onload = () => {
          setTimeout(renderButton, 300);
        };
        document.body.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (win.paypal && win.paypal.HostedButtons) {
            clearInterval(checkInterval);
            renderButton();
          }
        }, 300);
        setTimeout(() => clearInterval(checkInterval), 4000);
      }
    }
  }, []);

  const content = (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300">
      
      {/* Banner Paywall Header */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#c5a059]/50 bg-[#101218] p-6 sm:p-10 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition cursor-pointer z-20"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-950/80 to-amber-950/60 border border-amber-500/50 text-amber-300 text-xs font-bold tracking-wide">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Acceso Exclusivo • Suscripción a la Academia Master Pen</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif-gold text-white leading-tight">
              Oferta de Acceso Total a <span className="gold-gradient-text">Master Pen Training</span>
            </h2>

            {/* Special Pricing Ribbon */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1a170d] via-[#231e11] to-[#16140d] border-2 border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f5e2a3] font-mono">
                    Descuento del 50% para los primeros 100 usuarios
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase">
                  Cupos Disponibles
                </span>
              </div>

              <div className="flex items-baseline space-x-3 pt-1">
                <span className="text-3xl sm:text-4xl font-black font-serif-gold text-[#d4af37]">
                  $2.99 USD
                </span>
                <span className="text-sm sm:text-base text-zinc-400 line-through">
                  $5.99 USD / mes
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  (Costo inicial con 50% de descuento)
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                Suscripción mensual de <strong>$5.99 mensuales</strong> para disfrutar de cátedras completas, diapositivas comentadas por Michael Pen, evaluaciones académicas y diplomas oficiales.
              </p>
            </div>

            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light">
              El acceso al curso se encuentra reservado para estudiantes suscritos. Al completar tu suscripción, desbloquearás de inmediato los 5 bloques de <strong>«Quiero ser Escritor»</strong> con la voz narrativa en off de Michael Pen y el motor de certificación.
            </p>

            {/* PAYPAL CONTAINER CONFIGURADO */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#c5a059]">
                <CreditCard className="w-4 h-4 text-[#d4af37]" />
                <span>Pasarela Segura PayPal Hosted Buttons:</span>
              </div>

              {/* Exact user requested container */}
              <div className="p-4 rounded-2xl bg-black/80 border border-[#d4af37]/40 min-h-[70px] flex items-center justify-center">
                <div id="paypal-container-4ARLZ5CDEP45U" className="w-full flex justify-center"></div>
              </div>

              {/* Fallback & instant access for testing */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    cloudState.switchUserByRole('student_enrolled');
                    onEnrollSuccess();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#8a6c25] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center space-x-2 cursor-pointer"
                >
                  <span>Activar Acceso Inmediato ($2.99 USD)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onLoginAsVipTester}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-semibold text-xs uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Auditar como VIP Tester (Acceso de Prueba)</span>
                </button>
              </div>
            </div>

          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.35)]">
              <img 
                src={branding.portrait} 
                alt="Michael Pen" 
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 text-center">
                <p className="text-xs font-bold text-[#f5e2a3] font-serif-gold uppercase">
                  Michael Pen
                </p>
                <p className="text-[10px] text-zinc-300">
                  Mentor & Director Académico
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Course Value Pillars & Syllabus Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-[#12131a] border border-[#c5a059]/30 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif-gold font-bold text-white text-base">Bloques I & II: Fundamentos</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Los orígenes de la escritura desde Mesopotamia hasta la era digital, y la anatomía editorial completa de un libro profesional.
          </p>
          <ul className="text-[11px] text-zinc-300 space-y-1.5 pt-2 border-t border-zinc-800">
            <li className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Formato Michael Pen con pantalla atenuada</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Diapositivas comentadas por voz en off</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#12131a] border border-[#c5a059]/30 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-serif-gold font-bold text-white text-base">Bloques III & IV: Voz y Redacción</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Géneros literarios, escaleta argumental y técnicas de superación de bloqueos creativos para forjar un manuscrito auténtico.
          </p>
          <ul className="text-[11px] text-zinc-300 space-y-1.5 pt-2 border-t border-zinc-800">
            <li className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Evaluación oficial (Mínimo 4 de 5 para avanzar)</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Bloqueo secuencial con acreditación rigurosa</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#12131a] border border-[#c5a059]/30 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif-gold font-bold text-white text-base">Bloque V & Certificación de Honor</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Publicación en Amazon KDP, registro ISBN y emisión del diploma con escala A, B, C y D según desempeño académico comprobado.
          </p>
          <ul className="text-[11px] text-zinc-300 space-y-1.5 pt-2 border-t border-zinc-800">
            <li className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Certificado Oficial para Calificación A</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Expediente institucional en base de datos segura</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-5xl my-8">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

