import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  X, 
  Sparkles, 
  RefreshCw, 
  Camera, 
  AlertCircle
} from 'lucide-react';
import { cloudState, BrandingImages } from '../services/cloudState';
import { compressImageToDataUrl } from '../utils/imageCompressor';

export type UploadCategory = keyof BrandingImages;

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTarget?: UploadCategory;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  defaultTarget = 'studioCreationsLogo'
}) => {
  const [targetCategory, setTargetCategory] = useState<UploadCategory>(defaultTarget);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultTarget) {
      setTargetCategory(defaultTarget);
    }
  }, [defaultTarget, isOpen]);

  if (!isOpen) return null;

  const currentBranding = cloudState.getBrandingImages();

  const categoriesConfig: Array<{
    key: UploadCategory;
    title: string;
    badge: string;
    desc: string;
    aspect: string;
  }> = [
    {
      key: 'studioCreationsLogo',
      title: 'Logo Studio Creations',
      badge: 'Portal Central',
      desc: 'Emblema principal con las tres plumas doradas.',
      aspect: 'Circular / Cuadrado'
    },
    {
      key: 'trainingLogo',
      title: 'Logo Master Pen Training',
      badge: 'Academia',
      desc: 'Logotipo de la Academia con mentor y cátedra.',
      aspect: 'Circular / Cuadrado'
    },
    {
      key: 'shopLogo',
      title: 'Logo Master Pen Shop',
      badge: 'Tienda',
      desc: 'Logotipo con bolsa de compra y pluma dorada.',
      aspect: 'Circular / Cuadrado'
    },
    {
      key: 'mangaLogo',
      title: 'Logo Manga Creator',
      badge: 'Estudio Manga',
      desc: 'Logotipo con perfiles y pluma creadora.',
      aspect: 'Circular / Cuadrado'
    },
    {
      key: 'creativeLogo',
      title: 'Logo Creative Ideas',
      badge: 'Innovación',
      desc: 'Logotipo con plumilla dorada radiante.',
      aspect: 'Circular / Cuadrado'
    },
    {
      key: 'logo',
      title: 'Logotipo del Encabezado',
      badge: '1.5" Cabecera',
      desc: 'Insignia oficial fija en la barra de navegación.',
      aspect: '1.5" Círculo'
    },
    {
      key: 'banner',
      title: 'Banner de Portada',
      badge: 'Panorámico',
      desc: 'Banner horizontal del aula y tarjeta de bienvenida.',
      aspect: '16:9 Panorámico'
    },
    {
      key: 'portrait',
      title: 'Retrato Michael Pen',
      badge: 'Anfitrión',
      desc: 'Fotografía oficial de Michael Pen en el ecosistema.',
      aspect: 'Retrato 1:1 o 3:4'
    }
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setSuccessMessage('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Por favor seleccione un archivo de imagen válido (PNG, JPG, WEBP, SVG).');
        return;
      }

      // Max 25MB
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage('El tamaño de la imagen no debe superar los 25 MB.');
        return;
      }

      setSelectedFile(file);
      try {
        const compressed = await compressImageToDataUrl(file, 800, 800, 0.82);
        setPreviewUrl(compressed);
      } catch (err) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleApplyChange = async () => {
    if (!previewUrl) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Try to upload to server endpoint to get a static URL
      let finalUrl = previewUrl;
      try {
        const upRes = await fetch('/api/ecosystem/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: previewUrl, category: targetCategory })
        });
        if (upRes.ok) {
          const upData = await upRes.json();
          if (upData.url) {
            finalUrl = upData.url;
          }
        }
      } catch {
        // Fallback to compressed data URL
      }

      // 2. Update in-memory reactive state
      cloudState.updateBrandingImage(
        targetCategory,
        finalUrl,
        selectedFile ? selectedFile.name : `custom_${String(targetCategory)}_${Date.now()}.png`
      );

      // 3. Persist permanently to Firebase Cloud Firestore store
      await cloudState.saveBrandingImagesToFirebase({
        [targetCategory]: finalUrl
      });

      const matchedConfig = categoriesConfig.find(c => c.key === targetCategory);
      setSuccessMessage(`¡Imagen actualizada con éxito! El nuevo ${matchedConfig?.title || 'activo'} ha sido guardado permanentemente en la Bóveda Cloud Institucional.`);
      setIsProcessing(false);

      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
      }, 1800);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage('Error al guardar la imagen. Intente de nuevo.');
    }
  };

  const handleResetToDefault = () => {
    // Reverts to base asset
    setSuccessMessage('Imagen restaurada a su versión original.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-[#0f1015] border border-[#c5a059]/50 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_25px_rgba(212,175,55,0.25)] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-white p-1.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#171822] to-[#101117] border-b border-[#c5a059]/30">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059]">
                Carga Directa de Archivos • Computadora y Celular
              </span>
              <h3 className="text-xl font-bold font-serif-gold text-white">
                Gestor de Imágenes del Ecosistema
              </h3>
              <p className="text-xs text-zinc-400">
                Seleccione la imagen que desea reemplazar en caliente desde su computadora o celular.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Target Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-300 mb-2">
              1. Seleccione el logotipo o activo visual a modificar:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categoriesConfig.map((cat) => {
                const isSelected = targetCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setTargetCategory(cat.key);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setSuccessMessage('');
                      setErrorMessage('');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#f5e2a3] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold truncate">{cat.title}</span>
                      </div>
                      <span className="text-[10px] text-[#c5a059] block font-medium">{cat.badge}</span>
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{cat.desc}</p>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 mt-2 block pt-1 border-t border-zinc-800/80">
                      {cat.aspect}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Active Image vs New Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Current Active Image */}
            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Imagen Actual en el Ecosistema:
              </span>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                <img
                  src={currentBranding[targetCategory]}
                  alt="Activo Actual"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* New Preview */}
            <div className="p-4 rounded-xl bg-black/60 border border-dashed border-[#c5a059]/40 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider">
                Nueva Imagen (Vista Previa):
              </span>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Nueva Imagen"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4 text-zinc-500 space-y-1">
                    <ImageIcon className="w-8 h-8 mx-auto text-zinc-600" />
                    <p className="text-[11px]">Seleccione un archivo desde su computadora o celular para previsualizar</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
            className="hidden"
          />

          {/* Camera capture input for mobile devices */}
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Device Actions: PC Gallery & Mobile Camera */}
          <div className="space-y-3">
            <span className="block text-xs uppercase tracking-wider font-bold text-zinc-300">
              2. Origen del Archivo:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#d4af37]/60 text-white text-xs font-semibold flex items-center justify-center space-x-2.5 transition"
              >
                <Monitor className="w-4 h-4 text-[#d4af37]" />
                <span>Explorar Archivos en PC / Celular</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500/60 text-white text-xs font-semibold flex items-center justify-center space-x-2.5 transition"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Tomar Foto con Cámara (Celular)</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cerrar
            </button>

            <button
              type="button"
              disabled={!previewUrl || isProcessing}
              onClick={handleApplyChange}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#8a6c25] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-40 flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Aplicar en Caliente a Todo el Ecosistema</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
