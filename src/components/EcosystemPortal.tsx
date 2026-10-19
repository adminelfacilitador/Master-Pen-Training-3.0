import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  Lock, 
  Camera, 
  ShoppingBag, 
  BookOpen, 
  Palette, 
  Lightbulb, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { cloudState, BrandingImages } from '../services/cloudState';
import { AISlideshowBanner } from './AISlideshowBanner';
import { AIBlogViewer } from './AIBlogViewer';

interface EcosystemPortalProps {
  onNavigateToAcademy: () => void;
  isAdmin: boolean;
  onOpenImageModal: (defaultCategory?: keyof BrandingImages) => void;
}

export const EcosystemPortal: React.FC<EcosystemPortalProps> = ({
  onNavigateToAcademy,
  isAdmin,
  onOpenImageModal
}) => {
  const [branding, setBranding] = useState<BrandingImages>(cloudState.getBrandingImages());
  const [inactiveNotice, setInactiveNotice] = useState<string | null>(null);
  const [activeAIBlog, setActiveAIBlog] = useState<string | null>(null);

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setBranding(cloudState.getBrandingImages());
    });
    return () => unsub();
  }, []);

  const handleInactiveClick = (name: string) => {
    setInactiveNotice(`La división «${name}» se encuentra en preparación y estará disponible próximamente en el ecosistema.`);
    setTimeout(() => {
      setInactiveNotice(null);
    }, 4500);
  };

  // If user clicked on an AI to view its birth chronicle, render internal blog view
  if (activeAIBlog) {
    return (
      <AIBlogViewer
        aiId={activeAIBlog}
        onBack={() => setActiveAIBlog(null)}
        onSelectOtherAI={(newId) => setActiveAIBlog(newId)}
      />
    );
  }

  const friendLinks = [
    {
      id: 'shop' as const,
      categoryKey: 'shopLogo' as keyof BrandingImages,
      title: branding.shopTitle || 'Master Pen Shop',
      tagline: branding.shopTagline || 'Colección de Artículos y Piezas de Autor',
      logo: branding.shopLogo,
      isActive: false,
      statusBadge: 'Próximamente',
      icon: ShoppingBag,
      description: branding.shopDescription || 'Tienda institucional con obras encuadernadas, instrumentos de escritura y sellos de edición limitada.'
    },
    {
      id: 'manga' as const,
      categoryKey: 'mangaLogo' as keyof BrandingImages,
      title: branding.mangaTitle || 'Master Pen Manga Creator',
      tagline: branding.mangaTagline || 'Estudio de Narrativa y Creación Visual',
      logo: branding.mangaLogo,
      isActive: false,
      statusBadge: 'Próximamente',
      icon: Palette,
      description: branding.mangaDescription || 'Plataforma de composición gráfica, entintado y narrativa secuencial para autores visuales.'
    },
    {
      id: 'creative' as const,
      categoryKey: 'creativeLogo' as keyof BrandingImages,
      title: branding.creativeTitle || 'Master Pen Creative Ideas',
      tagline: branding.creativeTagline || 'Laboratorio de Innovación & Retórica',
      logo: branding.creativeLogo,
      isActive: false,
      statusBadge: 'Próximamente',
      icon: Lightbulb,
      description: branding.creativeDescription || 'Bóveda de creatividad estratégica, generación de tesis literarias y modelos de persuasión.'
    },
    {
      id: 'training' as const,
      categoryKey: 'trainingLogo' as keyof BrandingImages,
      title: branding.trainingTitle || 'Master Pen Training',
      tagline: branding.trainingTagline || 'Academia Digital y Formación Curricular',
      logo: branding.trainingLogo,
      isActive: true,
      statusBadge: 'Academia Activa • Ingresar',
      icon: BookOpen,
      description: branding.trainingDescription || 'Cátedras magistrales en video y diapositivas, malla curricular de 4 bloques y certificación académica de honor.'
    }
  ];

  return (
    <div className="space-y-12 py-4 animate-in fade-in duration-500">
      
      {/* ========================================================================= */}
      {/* NUEVA FICHA SUPERIOR: BANNER SLIDESHOW DE IMÁGENES DE TODAS LAS IA */}
      {/* ========================================================================= */}
      <AISlideshowBanner onSelectAI={(id) => setActiveAIBlog(id)} />

      {/* ========================================================================= */}
      {/* LLAMADO A LA ACCIÓN CENTRAL: LOGOTIPO MASTER PEN STUDIO CREATIONS & TÍTULO */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#151722] via-[#0f1118] to-[#0a0b0e] border-2 border-[#c5a059]/40 p-8 md:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)]">
        
        {/* Subtle decorative radial lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-textured-matte opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          
          {/* Official Emblem: Master Pen Studio Creations */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#d4af37] shadow-[0_0_35px_rgba(212,175,55,0.35)] bg-black flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                  src={branding.studioCreationsLogo}
                  alt="Master Pen Studio Creations"
                  className="w-full h-full object-cover bg-black"
                  referrerPolicy="no-referrer"
                />
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => onOpenImageModal('studioCreationsLogo')}
                  className="absolute bottom-1 right-1 p-2.5 rounded-full bg-black/90 hover:bg-[#d4af37] text-[#f5e2a3] hover:text-black border-2 border-[#d4af37] transition shadow-lg flex items-center justify-center group/btn"
                  title="Cambiar Logotipo Master Pen Studio Creations (PC o Celular)"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/50 text-[#f5e2a3] text-xs font-semibold tracking-wider mt-4">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Sello Oficial • Master Pen Studio Creations</span>
            </div>
          </div>

          {/* Central CTA Legend & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif-gold tracking-wide gold-gradient-text uppercase leading-tight">
              {branding.ctaTitle || 'Conoce El Ecosistema Master Pen Studio Creations'}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
              {branding.ctaSubtitle || 'Portal oficial de enlace con nuestras divisiones artísticas, literarias y formativas.'}
            </p>
          </div>

          {/* Golden accent divider */}
          <div className="w-48 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

          {/* Direct quick action badge */}
          <p className="text-xs text-[#c5a059] uppercase tracking-widest font-mono">
            Selecciona una división para explorar su espacio oficial:
          </p>

        </div>
      </div>

      {/* Floating Inactive Notice Toast */}
      {inactiveNotice && (
        <div className="p-4 rounded-2xl bg-[#161824] border-2 border-[#c5a059] text-xs text-[#f5e2a3] flex items-center justify-between shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-[#d4af37] shrink-0" />
            <p className="font-medium">{inactiveNotice}</p>
          </div>
          <button
            onClick={() => setInactiveNotice(null)}
            className="text-zinc-400 hover:text-white px-2 py-1 text-xs"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CUADRÍCULA DE BOTONES DE ENLACES AMIGOS (4 DIVISIONES) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold font-serif-gold text-white flex items-center space-x-2">
            <span>Divisiones y Plataformas del Ecosistema</span>
          </h2>
          <span className="text-[11px] text-zinc-400 font-mono">4 Espacios Integrados</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {friendLinks.map((item) => {
            const isTraining = item.id === 'training';
            return (
              <div
                key={item.id}
                className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group ${
                  isTraining
                    ? 'bg-gradient-to-b from-[#181a26] via-[#12141f] to-[#0c0d13] border-2 border-[#d4af37] shadow-[0_10px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] hover:-translate-y-1'
                    : 'bg-[#101218]/90 border border-zinc-800 hover:border-zinc-700 shadow-xl opacity-90 hover:opacity-100'
                }`}
              >
                {/* Admin image edit shortcut */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenImageModal(item.categoryKey);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-black/80 hover:bg-[#d4af37] text-zinc-300 hover:text-black border border-zinc-700 hover:border-[#d4af37] transition text-xs flex items-center space-x-1 z-20"
                    title={`Reemplazar logotipo de ${item.title} (PC o Celular)`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="space-y-5">
                  
                  {/* Emblem Logo Presentation */}
                  <div className="flex justify-center pt-2">
                    <div className={`relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                      isTraining
                        ? 'border-2 border-[#d4af37] bg-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                        : 'border border-zinc-700 bg-black/80'
                    }`}>
                      <img
                        src={item.logo}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Division Titles & Description */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isTraining
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}>
                        {item.statusBadge}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold font-serif-gold ${isTraining ? 'text-white' : 'text-zinc-200'}`}>
                      {item.title}
                    </h3>

                    <p className="text-[11px] text-[#c5a059] font-medium leading-snug">
                      {item.tagline}
                    </p>

                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed pt-1 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                </div>

                {/* Bottom Call To Action Button */}
                <div className="pt-6 mt-4 border-t border-zinc-800/80">
                  {isTraining ? (
                    <button
                      type="button"
                      onClick={onNavigateToAcademy}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5e2a3] to-[#c5a059] hover:from-[#c5a059] hover:to-[#b38f2e] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Ingresar a la Academia</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleInactiveClick(item.title)}
                      className="w-full py-2.5 px-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/80 text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Enlace Próximo</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
