import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Upload, 
  Trash2, 
  Plus, 
  Save, 
  RefreshCw, 
  Layers, 
  Image as ImageIcon, 
  Award, 
  ShieldCheck, 
  BrainCircuit, 
  FileText, 
  Video, 
  Music,
  CheckCircle,
  AlertCircle,
  Play,
  Presentation,
  BookOpen,
  FileDown,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Camera,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  X,
  Sparkles,
  Link,
  CheckCircle2,
  Mail,
  Key,
  Lock,
  Server,
  Send,
  Terminal,
  Shield,
  ShieldAlert,
  Check,
  CheckCheck,
  Copy,
  Volume2,
  VolumeX,
  Code,
  CloudLightning
} from 'lucide-react';
import { 
  AcademicBlock, 
  MediaResource, 
  CertificateTemplate, 
  CloudStorageAsset,
  ResourceType,
  SmtpSettings,
  SmtpConnectionTestResult,
  SafeInjectionItem,
  CustomDynamicPage
} from '../types';
import { CourseBlockData, CourseSlide, QUIERO_SER_ESCRITOR_BLOCKS } from '../data/quieroSerEscritorCourse';
import { INITIAL_BLOCKS } from '../data/initialData';
import { VoiceAgent } from '../services/voiceAgent';
import { cloudState, BrandingImages, MasterSyncResult } from '../services/cloudState';
import { BRANDING } from '../assets/branding';
import { parseMediaUrl } from '../services/mediaParser';
import { compressImageToDataUrl } from '../utils/imageCompressor';

export const AdminCMS: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'udemy_builder' | 'slides_editor' | 'image_manager' | 'certificate' | 'exams' | 'security' | 'injections' | 'universal_sdk'>('slides_editor');
  const [selectedSdkEcosystem, setSelectedSdkEcosystem] = useState<string>('Master Pen Training');
  const [copiedSdkCode, setCopiedSdkCode] = useState<boolean>(false);
  
  // Curriculum state
  const [blocks, setBlocks] = useState<AcademicBlock[]>(cloudState.getBlocks());
  const [introResource, setIntroResource] = useState<MediaResource>(cloudState.getIntroResource());
  const [certTemplate, setCertTemplate] = useState<CertificateTemplate>(cloudState.getCertificateTemplate());
  const [brandingImages, setBrandingImages] = useState<BrandingImages>(cloudState.getBrandingImages());
  const [storageAssets, setStorageAssets] = useState<CloudStorageAsset[]>(cloudState.getStorageAssets());
  const [saveFeedback, setSaveFeedback] = useState<string>('');

  // MÓDULO 4: Inyecciones Seguras y Páginas Dinámicas
  const [safeInjections, setSafeInjections] = useState<SafeInjectionItem[]>(() => cloudState.getSafeInjections());
  const [customPages, setCustomPages] = useState<CustomDynamicPage[]>(() => cloudState.getCustomPages());
  const [newInjTitle, setNewInjTitle] = useState<string>('');
  const [newInjPlacement, setNewInjPlacement] = useState<SafeInjectionItem['placement']>('curriculum_banner');
  const [newInjHtml, setNewInjHtml] = useState<string>('');
  const [newPageSlug, setNewPageSlug] = useState<string>('');
  const [newPageTitle, setNewPageTitle] = useState<string>('');
  const [newPageHtml, setNewPageHtml] = useState<string>('');
  const [newPageSchemaJson, setNewPageSchemaJson] = useState<string>('{\n  "fields": [\n    { "name": "nombre", "type": "text", "label": "Nombre Completo", "required": true },\n    { "name": "mensaje", "type": "textarea", "label": "Consulta", "required": true }\n  ]\n}');

  // Course Blocks & Slides State (Quiero ser Escritor y Cátedras en Firebase Cloud)
  const [courseBlocks, setCourseBlocks] = useState<CourseBlockData[]>(cloudState.getCourseBlocks());
  const [selectedCourseBlockId, setSelectedCourseBlockId] = useState<string>(courseBlocks[0]?.id || 'block_01');
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setCourseBlocks(cloudState.getCourseBlocks());
    });
    return () => unsub();
  }, []);

  // SMTP Configuration State
  const [smtpForm, setSmtpForm] = useState<SmtpSettings>(cloudState.getSmtpSettings());
  const [showSmtpPassword, setShowSmtpPassword] = useState<boolean>(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState<string>('admin@masterpentraining.com');
  const [isTestingSmtp, setIsTestingSmtp] = useState<boolean>(false);
  const [isSavingSmtp, setIsSavingSmtp] = useState<boolean>(false);
  const [smtpTestResult, setSmtpTestResult] = useState<SmtpConnectionTestResult | null>(null);
  const [smtpSaveFeedback, setSmtpSaveFeedback] = useState<{
    success: boolean;
    message: string;
    hash?: string;
    timestamp?: string;
    firestorePath?: string;
  } | null>(null);
  const [isPreviewingEmail, setIsPreviewingEmail] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // Selected block for lesson editing
  const [selectedBlockIdForLessons, setSelectedBlockIdForLessons] = useState<string>(blocks[0]?.id || 'block_01');

  // Modal for adding/editing a lesson (Udemy style)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);
  const [editingLessonTargetBlockId, setEditingLessonTargetBlockId] = useState<string>('block_01');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Lesson form state
  const [lessonForm, setLessonForm] = useState<{
    title: string;
    type: ResourceType;
    provider: 'youtube' | 'cloudflare' | 'gstorage' | 'vimeo' | 'direct' | 'slides' | 'pdf' | 'audio';
    storageUrl: string;
    durationMinutes: number;
    transcript: string;
    notes: string;
    previewFree: boolean;
    attachmentName: string;
    attachmentUrl: string;
  }>({
    title: '',
    type: 'video_youtube',
    provider: 'youtube',
    storageUrl: '',
    durationMinutes: 10,
    transcript: '',
    notes: '',
    previewFree: false,
    attachmentName: '',
    attachmentUrl: ''
  });

  // Test Webview modal state
  const [testWebviewUrl, setTestWebviewUrl] = useState<string | null>(null);

  // Image hot-replace direct PC/Mobile upload state
  const [selectedImageTarget, setSelectedImageTarget] = useState<keyof BrandingImages>('studioCreationsLogo');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [imageUploadStatus, setImageUploadStatus] = useState<string>('');

  // Ecosystem texts editable state
  const [ecosystemTexts, setEcosystemTexts] = useState({
    ctaTitle: brandingImages.ctaTitle || 'Conoce El Ecosistema Master Pen Studio Creations',
    ctaSubtitle: brandingImages.ctaSubtitle || 'Portal oficial de enlace con nuestras divisiones artísticas, literarias y formativas.',
    shopTitle: brandingImages.shopTitle || 'Master Pen Shop',
    shopTagline: brandingImages.shopTagline || 'Colección de Artículos y Piezas de Autor',
    mangaTitle: brandingImages.mangaTitle || 'Master Pen Manga Creator',
    mangaTagline: brandingImages.mangaTagline || 'Estudio de Narrativa y Creación Visual',
    creativeTitle: brandingImages.creativeTitle || 'Master Pen Creative Ideas',
    creativeTagline: brandingImages.creativeTagline || 'Laboratorio de Innovación & Retórica',
    trainingTitle: brandingImages.trainingTitle || 'Master Pen Training',
    trainingTagline: brandingImages.trainingTagline || 'Academia Digital y Formación Curricular'
  });

  // SMTP Presets for fast configuration
  const SMTP_PRESETS = [
    {
      id: 'mpt',
      label: 'Master Pen Enterprise (Oficial)',
      host: 'smtp.masterpentraining.com',
      port: 587,
      encryption: 'TLS' as const,
      senderEmail: 'seguridad@masterpentraining.com',
      senderName: 'Seguridad Master Pen Training',
      authUsername: 'masterpen_relay_auth'
    },
    {
      id: 'gmail',
      label: 'Google Workspace / Gmail',
      host: 'smtp.gmail.com',
      port: 587,
      encryption: 'TLS' as const,
      senderEmail: 'soporte@masterpentraining.com',
      senderName: 'Master Pen Training Support',
      authUsername: 'tu_cuenta@gmail.com'
    },
    {
      id: 'sendgrid',
      label: 'SendGrid / Twilio Cloud',
      host: 'smtp.sendgrid.net',
      port: 587,
      encryption: 'TLS' as const,
      senderEmail: 'no-reply@masterpentraining.com',
      senderName: 'Master Pen Cloud Auth',
      authUsername: 'apikey'
    },
    {
      id: 'ses',
      label: 'Amazon SES (AWS)',
      host: 'email-smtp.us-east-1.amazonaws.com',
      port: 587,
      encryption: 'TLS' as const,
      senderEmail: 'auth@masterpentraining.com',
      senderName: 'Master Pen AWS Relay',
      authUsername: 'AKIA_SES_SMTP_USER'
    },
    {
      id: 'office365',
      label: 'Microsoft 365 / Outlook',
      host: 'smtp.office365.com',
      port: 587,
      encryption: 'STARTTLS' as const,
      senderEmail: 'academia@masterpentraining.com',
      senderName: 'Academia Master Pen Training',
      authUsername: 'admin@tudominio.onmicrosoft.com'
    }
  ];

  const handleApplySmtpPreset = (preset: typeof SMTP_PRESETS[0]) => {
    setSmtpForm(prev => ({
      ...prev,
      host: preset.host,
      port: preset.port,
      encryption: preset.encryption,
      senderEmail: preset.senderEmail,
      senderName: preset.senderName,
      authUsername: preset.authUsername
    }));
  };

  const handleTestSmtpConnection = async () => {
    setIsTestingSmtp(true);
    setSmtpTestResult(null);
    try {
      cloudState.updateSmtpSettings(smtpForm);
      const res = await cloudState.testSmtpConnection(testEmailRecipient);
      setSmtpTestResult(res);
    } catch (e: any) {
      setSmtpTestResult({
        success: false,
        message: e?.message || 'Error desconocido al probar enlace SMTP',
        host: smtpForm.host,
        port: smtpForm.port,
        encryption: smtpForm.encryption,
        latencyMs: 0,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleSaveSmtpToFirebase = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSmtp(true);
    setSmtpSaveFeedback(null);
    try {
      const result = await cloudState.saveSmtpSettingsToFirebase(smtpForm);
      setSmtpSaveFeedback(result);
      setTimeout(() => {
        setSmtpSaveFeedback(null);
      }, 7000);
    } catch (e: any) {
      setSmtpSaveFeedback({
        success: false,
        message: 'No se pudo guardar la configuración SMTP: ' + (e?.message || 'Error de red')
      });
    } finally {
      setIsSavingSmtp(false);
    }
  };

  // Master Universal Synchronization State (Cursos Actuales y Futuros, Textos, Imágenes, Labels)
  const [isMasterSyncing, setIsMasterSyncing] = useState<boolean>(false);
  const [masterSyncResult, setMasterSyncResult] = useState<MasterSyncResult | null>(null);

  const [copiedRules, setCopiedRules] = useState<boolean>(false);

  const handleMasterSync = async () => {
    setIsMasterSyncing(true);
    setMasterSyncResult(null);
    try {
      const res = await cloudState.syncEntireEcosystemToFirebase();
      setMasterSyncResult(res);
      if (res.permissionDenied) {
        setSaveFeedback('⚠️ Cloud Firestore bloqueó la escritura remota por Reglas de Seguridad. Revisa la tarjeta de auditoría abajo.');
      } else {
        setSaveFeedback('✓ Sincronización Maestra Exitosa: Catálogo de cursos (Quiero ser Escritor y Escritura Creativa), diapositivas, logotipos, textos y labels persistidos en Cloud Firestore.');
      }
    } catch (e: any) {
      setSaveFeedback('Error en Sincronización Maestra: ' + (e?.message || 'Error de red'));
    } finally {
      setIsMasterSyncing(false);
    }
  };

  // Save Curriculum & Slides
  const handleSaveCurriculum = async () => {
    cloudState.updateBlocks(blocks);
    cloudState.updateIntroResource(introResource);
    cloudState.syncAllWithFirebase();
    await cloudState.saveCourseBlocksToFirebase(courseBlocks);
    setSaveFeedback(`✓ Cambios en el ecosistema y diapositivas guardados exitosamente en Firebase Cloud.`);
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  // Course Slides Handlers
  const selectedCourseBlock = courseBlocks.find(b => b.id === selectedCourseBlockId) || courseBlocks[0] || QUIERO_SER_ESCRITOR_BLOCKS[0];
  const currentSlide = selectedCourseBlock?.slides?.[selectedSlideIndex] || selectedCourseBlock?.slides?.[0] || QUIERO_SER_ESCRITOR_BLOCKS[0]?.slides?.[0];

  const handleUpdateCurrentSlideField = (field: keyof CourseSlide, value: any) => {
    if (!selectedCourseBlock || !currentSlide) return;
    const updatedBlocks = courseBlocks.map(b => {
      if (b.id !== selectedCourseBlock.id) return b;
      const updatedSlides = [...(b.slides || [])];
      updatedSlides[selectedSlideIndex] = {
        ...updatedSlides[selectedSlideIndex],
        [field]: value
      };
      return { ...b, slides: updatedSlides };
    });
    setCourseBlocks(updatedBlocks);
    cloudState.updateSlide(selectedCourseBlock.id, currentSlide.id, { [field]: value });
  };

  const handleUpdateCurrentBlockField = (field: keyof CourseBlockData, value: any) => {
    if (!selectedCourseBlock) return;
    const updatedBlocks = courseBlocks.map(b => {
      if (b.id !== selectedCourseBlock.id) return b;
      return { ...b, [field]: value };
    });
    setCourseBlocks(updatedBlocks);
    cloudState.updateCourseBlock({
      ...selectedCourseBlock,
      [field]: value
    });
  };

  const handleAddNewSlide = () => {
    if (!selectedCourseBlock) return;
    const nextNum = selectedCourseBlock.slides.length + 1;
    const newSlide: CourseSlide = {
      id: `${selectedCourseBlock.id}_s${nextNum}_${Date.now()}`,
      slideNumber: nextNum,
      blockNumber: selectedCourseBlock.blockNumber,
      title: `Nueva Diapositiva ${nextNum}`,
      subtitle: 'Subtítulo conceptual de la lección',
      expandedText: 'Escriba aquí el contenido formativo en español latinoamericano...',
      michaelPenNarration: 'Narración introductoria con voz en off de Michael Pen.',
      keyAxiom: 'Axioma fundamental de la cátedra.',
      writingExercise: 'Ejercicio de aplicación para el discípulo.',
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
      estimatedMinutes: 3.5
    };
    cloudState.addSlideToBlock(selectedCourseBlock.id, newSlide);
    const updated = cloudState.getCourseBlocks();
    setCourseBlocks(updated);
    setSelectedSlideIndex(selectedCourseBlock.slides.length);
    setSaveFeedback(`✓ Nueva diapositiva añadida al Bloque ${selectedCourseBlock.blockNumber}.`);
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  const handleDeleteCurrentSlide = (idx: number) => {
    if (!selectedCourseBlock || (selectedCourseBlock.slides?.length || 0) <= 1) {
      setSaveFeedback('Aviso: El bloque académico debe contener al menos una diapositiva formativa.');
      setTimeout(() => setSaveFeedback(''), 4000);
      return;
    }
    const targetSlide = selectedCourseBlock.slides?.[idx];
    if (!targetSlide) return;
    
    cloudState.deleteSlideFromBlock(selectedCourseBlock.id, targetSlide.id);
    const updated = cloudState.getCourseBlocks();
    setCourseBlocks(updated);
    setSelectedSlideIndex(Math.max(0, idx - 1));
    setSaveFeedback(`✓ Diapositiva "${targetSlide.title}" eliminada correctamente.`);
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  const handleSaveCourseSlidesToFirebase = async () => {
    try {
      const res = await cloudState.saveCourseBlocksToFirebase(courseBlocks);
      setSaveFeedback(`✓ ${res.message}`);
      setTimeout(() => setSaveFeedback(''), 4500);
    } catch (err: any) {
      setSaveFeedback(`Error al guardar en Firebase: ${err?.message || 'Error'}`);
    }
  };

  // Add new block (Module)
  const handleAddBlock = () => {
    const nextNum = blocks.length + 1;
    const newBlock: AcademicBlock = {
      id: `block_0${nextNum}`,
      blockNumber: nextNum,
      title: `Bloque ${nextNum}: Nueva Unidad de Alta Influencia`,
      subtitle: 'Configuración personalizada por Michael Pen',
      description: 'Definición de axiomas retóricos y objetivos de maestría.',
      isLockedForStudent: true,
      passingScoreRequired: 100,
      questionPoolSize: 50,
      resources: [
        {
          id: `res_b${nextNum}_01`,
          title: 'Masterclass: Inoculación Dialéctica',
          type: 'video_youtube',
          provider: 'youtube',
          storageUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          signedTokenExpiresAt: Date.now() + 15 * 60 * 1000,
          durationMinutes: 12,
          transcript: 'Transcripción inicial para indexación profunda y preguntas psicométricas de Michael Pen.',
          notes: 'Apuntes del instructor: la velocidad sintáctica condiciona la sumisión intelectual del decisor.',
          fileSizeBytes: 45000000,
          order: 1,
          previewFree: true
        }
      ]
    };

    const updated = [...blocks, newBlock];
    setBlocks(updated);
    cloudState.addBlock(newBlock);
    setSelectedBlockIdForLessons(newBlock.id);
    setSaveFeedback(`✓ Módulo ${nextNum} creado exitosamente.`);
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  // Delete block
  const handleDeleteBlock = (blockId: string) => {
    const updated = blocks.filter(b => b.id !== blockId);
    setBlocks(updated);
    cloudState.deleteBlock(blockId);
    if (selectedBlockIdForLessons === blockId && updated.length > 0) {
      setSelectedBlockIdForLessons(updated[0].id);
    }
  };

  // Open Lesson Modal for New Lesson
  const handleOpenNewLessonModal = (blockId: string) => {
    setEditingLessonTargetBlockId(blockId);
    setEditingLessonId(null);
    setLessonForm({
      title: '',
      type: 'video_youtube',
      provider: 'youtube',
      storageUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      durationMinutes: 15,
      transcript: '',
      notes: '',
      previewFree: false,
      attachmentName: '',
      attachmentUrl: ''
    });
    setIsLessonModalOpen(true);
  };

  // Open Lesson Modal for Editing Existing Lesson
  const handleOpenEditLessonModal = (blockId: string, resource: MediaResource) => {
    setEditingLessonTargetBlockId(blockId);
    setEditingLessonId(resource.id);
    setLessonForm({
      title: resource.title,
      type: resource.type,
      provider: resource.provider || 'youtube',
      storageUrl: resource.storageUrl,
      durationMinutes: resource.durationMinutes,
      transcript: resource.transcript,
      notes: resource.notes || '',
      previewFree: !!resource.previewFree,
      attachmentName: resource.attachments?.[0]?.name || '',
      attachmentUrl: resource.attachments?.[0]?.url || ''
    });
    setIsLessonModalOpen(true);
  };

  // Save Lesson from Modal
  const handleSaveLessonModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title || !lessonForm.storageUrl) return;

    const block = blocks.find(b => b.id === editingLessonTargetBlockId);
    if (!block) return;

    const attachments = lessonForm.attachmentUrl ? [
      {
        id: `att_${Date.now()}`,
        name: lessonForm.attachmentName || 'Guía de Apoyo PDF',
        url: lessonForm.attachmentUrl,
        size: '2.5 MB',
        type: 'pdf'
      }
    ] : [];

    if (editingLessonId) {
      // Update existing lesson
      const updatedResource: MediaResource = {
        id: editingLessonId,
        title: lessonForm.title,
        type: lessonForm.type,
        provider: lessonForm.provider,
        storageUrl: lessonForm.storageUrl,
        signedTokenExpiresAt: Date.now() + 15 * 60 * 1000,
        durationMinutes: Number(lessonForm.durationMinutes) || 10,
        transcript: lessonForm.transcript || 'Transcripción registrada en el sistema de cátedra.',
        notes: lessonForm.notes,
        previewFree: lessonForm.previewFree,
        fileSizeBytes: 50000000,
        order: 1,
        attachments
      };

      cloudState.updateResourceInBlock(editingLessonTargetBlockId, updatedResource);
    } else {
      // Add new lesson
      const newResource: MediaResource = {
        id: `res_${Date.now()}`,
        title: lessonForm.title,
        type: lessonForm.type,
        provider: lessonForm.provider,
        storageUrl: lessonForm.storageUrl,
        signedTokenExpiresAt: Date.now() + 15 * 60 * 1000,
        durationMinutes: Number(lessonForm.durationMinutes) || 10,
        transcript: lessonForm.transcript || 'Transcripción registrada en el sistema de cátedra.',
        notes: lessonForm.notes,
        previewFree: lessonForm.previewFree,
        fileSizeBytes: 50000000,
        order: block.resources.length + 1,
        attachments
      };

      cloudState.addResourceToBlock(editingLessonTargetBlockId, newResource);
    }

    setBlocks(cloudState.getBlocks());
    setIsLessonModalOpen(false);
    setSaveFeedback('✓ Lección guardada exitosamente.');
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  // Delete Lesson
  const handleDeleteLesson = (blockId: string, resourceId: string) => {
    cloudState.deleteResourceFromBlock(blockId, resourceId);
    setBlocks(cloudState.getBlocks());
  };

  // Move Lesson Up or Down
  const handleMoveLesson = (blockId: string, index: number, direction: 'up' | 'down') => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const resources = [...block.resources];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= resources.length) return;

    const temp = resources[index];
    resources[index] = resources[targetIdx];
    resources[targetIdx] = temp;

    cloudState.reorderResourcesInBlock(blockId, resources);
    setBlocks(cloudState.getBlocks());
  };

  // Image File Upload handler (PC or Mobile Camera/Gallery)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageToDataUrl(file, 800, 800, 0.82);
      setCustomImageUrl(compressed);
      setImageUploadStatus(`Archivo "${file.name}" optimizado y listo. Haz clic en "Guardar Imagen".`);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setCustomImageUrl(dataUrl);
          setImageUploadStatus(`Archivo "${file.name}" cargado exitosamente. Haz clic en "Guardar Imagen".`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Commit Image replacement
  const handleCommitImage = async (category: keyof BrandingImages) => {
    if (!customImageUrl) return;

    let finalUrl = customImageUrl;
    try {
      const upRes = await fetch('/api/ecosystem/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: customImageUrl, category })
      });
      if (upRes.ok) {
        const upData = await upRes.json();
        if (upData.url) finalUrl = upData.url;
      }
    } catch {}

    cloudState.updateBrandingImage(category, finalUrl, `custom_${String(category)}_${Date.now()}.png`);
    await cloudState.saveBrandingImagesToFirebase({ [category]: finalUrl });
    setBrandingImages(cloudState.getBrandingImages());
    setImageUploadStatus('');
    setCustomImageUrl('');
    setSaveFeedback(`✓ Imagen actualizada exitosamente en la Bóveda Cloud Institucional.`);
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  // Save Ecosystem Texts
  const handleSaveEcosystemTexts = (e: React.FormEvent) => {
    e.preventDefault();
    cloudState.updateBrandingTexts(ecosystemTexts);
    setBrandingImages(cloudState.getBrandingImages());
    setSaveFeedback('✓ Textos e información del ecosistema guardados exitosamente.');
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  // Save Certificate Template
  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    cloudState.updateCertificateTemplate(certTemplate);
    setSaveFeedback('✓ Plantilla de certificación oficial actualizada.');
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  const currentSelectedBlock = blocks.find(b => b.id === selectedBlockIdForLessons) || blocks[0] || INITIAL_BLOCKS[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* CMS Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14151e] via-[#0f1016] to-[#171922] border-2 border-[#c5a059]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] flex items-center space-x-1.5">
              <span>Gobernanza Total del Ecosistema</span>
              <span>•</span>
              <span className="text-[#f5e2a3] font-mono">Modo Administrador</span>
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-serif-gold text-white">
              Panel de Administración Master Pen
            </h2>
            <p className="text-xs text-zinc-400">
              Gestor de clases, sustitución de imágenes (PC/Celular) y contenidos del ecosistema.
            </p>
          </div>
        </div>

        {/* Global Save, Master Sync and Universal Agent Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            type="button" 
            onClick={() => {
              if ((window as any).UniversalAgent && (window as any).UniversalAgent.openControlPanel) {
                (window as any).UniversalAgent.openControlPanel();
              } else if ((window as any).MichaelPenAgent && (window as any).MichaelPenAgent.openControlPanel) {
                (window as any).MichaelPenAgent.openControlPanel();
              } else {
                alert('El Agente Michael Pen se está inicializando...');
              }
            }}
            style={{ padding: '10px 18px', background: '#0b0f17', color: '#d4af37', border: '1.5px solid #d4af37', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
            title="Despliega el Panel de Activación de Seudónimos, Voz y Avatar"
          >
            <span>⚙️ Configurar Agente Michael Pen & Seudónimos</span>
          </button>

          <button
            type="button"
            onClick={handleMasterSync}
            disabled={isMasterSyncing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-[#d4af37] to-[#aa8329] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(212,175,55,0.5)] flex items-center space-x-2 cursor-pointer border border-amber-200"
            title="Sincronizar automáticamente en Cloud Firestore todos los cursos (actuales y futuros), logotipos, imágenes, textos y labels con 1 solo clic"
          >
            <CloudLightning className={`w-4 h-4 text-black ${isMasterSyncing ? 'animate-spin' : ''}`} />
            <span>{isMasterSyncing ? 'Sincronizando Catálogo...' : 'Sincronizar Catálogo Completo (1 Clic)'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveCurriculum}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[#f5e2a3] border border-[#c5a059]/40 hover:border-[#d4af37] font-bold text-xs uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#d4af37]" />
            <span>Guardar Diapositivas</span>
          </button>
        </div>
      </div>

      {/* Master Synchronization Detailed Audit Report Card */}
      {masterSyncResult && (
        <div className={`p-5 rounded-2xl border-2 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 ${
          masterSyncResult.permissionDenied
            ? 'bg-gradient-to-br from-[#1a120f] via-[#120e0d] to-[#1c1310] border-amber-500/70 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
            : 'bg-gradient-to-br from-[#12131b] via-[#0d0e14] to-[#141622] border-[#d4af37]/60 shadow-[0_0_30px_rgba(212,175,55,0.25)]'
        }`}>
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${
                masterSyncResult.permissionDenied
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {masterSyncResult.permissionDenied ? <ShieldAlert className="w-5 h-5 text-amber-400" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-serif-gold flex items-center gap-2">
                  <span>Auditoría de Sincronización Maestra en Cloud Firestore</span>
                  {masterSyncResult.permissionDenied && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Permiso Denegado por Reglas
                    </span>
                  )}
                </h3>
                <p className={`text-xs ${masterSyncResult.permissionDenied ? 'text-amber-200' : 'text-zinc-400'}`}>
                  {masterSyncResult.message}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMasterSyncResult(null)}
              className="text-zinc-400 hover:text-white text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
            >
              Cerrar ✕
            </button>
          </div>

          {/* Diagnostic Guide for Permission Denied */}
          {masterSyncResult.permissionDenied && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 space-y-3 text-xs text-amber-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-200">
                    Causa: Las Reglas de Seguridad en Firebase Console bloquean la creación de documentos desde la web.
                  </p>
                  <p className="text-amber-300/80 leading-relaxed text-[11px]">
                    En tu consola de Firebase (proyecto <span className="font-mono font-bold text-white">master-pen-training</span>), pestaña <span className="font-bold text-white">Reglas</span>, Cloud Firestore tiene reglas que rechazan la escritura sin autenticación previa. Para habilitar que el botón escriba directamente los cursos y el branding, pega estas reglas y pulsa <strong>Publicar</strong>:
                  </p>
                </div>
              </div>

              <div className="relative">
                <pre className="p-3 rounded-lg bg-black/80 border border-amber-500/30 text-[11px] font-mono text-amber-200 overflow-x-auto leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /courses/{courseId} {
      allow read, write: if true;
    }
    match /course_slides/{courseId} {
      allow read, write: if true;
    }
    match /ecosystem_branding/{brandId} {
      allow read, write: if true;
    }
    match /academic_state/{stateId} {
      allow read, write: if true;
    }
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /courses/{courseId} {\n      allow read, write: if true;\n    }\n    match /course_slides/{courseId} {\n      allow read, write: if true;\n    }\n    match /ecosystem_branding/{brandId} {\n      allow read, write: if true;\n    }\n    match /academic_state/{stateId} {\n      allow read, write: if true;\n    }\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}`);
                    setCopiedRules(true);
                    setTimeout(() => setCopiedRules(false), 3000);
                  }}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 border border-amber-400/50 font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                >
                  {copiedRules ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRules ? '¡Copiado!' : 'Copiar Reglas'}</span>
                </button>
              </div>

              <p className="text-[11px] text-amber-400/90 italic">
                Una vez publicadas las reglas en Firebase Console, presiona nuevamente el botón dorado «⚡ Sincronizar Catálogo Completo (1 Clic)» y el curso «Escritura Creativa» aparecerá de inmediato en tu consola.
              </p>
            </div>
          )}

          {/* Cursos sincronizados */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37] font-bold">
              Catálogo de Cursos ({masterSyncResult.syncedCourses.length} cátedras preparadas para Firestore):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {masterSyncResult.syncedCourses.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{c.title}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Ruta: /courses/{c.id} • {c.blocksCount} Módulos • {c.slidesCount} Clases
                    </p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                    masterSyncResult.permissionDenied
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {masterSyncResult.permissionDenied ? 'Pendiente Regla' : 'Sincronizado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ecosistema, Textos y Etiquetas */}
          <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#f5e2a3]">Identidad, Logotipos, Retratos y Textos (/ecosystem_branding/master):</span>
              <p className="text-zinc-400 text-[11px]">
                {masterSyncResult.syncedBrandingCount} campos y etiquetas persistidos (logotipos, títulos, banners, etiquetas y textos del ecosistema).
              </p>
            </div>
            <div className="text-right text-[11px] font-mono text-zinc-500">
              <p>Hash: <span className="text-zinc-300">{masterSyncResult.hash.slice(0, 18)}...</span></p>
              <p>Fecha: <span className="text-zinc-300">{new Date(masterSyncResult.timestamp).toLocaleString()}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Global Save Feedback Alert */}
      {saveFeedback && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center space-x-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Navigation Subtabs */}
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2 overflow-x-auto scrollbar-thin">
        
        <button
          onClick={() => setActiveSubTab('slides_editor')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
            activeSubTab === 'slides_editor'
              ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Diapositivas y Cátedras (Firebase Cloud)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('udemy_builder')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
            activeSubTab === 'udemy_builder'
              ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Módulos y Clases (Tipo Udemy)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('image_manager')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
            activeSubTab === 'image_manager'
              ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Cargar / Cambiar Imágenes (PC & Celular)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certificate')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
            activeSubTab === 'certificate'
              ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Plantilla Certificación Michael Pen</span>
        </button>

        <button
          onClick={() => setActiveSubTab('exams')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
            activeSubTab === 'exams'
              ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Banco 50 Variantes Psicométricas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
            activeSubTab === 'security'
              ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Seguridad Perimetral & SMTP</span>
        </button>

        <button
          onClick={() => setActiveSubTab('injections')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition cursor-pointer ${
            activeSubTab === 'injections'
              ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Inyecciones Seguras & Páginas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('universal_sdk')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition cursor-pointer ${
            activeSubTab === 'universal_sdk'
              ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>SDK Universal Michael Pen (Embed)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 0: EDITOR DE DIAPOSITIVAS Y CÁTEDRAS EN FIREBASE CLOUD */}
      {/* ========================================================================= */}
      {activeSubTab === 'slides_editor' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Information & Cloud Persistence Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12141c] via-[#0f1118] to-[#141622] border-2 border-[#c5a059]/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e2a3] text-xs font-semibold">
                  <BookOpen className="w-4 h-4 text-[#d4af37]" />
                  <span>Cátedras Oficiales • Sincronización en Firebase Cloud</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-serif-gold text-white tracking-wide">
                  Editor de Diapositivas y Textos del Curso
                </h3>
                <p className="text-xs text-zinc-300 max-w-3xl font-light leading-relaxed">
                  Modifica los textos, lecciones, narraciones de voz y axiomas de cada diapositiva en español latinoamericano. Todo cambio se guarda de forma persistente en la colección <span className="font-mono text-[#f5e2a3]">course_slides</span> de Cloud Firestore.
                </p>
              </div>

              <div className="shrink-0 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveCourseSlidesToFirebase}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5e2a3] to-[#c5a059] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Diapositivas en Firebase</span>
                </button>
              </div>
            </div>
          </div>

          {/* Selector de Bloques Curriculares */}
          <div className="p-4 bg-[#101117] border border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-[#c5a059] tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Seleccionar Bloque del Curso:</span>
              </span>
              <span className="text-[11px] text-zinc-400">
                {courseBlocks.length} Bloques estructurados en el programa
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
              {courseBlocks.map((b) => {
                const isSelected = selectedCourseBlockId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedCourseBlockId(b.id);
                      setSelectedSlideIndex(0);
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-[#d4af37] text-black font-bold border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                        : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase opacity-75">
                      Bloque {b.blockNumber}
                    </div>
                    <div className="text-xs font-bold truncate mt-0.5">
                      {b.title.split(':')[1]?.trim() || b.title}
                    </div>
                    <div className="text-[10px] opacity-80 mt-1 flex items-center justify-between">
                      <span>{b.slides?.length || 0} diapositivas</span>
                      <span>Bloque #{b.blockNumber}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configuración del Bloque Actual */}
          {selectedCourseBlock && (
            <div className="p-6 rounded-2xl bg-[#111218] border border-[#c5a059]/30 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#d4af37]" />
                  <span>Configuración General del Bloque {selectedCourseBlock.blockNumber}</span>
                </h4>
                <span className="text-[11px] text-[#f5e2a3] font-mono">ID: {selectedCourseBlock.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Título del Bloque:</label>
                  <input
                    type="text"
                    value={selectedCourseBlock.title}
                    onChange={(e) => handleUpdateCurrentBlockField('title', e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Subtítulo Académico:</label>
                  <input
                    type="text"
                    value={selectedCourseBlock.subtitle}
                    onChange={(e) => handleUpdateCurrentBlockField('subtitle', e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Descripción Pedagógica:</label>
                  <input
                    type="text"
                    value={selectedCourseBlock.description}
                    onChange={(e) => handleUpdateCurrentBlockField('description', e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Diapositivas: Selector y Gestor */}
          {selectedCourseBlock && (
            <div className="p-6 rounded-2xl bg-[#0e1017] border-2 border-[#c5a059]/40 space-y-6 shadow-2xl">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Presentation className="w-4 h-4 text-[#d4af37]" />
                    <span>Diapositivas de la Cátedra ({selectedCourseBlock.slides?.length || 0})</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Selecciona una diapositiva para editar su texto completo, lección en audio de Michael Pen e ilustraciones.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleAddNewSlide}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f5e2a3] text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Añadir Diapositiva</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCurrentSlide(selectedSlideIndex)}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-rose-950/60 border border-zinc-700 hover:border-rose-500/50 text-rose-300 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Eliminar Actual</span>
                  </button>
                </div>
              </div>

              {/* Tira de Navegación de Diapositivas */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
                {(selectedCourseBlock.slides || []).map((s, idx) => {
                  const isCurrent = idx === selectedSlideIndex;
                  return (
                    <button
                      key={s.id || idx}
                      type="button"
                      onClick={() => {
                        setSelectedSlideIndex(idx);
                        VoiceAgent.stopSpeaking();
                        setIsTestingVoice(false);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 border shrink-0 ${
                        isCurrent
                          ? 'bg-[#d4af37] text-black font-bold border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                          : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-75">#{s.slideNumber || idx + 1}</span>
                      <span className="max-w-[140px] truncate">{s.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Formulario de Edición de la Diapositiva Seleccionada */}
              {currentSlide && (
                <div className="space-y-6 pt-2">
                  
                  {/* Meta Bar de la Diapositiva */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="md:col-span-2">
                      <label className="block font-semibold text-zinc-300 mb-1">
                        Título de la Diapositiva: <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) => handleUpdateCurrentSlideField('title', e.target.value)}
                        className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 text-white focus:border-[#d4af37] focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-300 mb-1">
                        Tiempo Estimado de Estudio (Minutos):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={currentSlide.estimatedMinutes}
                        onChange={(e) => handleUpdateCurrentSlideField('estimatedMinutes', parseFloat(e.target.value) || 2)}
                        className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 text-white focus:border-[#d4af37] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block font-semibold text-zinc-300 mb-1">
                        Subtítulo o Resumen Conceptual:
                      </label>
                      <input
                        type="text"
                        value={currentSlide.subtitle}
                        onChange={(e) => handleUpdateCurrentSlideField('subtitle', e.target.value)}
                        className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Campo 1: Texto Completo de la Cátedra (Español Latinoamericano) */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#f5e2a3] flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-[#d4af37]" />
                        <span>Contenido Textual de la Lección (Español Latinoamericano Culto):</span>
                      </label>
                      <span className="text-[10px] text-zinc-400">
                        {currentSlide.expandedText?.length || 0} caracteres
                      </span>
                    </div>
                    <textarea
                      rows={7}
                      value={currentSlide.expandedText}
                      onChange={(e) => handleUpdateCurrentSlideField('expandedText', e.target.value)}
                      placeholder="Redacta el desarrollo pedagógico de la lección en español latinoamericano..."
                      className="w-full bg-black border border-zinc-700 rounded-2xl p-4 text-xs text-zinc-200 leading-relaxed focus:border-[#d4af37] focus:outline-none font-serif"
                    />
                    <p className="text-[11px] text-zinc-500">
                      Este texto es el que visualizan los discípulos en la diapositiva del visor del curso y sobre el cual realizan sus apuntes y estudio.
                    </p>
                  </div>

                  {/* Campo 2: Narración Vocal de Michael Pen con Prueba de Audio en Vivo */}
                  <div className="p-5 rounded-2xl bg-[#111218] border border-[#d4af37]/40 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <label className="font-semibold text-white flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-[#d4af37]" />
                          <span>Locución Oficial Michael Pen (Voz en off 3x más grave, hombre maduro):</span>
                        </label>
                        <p className="text-[10px] text-zinc-400">
                          Texto que pronuncia el agente Michael Pen con cadencia y acento latinoamericano sobrio.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isTestingVoice ? (
                          <button
                            type="button"
                            onClick={() => {
                              VoiceAgent.stopSpeaking();
                              setIsTestingVoice(false);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center space-x-1.5 transition cursor-pointer"
                          >
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Detener Voz</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const textToSpeak = currentSlide.michaelPenNarration || currentSlide.title;
                              VoiceAgent.speakMichaelPen(
                                textToSpeak,
                                () => setIsTestingVoice(true),
                                () => setIsTestingVoice(false)
                              );
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#8a6c25] hover:brightness-110 text-black font-bold text-[11px] flex items-center space-x-1.5 transition shadow-[0_0_12px_rgba(212,175,55,0.3)] cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Escuchar Locución en Vivo</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={currentSlide.michaelPenNarration}
                      onChange={(e) => handleUpdateCurrentSlideField('michaelPenNarration', e.target.value)}
                      placeholder="Escribe la narración que pronunciará la voz madura y profunda de Michael Pen..."
                      className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  {/* Campo 3: Axioma Clave y Ejercicio Práctico */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-[#f5e2a3] mb-1 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Axioma / Principio Clave de la Cátedra:</span>
                      </label>
                      <textarea
                        rows={3}
                        value={currentSlide.keyAxiom}
                        onChange={(e) => handleUpdateCurrentSlideField('keyAxiom', e.target.value)}
                        placeholder="Sentencia categórica que resume el principio literario..."
                        className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-400 mb-1 flex items-center space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ejercicio Práctico Aplicado:</span>
                      </label>
                      <textarea
                        rows={3}
                        value={currentSlide.writingExercise}
                        onChange={(e) => handleUpdateCurrentSlideField('writingExercise', e.target.value)}
                        placeholder="Instrucción de práctica directa para el estudiante..."
                        className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Campo 4: Imagen de la Diapositiva con Vista Previa */}
                  <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <label className="font-semibold text-zinc-300 flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                        <span>URL de Imagen de la Diapositiva (HD):</span>
                      </label>
                      <span className="text-[10px] text-zinc-500">Unsplash, Cloud Storage o servidor local</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={currentSlide.imageUrl}
                          onChange={(e) => handleUpdateCurrentSlideField('imageUrl', e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-black border border-zinc-700 rounded-xl py-2 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono"
                        />
                        <p className="text-[11px] text-zinc-400">
                          Puedes colocar cualquier enlace seguro HTTPS o imagen almacenada en la plataforma.
                        </p>
                      </div>

                      {currentSlide.imageUrl && (
                        <div className="w-32 h-20 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 shrink-0">
                          <img
                            src={currentSlide.imageUrl}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones de Cierre de la Diapositiva */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800">
                    <span className="text-[11px] text-zinc-400">
                      Diapositiva <strong className="text-white">{selectedSlideIndex + 1}</strong> de <strong className="text-white">{selectedCourseBlock.slides?.length || 0}</strong> en Bloque {selectedCourseBlock.blockNumber}
                    </span>

                    <button
                      type="button"
                      onClick={handleSaveCourseSlidesToFirebase}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5e2a3] to-[#c5a059] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Todo en Firebase Cloud</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 1: GESTOR DE MÓDULOS Y CLASES TIPO UDEMY */}
      {/* ========================================================================= */}
      {activeSubTab === 'udemy_builder' && (
        <div className="space-y-6">
          
          {/* Information Banner: Streaming optimization */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#171922] to-[#12131b] border border-[#c5a059]/30 flex items-start space-x-3 text-xs text-zinc-300">
            <Sparkles className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#f5e2a3] text-sm">
                Integración Multimedia de Alto Rendimiento:
              </p>
              <p className="mt-1 text-zinc-400 leading-relaxed">
                Puedes añadir clases utilizando enlaces de <strong className="text-white">YouTube</strong>, <strong className="text-white">Cloudflare Stream</strong>, <strong className="text-white">Google Cloud Storage</strong>, <strong className="text-white">Google Slides</strong> o <strong className="text-white">PDFs</strong>. El reproductor integrado reproduce el contenido de forma fluida y protegida sin sobrecargar el almacenamiento.
              </p>
            </div>
          </div>

          {/* Module Selector & Creator Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#101117] border border-zinc-800 rounded-xl">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
              {blocks.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBlockIdForLessons(b.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedBlockIdForLessons === b.id
                      ? 'bg-[#d4af37] text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  Módulo {idx + 1}: {b.title.split(':')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddBlock}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5e2a3] text-xs font-bold flex items-center space-x-1.5 transition"
            >
              <Plus className="w-4 h-4 text-[#d4af37]" />
              <span>Añadir Módulo / Bloque</span>
            </button>
          </div>

          {/* Current Module Overview and Lesson Manager */}
          {currentSelectedBlock && (
            <div className="p-6 rounded-2xl bg-[#111218] border-2 border-[#c5a059]/40 space-y-6">
              
              {/* Module Metadata Form */}
              <div className="space-y-4 pb-6 border-b border-zinc-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs uppercase font-bold text-[#c5a059] flex items-center space-x-2">
                    <Layers className="w-4 h-4" />
                    <span>Configuración del Módulo {currentSelectedBlock.blockNumber}</span>
                  </span>

                  <button
                    onClick={() => handleDeleteBlock(currentSelectedBlock.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/60 text-xs flex items-center space-x-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Módulo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Título del Módulo:</label>
                    <input
                      type="text"
                      value={currentSelectedBlock.title}
                      onChange={(e) => {
                        const updated = blocks.map(b => b.id === currentSelectedBlock.id ? { ...b, title: e.target.value } : b);
                        setBlocks(updated);
                      }}
                      className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Subtítulo Pedagógico:</label>
                    <input
                      type="text"
                      value={currentSelectedBlock.subtitle}
                      onChange={(e) => {
                        const updated = blocks.map(b => b.id === currentSelectedBlock.id ? { ...b, subtitle: e.target.value } : b);
                        setBlocks(updated);
                      }}
                      className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Descripción del Módulo:</label>
                    <textarea
                      rows={2}
                      value={currentSelectedBlock.description}
                      onChange={(e) => {
                        const updated = blocks.map(b => b.id === currentSelectedBlock.id ? { ...b, description: e.target.value } : b);
                        setBlocks(updated);
                      }}
                      className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Lesson List Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Video className="w-4 h-4 text-[#d4af37]" />
                    <span>Clases y Lecciones de este Módulo ({currentSelectedBlock.resources.length})</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Arrastra, reordena o edita enlaces de video y diapositivas de cada cátedra.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenNewLessonModal(currentSelectedBlock.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#8a6c25] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Clase</span>
                </button>
              </div>

              {/* Lesson Items Table / List */}
              <div className="space-y-3">
                {currentSelectedBlock.resources.map((res, index) => (
                  <div 
                    key={res.id} 
                    className="p-4 rounded-xl bg-black/60 border border-zinc-800 hover:border-[#c5a059]/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[#d4af37] shrink-0 mt-0.5">
                        {res.type === 'slide_audio' || res.type === 'slides_embed' ? (
                          <Presentation className="w-4 h-4 text-yellow-400" />
                        ) : res.type === 'document_pdf' ? (
                          <FileText className="w-4 h-4 text-emerald-400" />
                        ) : res.type === 'audio_track' ? (
                          <Music className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Video className="w-4 h-4 text-[#d4af37]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-white truncate">{index + 1}. {res.title}</span>
                          {res.previewFree && (
                            <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                              Vista Previa Gratis
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 font-mono truncate mt-0.5 max-w-lg">
                          URL: {res.storageUrl}
                        </p>
                        <p className="text-[10px] text-[#c5a059] flex items-center space-x-2 mt-1">
                          <span>Duración: {res.durationMinutes} min</span>
                          <span>•</span>
                          <span className="capitalize">{res.provider || 'Webview'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 shrink-0">
                      
                      {/* Test in Webview Button */}
                      <button
                        onClick={() => setTestWebviewUrl(res.storageUrl)}
                        title="Probar en Webview integrado"
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[#f5e2a3] text-xs font-medium flex items-center space-x-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Probar</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditLessonModal(currentSelectedBlock.id, res)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition"
                      >
                        Editar
                      </button>

                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveLesson(currentSelectedBlock.id, index, 'up')}
                        disabled={index === 0}
                        title="Subir orden"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-400"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMoveLesson(currentSelectedBlock.id, index, 'down')}
                        disabled={index === currentSelectedBlock.resources.length - 1}
                        title="Bajar orden"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-400"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteLesson(currentSelectedBlock.id, res.id)}
                        title="Eliminar clase"
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: GESTIÓN DE IMÁGENES, LOGOTIPOS Y TEXTOS DEL ECOSISTEMA */}
      {/* ========================================================================= */}
      {activeSubTab === 'image_manager' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          
          <div className="p-5 rounded-2xl bg-[#13151f] border border-[#c5a059]/40 flex items-start space-x-3 text-xs text-zinc-300 shadow-xl">
            <Camera className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#f5e2a3] text-sm">
                Gestión Centralizada de Identidad Visual y Contenidos:
              </p>
              <p className="mt-1 text-zinc-300 leading-relaxed">
                Selecciona cualquier imagen o fotografía desde tu computadora o teléfono celular (galería o cámara). Al presionar <strong className="text-[#f5e2a3]">«Guardar Imagen»</strong>, el cambio se aplicará de forma inmediata y permanente en todo el ecosistema.
              </p>
            </div>
          </div>

          {/* SECCIÓN 1: LOGOTIPOS DEL ECOSISTEMA MASTER PEN STUDIO CREATIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>Logotipos Oficiales del Ecosistema (5 Divisiones)</span>
              </h4>
              <span className="text-[11px] text-zinc-400">Totalmente reemplazables</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* 1. MASTER PEN STUDIO CREATIONS */}
              <div className="p-4 rounded-2xl bg-[#101117] border-2 border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.15)] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#f5e2a3] uppercase">Studio Creations</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#f5e2a3] border border-[#d4af37]/30">Portal</span>
                  </div>
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#d4af37] bg-white flex items-center justify-center p-1 shadow-md">
                    <img src={brandingImages.studioCreationsLogo} alt="Studio Creations" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[10px] text-zinc-400 text-center line-clamp-2">Emblema principal sobre el llamado a la acción.</p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <label className="block w-full text-center px-2 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-[#f5e2a3] cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 inline mr-1 text-[#d4af37]" />
                    <span>Cambiar</span>
                    <input type="file" accept="image/*" onChange={(e) => { setSelectedImageTarget('studioCreationsLogo'); handleFileChange(e); }} className="hidden" />
                  </label>
                  {selectedImageTarget === 'studioCreationsLogo' && customImageUrl && (
                    <button onClick={() => handleCommitImage('studioCreationsLogo')} className="w-full py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-[10px] uppercase tracking-wider transition shadow-lg">
                      Guardar Imagen
                    </button>
                  )}
                </div>
              </div>

              {/* 2. MASTER PEN TRAINING */}
              <div className="p-4 rounded-2xl bg-[#101117] border-2 border-emerald-500/40 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-300 uppercase">Training</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">Academia</span>
                  </div>
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-[#d4af37] bg-black flex items-center justify-center p-1 shadow-md">
                    <img src={brandingImages.trainingLogo} alt="Master Pen Training" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[10px] text-zinc-400 text-center line-clamp-2">Logo sobresaliente en la academia y botón amigo.</p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <label className="block w-full text-center px-2 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-[#f5e2a3] cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 inline mr-1 text-[#d4af37]" />
                    <span>Cambiar</span>
                    <input type="file" accept="image/*" onChange={(e) => { setSelectedImageTarget('trainingLogo'); handleFileChange(e); }} className="hidden" />
                  </label>
                  {selectedImageTarget === 'trainingLogo' && customImageUrl && (
                    <button onClick={() => handleCommitImage('trainingLogo')} className="w-full py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-[10px] uppercase tracking-wider transition shadow-lg">
                      Guardar Imagen
                    </button>
                  )}
                </div>
              </div>

              {/* 3. MASTER PEN SHOP */}
              <div className="p-4 rounded-2xl bg-[#101117] border border-zinc-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-zinc-300 uppercase">Shop</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Tienda</span>
                  </div>
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-zinc-700 bg-black flex items-center justify-center p-1 shadow-md">
                    <img src={brandingImages.shopLogo} alt="Master Pen Shop" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[10px] text-zinc-400 text-center line-clamp-2">Botón de enlace amigo para la tienda de autor.</p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <label className="block w-full text-center px-2 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-[#f5e2a3] cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 inline mr-1 text-[#d4af37]" />
                    <span>Cambiar</span>
                    <input type="file" accept="image/*" onChange={(e) => { setSelectedImageTarget('shopLogo'); handleFileChange(e); }} className="hidden" />
                  </label>
                  {selectedImageTarget === 'shopLogo' && customImageUrl && (
                    <button onClick={() => handleCommitImage('shopLogo')} className="w-full py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-[10px] uppercase tracking-wider transition shadow-lg">
                      Guardar Imagen
                    </button>
                  )}
                </div>
              </div>

              {/* 4. MASTER PEN MANGA CREATOR */}
              <div className="p-4 rounded-2xl bg-[#101117] border border-zinc-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-zinc-300 uppercase">Manga Creator</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Estudio</span>
                  </div>
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-zinc-700 bg-black flex items-center justify-center p-1 shadow-md">
                    <img src={brandingImages.mangaLogo} alt="Manga Creator" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[10px] text-zinc-400 text-center line-clamp-2">Botón de enlace amigo para la división de manga.</p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <label className="block w-full text-center px-2 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-[#f5e2a3] cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 inline mr-1 text-[#d4af37]" />
                    <span>Cambiar</span>
                    <input type="file" accept="image/*" onChange={(e) => { setSelectedImageTarget('mangaLogo'); handleFileChange(e); }} className="hidden" />
                  </label>
                  {selectedImageTarget === 'mangaLogo' && customImageUrl && (
                    <button onClick={() => handleCommitImage('mangaLogo')} className="w-full py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-[10px] uppercase tracking-wider transition shadow-lg">
                      Guardar Imagen
                    </button>
                  )}
                </div>
              </div>

              {/* 5. MASTER PEN CREATIVE IDEAS */}
              <div className="p-4 rounded-2xl bg-[#101117] border border-zinc-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-zinc-300 uppercase">Creative Ideas</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Innovación</span>
                  </div>
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-zinc-700 bg-black flex items-center justify-center p-1 shadow-md">
                    <img src={brandingImages.creativeLogo} alt="Creative Ideas" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[10px] text-zinc-400 text-center line-clamp-2">Botón de enlace amigo para ideas creativas.</p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <label className="block w-full text-center px-2 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-[#f5e2a3] cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 inline mr-1 text-[#d4af37]" />
                    <span>Cambiar</span>
                    <input type="file" accept="image/*" onChange={(e) => { setSelectedImageTarget('creativeLogo'); handleFileChange(e); }} className="hidden" />
                  </label>
                  {selectedImageTarget === 'creativeLogo' && customImageUrl && (
                    <button onClick={() => handleCommitImage('creativeLogo')} className="w-full py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-[10px] uppercase tracking-wider transition shadow-lg">
                      Guardar Imagen
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SECCIÓN 2: ACTIVOS INSTITUCIONALES (CABECERA, PORTADA, PERFIL) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#d4af37]" />
                <span>Activos Institucionales y Multimedia de Cabecera</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CARD 1: LOGOTIPO (1.5 pulgadas de diámetro) */}
              <div className="p-5 rounded-2xl bg-[#101117] border-2 border-[#c5a059]/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#c5a059]">Logotipo de Cabecera</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-black/60 text-[#f5e2a3] border border-zinc-800">
                      1.5 pulgadas (144px)
                    </span>
                  </div>

                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#d4af37] bg-black shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center p-1">
                    <img 
                      src={brandingImages.logo} 
                      alt="Logo Actual" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <p className="text-[11px] text-zinc-400 text-center">
                    Barra de navegación principal y credenciales oficiales.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-800">
                  <label className="block w-full text-center px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-[#f5e2a3] cursor-pointer transition">
                    <Upload className="w-4 h-4 inline mr-1.5 text-[#d4af37]" />
                    <span>Subir desde PC o Celular</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setSelectedImageTarget('logo');
                        handleFileChange(e);
                      }}
                      className="hidden"
                    />
                  </label>

                  {selectedImageTarget === 'logo' && customImageUrl && (
                    <button
                      onClick={() => handleCommitImage('logo')}
                      className="w-full py-2 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider transition shadow-lg"
                    >
                      Guardar Imagen
                    </button>
                  )}
                </div>
              </div>

              {/* CARD 2: BANNER OFICIAL MICHAEL PEN */}
              <div className="p-5 rounded-2xl bg-[#101117] border-2 border-[#c5a059]/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#c5a059]">Banner Panorámico</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-black/60 text-[#f5e2a3] border border-zinc-800">
                      16:9 Panorámico
                    </span>
                  </div>

                  <div className="w-full h-24 rounded-xl overflow-hidden border border-[#d4af37] bg-black shadow-lg">
                    <img 
                      src={brandingImages.banner} 
                      alt="Banner Actual" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-[11px] text-zinc-400 text-center">
                    Portada del aula y fondo de bienvenida institucional.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-800">
                  <label className="block w-full text-center px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-[#f5e2a3] cursor-pointer transition">
                    <Upload className="w-4 h-4 inline mr-1.5 text-[#d4af37]" />
                    <span>Subir desde PC o Celular</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setSelectedImageTarget('banner');
                        handleFileChange(e);
                      }}
                      className="hidden"
                    />
                  </label>

                  {selectedImageTarget === 'banner' && customImageUrl && (
                    <button
                      onClick={() => handleCommitImage('banner')}
                      className="w-full py-2 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider transition shadow-lg"
                    >
                      Guardar Imagen
                    </button>
                  )}
                </div>
              </div>

              {/* CARD 3: RETRATO OFICIAL MICHAEL PEN */}
              <div className="p-5 rounded-2xl bg-[#101117] border-2 border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.2)] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#c5a059]">Foto de Perfil / Anfitrión</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f5e2a3] border border-[#d4af37]/40 font-bold">
                      Director
                    </span>
                  </div>

                  <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-[#d4af37] bg-black shadow-[0_0_25px_rgba(212,175,55,0.5)]">
                    <img 
                      src={brandingImages.portrait} 
                      alt="Retrato Oficial" 
                      className="w-full h-full object-cover object-top filter contrast-110"
                    />
                  </div>

                  <p className="text-[11px] text-zinc-400 text-center">
                    Fotografía oficial de Michael Pen y avatar del anfitrión.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-800">
                  <label className="block w-full text-center px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-[#f5e2a3] cursor-pointer transition">
                    <Camera className="w-4 h-4 inline mr-1.5 text-[#d4af37]" />
                    <span>Subir desde PC o Celular</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setSelectedImageTarget('portrait');
                        handleFileChange(e);
                      }}
                      className="hidden"
                    />
                  </label>

                  {selectedImageTarget === 'portrait' && customImageUrl && (
                    <button
                      onClick={() => handleCommitImage('portrait')}
                      className="w-full py-2 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider transition shadow-lg"
                    >
                      Guardar Imagen
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SECCIÓN 3: EDICIÓN DE TEXTOS DEL LLAMADO A LA ACCIÓN Y DIVISIONES */}
          <div className="p-6 rounded-3xl bg-[#0e1017] border-2 border-[#c5a059]/40 space-y-6 shadow-2xl">
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3 text-[#d4af37]">
              <Sparkles className="w-5 h-5" />
              <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider">
                Textos Oficiales del Ecosistema y Divisiones
              </h4>
            </div>

            <form onSubmit={handleSaveEcosystemTexts} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Título de Llamado a la Acción (Pantalla Principal):
                  </label>
                  <input
                    type="text"
                    value={ecosystemTexts.ctaTitle}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, ctaTitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white font-serif-gold focus:border-[#d4af37] focus:outline-none"
                    placeholder="Conoce El Ecosistema Master Pen Studio Creations"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Subtítulo / Leyenda Complementaria:
                  </label>
                  <input
                    type="text"
                    value={ecosystemTexts.ctaSubtitle}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, ctaSubtitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white focus:border-[#d4af37] focus:outline-none"
                    placeholder="Portal oficial de enlace con nuestras divisiones artísticas, literarias y formativas."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-bold text-[#f5e2a3] uppercase block">Master Pen Shop</span>
                  <input
                    type="text"
                    value={ecosystemTexts.shopTitle}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, shopTitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-[11px]"
                    placeholder="Master Pen Shop"
                  />
                  <input
                    type="text"
                    value={ecosystemTexts.shopTagline}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, shopTagline: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                    placeholder="Colección de Artículos y Piezas de Autor"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-bold text-[#f5e2a3] uppercase block">Manga Creator</span>
                  <input
                    type="text"
                    value={ecosystemTexts.mangaTitle}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, mangaTitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-[11px]"
                    placeholder="Master Pen Manga Creator"
                  />
                  <input
                    type="text"
                    value={ecosystemTexts.mangaTagline}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, mangaTagline: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                    placeholder="Estudio de Narrativa y Creación Visual"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-bold text-[#f5e2a3] uppercase block">Creative Ideas</span>
                  <input
                    type="text"
                    value={ecosystemTexts.creativeTitle}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, creativeTitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-[11px]"
                    placeholder="Master Pen Creative Ideas"
                  />
                  <input
                    type="text"
                    value={ecosystemTexts.creativeTagline}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, creativeTagline: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                    placeholder="Laboratorio de Innovación & Retórica"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase block">Master Pen Training</span>
                  <input
                    type="text"
                    value={ecosystemTexts.trainingTitle}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, trainingTitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-[11px]"
                    placeholder="Master Pen Training"
                  />
                  <input
                    type="text"
                    value={ecosystemTexts.trainingTagline}
                    onChange={(e) => setEcosystemTexts({ ...ecosystemTexts, trainingTagline: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                    placeholder="Academia Digital y Formación Curricular"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5e2a3] to-[#c5a059] hover:from-[#c5a059] hover:to-[#b38f2e] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
                >
                  Guardar Textos del Ecosistema
                </button>
              </div>
            </form>
          </div>

          {imageUploadStatus && (
            <div className="p-3 bg-zinc-900 border border-[#d4af37]/40 rounded-xl text-xs text-[#f5e2a3]">
              {imageUploadStatus}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: PLANTILLA DE CERTIFICACIÓN MICHAEL PEN */}
      {/* ========================================================================= */}
      {activeSubTab === 'certificate' && (
        <div className="p-6 rounded-2xl bg-[#111218] border border-[#c5a059]/40 space-y-6">
          <div>
            <h3 className="text-lg font-bold font-serif-gold text-white">
              Gobernanza del Certificado Oficial Michael Pen
            </h3>
            <p className="text-xs text-zinc-400">
              Configura los nombres de firmantes, la rúbrica y las credenciales emitidas a estudiantes con 100% de maestría.
            </p>
          </div>

          <form onSubmit={handleSaveCertificate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nombre de la Academia:</label>
                <input
                  type="text"
                  value={certTemplate.academyName}
                  onChange={(e) => setCertTemplate({ ...certTemplate, academyName: e.target.value })}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Título del Documento:</label>
                <input
                  type="text"
                  value={certTemplate.headerTitle}
                  onChange={(e) => setCertTemplate({ ...certTemplate, headerTitle: e.target.value })}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Primer Firmante (Master Mentor):</label>
                <input
                  type="text"
                  value={certTemplate.signatory1Name}
                  onChange={(e) => setCertTemplate({ ...certTemplate, signatory1Name: e.target.value })}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Segundo Firmante (Director Académico):</label>
                <input
                  type="text"
                  value={certTemplate.signatory2Name}
                  onChange={(e) => setCertTemplate({ ...certTemplate, signatory2Name: e.target.value })}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#c5a059] transition shadow-md cursor-pointer"
            >
              Guardar Plantilla Oficial
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: BANCO DE PREGUNTAS PSICOMÉTRICAS (50 VARIANTES) */}
      {/* ========================================================================= */}
      {activeSubTab === 'exams' && (
        <div className="p-6 rounded-2xl bg-[#111218] border border-[#c5a059]/40 space-y-4">
          <div>
            <h3 className="text-lg font-bold font-serif-gold text-white">
              Motor Anti-Trampa y Matrices Psicométricas
            </h3>
            <p className="text-xs text-zinc-400">
              Cada bloque académico cuenta con 50 variantes algorítmicas con cuatro opciones obligatorias (A, B, C, D) y alternancia continua de letras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {blocks.map((b, idx) => (
              <div key={b.id} className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-[#f5e2a3] block">Módulo {idx + 1}</span>
                <p className="text-xs text-zinc-300 truncate">{b.title}</p>
                <p className="text-[11px] text-zinc-500">50 Variantes activas en memoria Cloud</p>
                <div className="pt-2 text-[10px] text-emerald-400 flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Sin patrones de letras repetidas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: CIBERSEGURIDAD, 2FA Y CAPA DE CONFIGURACIÓN SMTP SEGURA */}
      {/* ========================================================================= */}
      {activeSubTab === 'security' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Header & Architecture Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12141c] via-[#0f1118] to-[#141622] border-2 border-[#c5a059]/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e2a3] text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>Ajustes Institucionales • Servidor de Correo & Mensajería</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-serif-gold text-white tracking-wide">
                  Configuración del Servidor de Correo
                </h3>
                <p className="text-xs text-zinc-300 max-w-2xl font-light leading-relaxed">
                  Vincule los parámetros del servidor de correo para la entrega de notificaciones y códigos de recuperación a los estudiantes de la plataforma.
                </p>
              </div>

              <div className="shrink-0 flex items-center space-x-2 bg-black/60 px-4 py-2 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-400">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Servicio Activo</span>
              </div>
            </div>

            {/* Service Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-zinc-800/80">
              <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f5e2a3]">Protección de Acceso</span>
                  <span className="text-[10px] text-emerald-400 font-mono">ACTIVO</span>
                </div>
                <p className="text-[11px] text-zinc-400">Verificación activa del sistema en cada solicitud.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f5e2a3]">Entrega Verificada</span>
                  <span className="text-[10px] text-emerald-400 font-mono">CÓDIGOS OTP</span>
                </div>
                <p className="text-[11px] text-zinc-400">Tokens de un solo uso con vigencia programada de 15 minutos.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f5e2a3]">Gestión Centralizada</span>
                  <span className="text-[10px] text-emerald-400 font-mono">SINCRONIZADO</span>
                </div>
                <p className="text-[11px] text-zinc-400">Configuración unificada y respaldada en la plataforma.</p>
              </div>
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div className="p-5 rounded-2xl bg-[#0e1017] border border-[#c5a059]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-serif-gold text-[#f5e2a3] uppercase tracking-wider flex items-center space-x-2">
                <Server className="w-4 h-4 text-[#d4af37]" />
                <span>Plantillas Rápidas de Servidores SMTP (Presets Oficiales):</span>
              </span>
              <span className="text-[10px] text-zinc-400">1 clic para autocompletar puertos y cifrado</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SMTP_PRESETS.map((p) => {
                const isSelected = smtpForm.host === p.host && smtpForm.port === p.port;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplySmtpPreset(p)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition border flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                        : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:border-[#c5a059]/50'
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className="text-[10px] font-mono opacity-80">({p.port})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main SMTP Configuration Form */}
          <form onSubmit={handleSaveSmtpToFirebase} className="p-6 md:p-8 rounded-3xl bg-[#0e1017] border-2 border-[#c5a059]/40 space-y-8 shadow-2xl">
            
            {/* Network Parameters */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3 text-[#d4af37]">
                <Server className="w-5 h-5" />
                <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider">
                  1. Parámetros de Red y Transporte del Servidor SMTP
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Host / Servidor SMTP: <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="smtp.masterpentraining.com"
                      value={smtpForm.host}
                      onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 pl-9 text-white font-mono placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none"
                    />
                    <Server className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Dirección FQDN o IP del servidor de correo.</span>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Puerto del Socket: <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={smtpForm.port}
                      onChange={(e) => setSmtpForm({ ...smtpForm, port: Number(e.target.value) })}
                      className="w-1/2 bg-black border border-zinc-700 rounded-xl py-2.5 px-3 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                    >
                      <option value={587}>587 (TLS / STARTTLS)</option>
                      <option value={465}>465 (SSL Directo)</option>
                      <option value={25}>25 (Relay Estándar)</option>
                      <option value={2525}>2525 (Alternativo)</option>
                    </select>
                    <input
                      type="number"
                      value={smtpForm.port}
                      onChange={(e) => setSmtpForm({ ...smtpForm, port: Number(e.target.value) })}
                      className="w-1/2 bg-black border border-zinc-700 rounded-xl py-2.5 px-3 text-white font-mono focus:border-[#d4af37] focus:outline-none text-center"
                      placeholder="Puerto"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">587 recomendado para TLS criptográfico.</span>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Capa de Cifrado (Protocolo): <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={smtpForm.encryption}
                    onChange={(e) => setSmtpForm({ ...smtpForm, encryption: e.target.value as any })}
                    className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="TLS">TLS 1.3 (Recomendado / Seguro)</option>
                    <option value="SSL">SSL Direct Socket</option>
                    <option value="STARTTLS">STARTTLS Negociado</option>
                  </select>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Túnel cifrado con protección contra interceptación.</span>
                </div>
              </div>
            </div>

            {/* Sender Identity & Credentials */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3 text-[#d4af37]">
                <Mail className="w-5 h-5" />
                <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider">
                  2. Identidad del Remitente y Credenciales de Autenticación
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Correo Electrónico Remitente Oficial: <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="seguridad@masterpentraining.com"
                      value={smtpForm.senderEmail}
                      onChange={(e) => setSmtpForm({ ...smtpForm, senderEmail: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 pl-9 text-white font-mono placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Dirección autorizada en SPF y DKIM de su dominio.</span>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Nombre Visible del Remitente: <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seguridad Master Pen Training"
                    value={smtpForm.senderName}
                    onChange={(e) => setSmtpForm({ ...smtpForm, senderName: e.target.value })}
                    className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">Nombre institucional que aparecerá en el buzón del alumno.</span>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Usuario de Autenticación SMTP:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="masterpen_relay_auth o apikey"
                      value={smtpForm.authUsername}
                      onChange={(e) => setSmtpForm({ ...smtpForm, authUsername: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 pl-9 text-white font-mono placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none"
                    />
                    <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Usuario SASL para el apretón de manos SMTP.</span>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Contraseña / API Key / Secret Token SMTP:
                  </label>
                  <div className="relative">
                    <input
                      type={showSmtpPassword ? 'text' : 'password'}
                      placeholder="Contraseña de aplicación o token privado"
                      value={smtpForm.authPasswordOrKey}
                      onChange={(e) => setSmtpForm({ ...smtpForm, authPasswordOrKey: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 pl-9 pr-10 text-white font-mono placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      className="absolute right-3 top-2.5 p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                      title={showSmtpPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                    <span>Credenciales protegidas en el servidor.</span>
                    <span className="text-emerald-400 font-mono">Bóveda Activa</span>
                  </div>
                </div>
              </div>

              {/* Secret Manager Key Reference */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1 text-xs">
                <label className="font-semibold text-zinc-400 block text-[11px]">
                  Identificador de credencial en bóveda:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={smtpForm.secretManagerKey}
                    onChange={(e) => setSmtpForm({ ...smtpForm, secretManagerKey: e.target.value })}
                    className="flex-1 bg-black/80 border border-zinc-700/80 rounded-lg p-2 text-emerald-400 font-mono text-[11px] focus:border-[#d4af37] focus:outline-none"
                  />
                  <span className="shrink-0 px-2 py-1 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5e2a3] text-[10px] font-mono">
                    Vinculado
                  </span>
                </div>
              </div>
            </div>

            {/* Email Template Configuration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-[#d4af37]">
                  <FileText className="w-5 h-5" />
                  <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider">
                    3. Plantilla Oficial de Correo de Restablecimiento
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewingEmail(!isPreviewingEmail)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[#f5e2a3] border border-[#c5a059]/40 text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isPreviewingEmail ? 'Ocultar Vista Previa' : 'Previsualizar Correo'}</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Asunto del Correo: <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={smtpForm.emailSubjectTemplate}
                    onChange={(e) => setSmtpForm({ ...smtpForm, emailSubjectTemplate: e.target.value })}
                    className="w-full bg-black border border-zinc-700 rounded-xl py-2.5 px-3 text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-zinc-300">
                      Cuerpo del Mensaje (Variables dinámicas permitidas):
                    </label>
                    <div className="flex space-x-1.5 text-[10px] text-[#c5a059] font-mono">
                      <span className="bg-black/60 px-1.5 py-0.5 rounded border border-zinc-800">{'{student_name}'}</span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded border border-zinc-800">{'{reset_code}'}</span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded border border-zinc-800">{'{expiration_minutes}'}</span>
                    </div>
                  </div>
                  <textarea
                    rows={6}
                    required
                    value={smtpForm.bodyTemplate}
                    onChange={(e) => setSmtpForm({ ...smtpForm, bodyTemplate: e.target.value })}
                    className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white font-mono text-xs leading-relaxed placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Email Preview Card */}
              {isPreviewingEmail && (
                <div className="p-6 rounded-2xl bg-[#0a0b0e] border-2 border-[#c5a059] shadow-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full border border-[#d4af37] overflow-hidden">
                        <img src={brandingImages.logo} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{smtpForm.senderName}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">&lt;{smtpForm.senderEmail}&gt;</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#c5a059] font-mono uppercase tracking-wider">
                      Vista Previa de Correo
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-zinc-300 leading-relaxed font-light">
                    <p className="font-bold text-[#f5e2a3] text-sm">
                      {smtpForm.emailSubjectTemplate}
                    </p>
                    <p>Estimado/a <strong className="text-white">Acreditado de Honor Master Pen</strong>:</p>
                    <p>Ha solicitado restablecer sus credenciales de acceso a la plataforma Master Pen Training.</p>
                    
                    {/* Simulated Golden Token Box */}
                    <div className="my-4 p-5 rounded-2xl bg-black border-2 border-[#d4af37]/60 text-center space-y-1 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                      <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-mono block">
                        CÓDIGO CRIPTOGRÁFICO DE VERIFICACIÓN (OTP)
                      </span>
                      <span className="text-3xl md:text-4xl font-black font-mono tracking-widest text-white gold-gradient-text">
                        849 201
                      </span>
                      <span className="text-[10px] text-zinc-400 block pt-1">
                        Válido por exactamente 15 minutos • Despacho autenticado TLS
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 italic">
                      Si usted no ha iniciado esta solicitud, ignore este correo. La seguridad de su cuenta está salvaguardada por el centinela perimetral de Michael Pen.
                    </p>

                    <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between items-center">
                      <span>Master Pen Training • Dirección de Seguridad y Ciberdefensa</span>
                      <span className="font-mono">Hash: 0x9f4a8b...2026</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Socket Diagnostic & Test Connection Suite */}
            <div className="p-6 rounded-2xl bg-black/70 border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold font-serif-gold text-white flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-[#d4af37]" />
                    <span>Consola de Diagnóstico & Test de Conexión Socket SMTP en Vivo</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Comprueba en tiempo real el socket TCP, el apretón de manos TLS 1.3 y la emisión del token criptográfico hacia una casilla real.
                  </p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <input
                    type="email"
                    placeholder="correo_de_prueba@dominio.com"
                    value={testEmailRecipient}
                    onChange={(e) => setTestEmailRecipient(e.target.value)}
                    className="flex-1 sm:w-64 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isTestingSmtp}
                    onClick={handleTestSmtpConnection}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-[#f5e2a3] border border-[#c5a059]/40 font-bold text-xs uppercase tracking-wider transition flex items-center space-x-1.5 shrink-0"
                  >
                    {isTestingSmtp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                        <span>Probando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Ejecutar Test</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Diagnostic Terminal Output */}
              {smtpTestResult && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 animate-in fade-in ${
                  smtpTestResult.success 
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                    <span className="font-bold flex items-center space-x-1.5">
                      {smtpTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                      <span>{smtpTestResult.success ? 'ENLACE SOCKET SMTP ESTABLECIDO (200 OK)' : 'FALLO DE CONEXIÓN SMTP'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">Latencia: {smtpTestResult.latencyMs} ms</span>
                  </div>

                  <p className="text-[11px] leading-relaxed">{smtpTestResult.message}</p>

                  {smtpTestResult.tlsCipher && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1 text-zinc-400">
                      <div>Cipher Suite: <strong className="text-white">{smtpTestResult.tlsCipher}</strong></div>
                      <div>Servidor Verificado: <strong className="text-white">{smtpTestResult.host}:{smtpTestResult.port}</strong></div>
                    </div>
                  )}

                  {smtpTestResult.testOtpCode && (
                    <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-300">
                        Token OTP Criptográfico Emitido: <strong className="text-[#f5e2a3] text-sm tracking-widest">{smtpTestResult.testOtpCode}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(smtpTestResult.testOtpCode || '');
                          setCopiedToken(true);
                          setTimeout(() => setCopiedToken(false), 2000);
                        }}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-[#f5e2a3] border border-zinc-700 flex items-center space-x-1"
                      >
                        {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedToken ? 'Copiado' : 'Copiar Token'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Save Action Bar */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-zinc-400 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#d4af37]" />
                <span>
                  Al pulsar guardar, la configuración se actualizará de forma centralizada e inmediata.
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={isSavingSmtp}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5e2a3] to-[#c5a059] hover:from-[#c5a059] hover:to-[#b38f2e] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isSavingSmtp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Guardando configuración...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-black" />
                      <span>Guardar Configuración SMTP</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Realtime Save Feedback Notification */}
            {smtpSaveFeedback && (
              <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between animate-in fade-in duration-300 ${
                smtpSaveFeedback.success
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-white">{smtpSaveFeedback.message}</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      Referencia: {smtpSaveFeedback.hash?.substring(0, 16)}... • Actualizado exitosamente
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {smtpSaveFeedback.timestamp ? new Date(smtpSaveFeedback.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>
            )}

          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AÑADIR / EDITAR CLASE TIPO UDEMY */}
      {/* ========================================================================= */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0e1017] border-2 border-[#d4af37]/60 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-base font-bold font-serif-gold text-white">
                  {editingLessonId ? 'Editar Clase de la Cátedra' : 'Añadir Nueva Clase al Módulo (Tipo Udemy)'}
                </h3>
              </div>
              <button
                onClick={() => setIsLessonModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLessonModal} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Título de la Clase:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Análisis Sintáctico de Propuestas Irresistibles"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Tipo de Reproducción Webview:</label>
                  <select
                    value={lessonForm.provider}
                    onChange={(e) => {
                      const p = e.target.value as any;
                      setLessonForm({ 
                        ...lessonForm, 
                        provider: p,
                        type: p === 'youtube' ? 'video_youtube' : p === 'slides' ? 'slides_embed' : p === 'pdf' ? 'document_pdf' : p === 'audio' ? 'audio_track' : 'video'
                      });
                    }}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="youtube">YouTube (Ahorra espacio en DB, Webview HD)</option>
                    <option value="cloudflare">Cloudflare Stream (CDN Ultra Rápido)</option>
                    <option value="gstorage">Google Cloud Storage / MP4 Directo</option>
                    <option value="vimeo">Vimeo Video</option>
                    <option value="slides">Diapositivas (Google Slides / Canva embed)</option>
                    <option value="pdf">Documento PDF de Estudio</option>
                    <option value="audio">Pista de Audio con Narrador</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Duración Pedagógica (minutos):</label>
                  <input
                    type="number"
                    min="1"
                    value={lessonForm.durationMinutes}
                    onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-zinc-300">URL del Recurso o Video:</label>
                  {lessonForm.storageUrl && (
                    <button
                      type="button"
                      onClick={() => setTestWebviewUrl(lessonForm.storageUrl)}
                      className="text-[#d4af37] hover:underline flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Probar Enlace en Webview</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... o https://docs.google.com/presentation/..."
                  value={lessonForm.storageUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, storageUrl: e.target.value })}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white font-mono"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  El sistema detecta automáticamente enlaces de YouTube, Cloudflare, Vimeo, Google Slides y PDFs para reproducirlos en el Webview.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Apuntes & Axiomas de Michael Pen:</label>
                <textarea
                  rows={2}
                  placeholder="Resumen o axioma principal de la clase para los apuntes del alumno..."
                  value={lessonForm.notes}
                  onChange={(e) => setLessonForm({ ...lessonForm, notes: e.target.value })}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Transcripción para Preguntas de Examen:</label>
                <textarea
                  rows={3}
                  placeholder="Texto completo de la cátedra que alimentará el motor psicométrico..."
                  value={lessonForm.transcript}
                  onChange={(e) => setLessonForm({ ...lessonForm, transcript: e.target.value })}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white resize-none"
                />
              </div>

              {/* Free preview toggle (Udemy Style) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800">
                <div>
                  <span className="font-semibold text-white block">Vista Previa Gratuita (Tipo Udemy):</span>
                  <span className="text-[10px] text-zinc-400">Permite que los visitantes no matriculados puedan ver esta clase como muestra de calidad.</span>
                </div>
                <input
                  type="checkbox"
                  checked={lessonForm.previewFree}
                  onChange={(e) => setLessonForm({ ...lessonForm, previewFree: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 text-[#d4af37] focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Optional Downloadable Resource */}
              <div className="p-3 rounded-xl bg-black border border-zinc-800 space-y-2">
                <span className="font-semibold text-white block">Material Descargable Adjunto (Opcional):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre del archivo (Ej: Guía de Retórica.pdf)"
                    value={lessonForm.attachmentName}
                    onChange={(e) => setLessonForm({ ...lessonForm, attachmentName: e.target.value })}
                    className="w-full bg-[#12131b] border border-zinc-700 rounded-lg p-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="URL de descarga (PDF, ZIP, Slides)"
                    value={lessonForm.attachmentUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, attachmentUrl: e.target.value })}
                    className="w-full bg-[#12131b] border border-zinc-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#8a6c25] hover:brightness-110 text-black font-bold uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  Guardar Clase
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROBADOR DE WEBVIEW EN VIVO */}
      {/* ========================================================================= */}
      {testWebviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-[#0d0e14] border-2 border-[#d4af37] rounded-3xl p-5 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Play className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-base font-bold font-serif-gold text-white">
                  Prueba de Reproducción en Webview Integrado
                </h3>
              </div>

              <button
                onClick={() => setTestWebviewUrl(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Player Canvas */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-[#c5a059]/40 shadow-inner flex items-center justify-center">
              {(() => {
                const info = parseMediaUrl(testWebviewUrl);
                if (info.isIframe) {
                  return (
                    <iframe
                      src={info.embedUrl}
                      title="Webview Test"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  );
                } else if (info.isVideoTag) {
                  return (
                    <video
                      src={info.originalUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  );
                } else {
                  return (
                    <audio
                      src={info.originalUrl}
                      controls
                      autoPlay
                      className="w-full max-w-md"
                    />
                  );
                }
              })()}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400">
              <p className="font-mono truncate max-w-lg">Enlace probado: {testWebviewUrl}</p>
              <button
                onClick={() => setTestWebviewUrl(null)}
                className="px-4 py-1.5 rounded-lg bg-[#d4af37] text-black font-bold"
              >
                Cerrar Prueba
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 6: INYECCIONES SEGURAS Y PÁGINAS DINÁMICAS (MÓDULO 4) */}
      {/* ========================================================================= */}
      {activeSubTab === 'injections' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12141c] via-[#0f1118] to-[#141622] border-2 border-[#c5a059]/40 shadow-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-[#d4af37]" />
              <h3 className="text-xl font-bold font-serif-gold text-white">
                Inyecciones Seguras y Páginas Dinámicas Autoadministrables
              </h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
              Controla de forma autónoma bloques HTML, pasarelas de pago, contadores y widgets externos, así como la creación de nuevas páginas y formularios personalizados guardados como esquemas JSON en Firestore sin requerir compilación ni nuevo despliegue.
            </p>
          </div>

          {/* Section 1: Inyecciones Seguras */}
          <div className="p-6 rounded-3xl bg-[#0e1018] border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h4 className="text-base font-bold font-serif-gold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Inyecciones Seguras de Bloques de Código</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Inserta fragmentos HTML o widgets para pasarelas de pago, contadores o avisos promocionales.
                </p>
              </div>
            </div>

            {/* Form to add safe injection */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="md:col-span-6 space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Título Descriptivo:</label>
                <input
                  type="text"
                  value={newInjTitle}
                  onChange={(e) => setNewInjTitle(e.target.value)}
                  placeholder="Ej: Botón Pasarela Stripe / PayPal Promocional"
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-6 space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Ubicación de Inyección:</label>
                <select
                  value={newInjPlacement}
                  onChange={(e) => setNewInjPlacement(e.target.value as any)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="curriculum_banner">Banner Superior del Campus Curricular</option>
                  <option value="header">Barra de Encabezado Principal</option>
                  <option value="footer">Pie de Página Institucional</option>
                  <option value="sidebar">Barra Lateral de Cátedra</option>
                  <option value="custom_page">Página Personalizada Exclusiva</option>
                </select>
              </div>

              <div className="md:col-span-12 space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Bloque de Código HTML / Script Externo:</label>
                <textarea
                  rows={4}
                  value={newInjHtml}
                  onChange={(e) => setNewInjHtml(e.target.value)}
                  placeholder='<div class="p-3 bg-zinc-900 text-amber-300 rounded-xl">...</div>'
                  className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-xs font-mono text-[#f5e2a3] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-12 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!newInjTitle.trim() || !newInjHtml.trim()) return;
                    const item: SafeInjectionItem = {
                      id: `inj_${Date.now()}`,
                      title: newInjTitle.trim(),
                      placement: newInjPlacement,
                      htmlContent: newInjHtml.trim(),
                      isActive: true,
                      createdAt: new Date().toISOString().split('T')[0]
                    };
                    cloudState.saveSafeInjection(item);
                    setSafeInjections(cloudState.getSafeInjections());
                    setNewInjTitle('');
                    setNewInjHtml('');
                    setSaveFeedback('Inyección segura guardada y sincronizada en el ecosistema.');
                    setTimeout(() => setSaveFeedback(''), 4000);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#8a6c25] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Inyección Segura</span>
                </button>
              </div>
            </div>

            {/* List of Injections */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Inyecciones Activas en el Ecosistema ({safeInjections.length}):
              </span>
              {safeInjections.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No hay inyecciones registradas.</p>
              ) : (
                safeInjections.map(inj => (
                  <div key={inj.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{inj.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f5e2a3] font-semibold border border-[#d4af37]/40">
                          {inj.placement}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          inj.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {inj.isActive ? 'ACTIVO' : 'PAUSADO'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono truncate max-w-xl">
                        {inj.htmlContent}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...inj, isActive: !inj.isActive };
                          cloudState.saveSafeInjection(updated);
                          setSafeInjections(cloudState.getSafeInjections());
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 hover:text-white"
                      >
                        {inj.isActive ? 'Pausar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          cloudState.deleteSafeInjection(inj.id);
                          setSafeInjections(cloudState.getSafeInjections());
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 hover:text-red-300"
                        title="Eliminar inyección"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Páginas y Formularios Dinámicos */}
          <div className="p-6 rounded-3xl bg-[#0e1018] border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h4 className="text-base font-bold font-serif-gold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#d4af37]" />
                  <span>Páginas y Formularios Personalizados (Esquemas JSON en Cloud)</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Crea nuevas páginas y formularios cuyas estructuras se guardan como esquemas JSON en Firestore y se renderizan dinámicamente.
                </p>
              </div>
            </div>

            {/* Form to create new dynamic page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="md:col-span-6 space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Título de la Página:</label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="Ej: Registro a Taller Magistral"
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-6 space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Slug / Ruta de Acceso:</label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="taller-magistral"
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-[#f5e2a3] font-mono focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-6 space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Contenido HTML Editorial:</label>
                <textarea
                  rows={5}
                  value={newPageHtml}
                  onChange={(e) => setNewPageHtml(e.target.value)}
                  placeholder="<h2>Bienvenido</h2><p>Contenido oficial autoadministrable...</p>"
                  className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-6 space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Esquema JSON del Formulario:</label>
                <textarea
                  rows={5}
                  value={newPageSchemaJson}
                  onChange={(e) => setNewPageSchemaJson(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-12 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!newPageTitle.trim() || !newPageSlug.trim()) return;
                    const page: CustomDynamicPage = {
                      id: `page_${Date.now()}`,
                      title: newPageTitle.trim(),
                      slug: newPageSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
                      contentHtml: newPageHtml.trim(),
                      formSchemaJson: newPageSchemaJson.trim(),
                      isPublished: true,
                      createdAt: new Date().toISOString().split('T')[0]
                    };
                    cloudState.saveCustomPage(page);
                    setCustomPages(cloudState.getCustomPages());
                    setNewPageTitle('');
                    setNewPageSlug('');
                    setNewPageHtml('');
                    setSaveFeedback('Página y esquema JSON del formulario creados en Firebase Cloud.');
                    setTimeout(() => setSaveFeedback(''), 4000);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#8a6c25] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Página y Formulario</span>
                </button>
              </div>
            </div>

            {/* List of Custom Pages */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Páginas Dinámicas Creadas ({customPages.length}):
              </span>
              {customPages.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No hay páginas personalizadas activas.</p>
              ) : (
                customPages.map(page => (
                  <div key={page.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{page.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                          /{page.slug}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Creada el {page.createdAt} • Formulario con esquema JSON activo
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        cloudState.deleteCustomPage(page.id);
                        setCustomPages(cloudState.getCustomPages());
                      }}
                      className="p-1.5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 hover:text-red-300 cursor-pointer"
                      title="Eliminar página"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 7: SDK UNIVERSAL DE MICHAEL PEN (EMBED & BRIDGE ECOSISTÉMICO) */}
      {/* ========================================================================= */}
      {activeSubTab === 'universal_sdk' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141520] via-[#0f1017] to-[#161824] border-2 border-[#d4af37]/60 shadow-xl space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059]">
                  Integración Universal Multi-Plataforma
                </span>
                <h3 className="text-xl font-bold font-serif-gold text-white">
                  SDK Universal de Michael Pen (Bridge Oficial)
                </h3>
                <p className="text-xs text-zinc-400">
                  Código de inserción oficial para embeber a Michael Pen en cualquier portal, tienda o aplicación externa del Ecosistema Master Pen.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Estado del Puente:</span>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Operativo y Disponible</span>
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">/agent-universal-bridge.js</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Memoria y Cerebro:</span>
                <p className="text-xs font-bold text-[#f5e2a3]">
                  agente-universal-ecosistemas
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">Firestore Oficial del Agente</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Capacidades:</span>
                <p className="text-xs font-bold text-white">
                  Voz TTS + Seudónimos + Blindaje
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">Zero Dependencias Externas</p>
              </div>
            </div>
          </div>

          {/* Generador de Snippet y Selector */}
          <div className="p-6 rounded-2xl bg-[#0f1017] border border-[#c5a059]/30 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white font-serif-gold">
                  1. Configurar Ecosistema Destino
                </h4>
                <p className="text-xs text-zinc-400">
                  Selecciona la división o escribe el nombre del proyecto donde vas a insertar el script:
                </p>
              </div>

              <select
                value={selectedSdkEcosystem}
                onChange={(e) => setSelectedSdkEcosystem(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-black border border-[#c5a059]/40 text-xs font-semibold text-[#f5e2a3] outline-none cursor-pointer"
              >
                <option value="Master Pen Training">Master Pen Training (Academia)</option>
                <option value="Master Pen Manga Creator">Master Pen Manga Creator</option>
                <option value="Buy it All Products & Services">Buy it All (Tienda)</option>
                <option value="Master Pen Creative Ideas">Master Pen Creative Ideas</option>
                <option value="Vitrina Web">Vitrina Web</option>
                <option value="SubJetro">SubJetro (Gobernanza)</option>
                <option value="Subsalomón">Subsalomón (Sabiduría)</option>
                <option value="Master Pen Studio Creations">Master Pen Studio Creations (Matriz)</option>
              </select>
            </div>

            {/* Código HTML Oficial */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 font-mono">
                  2. Código Oficial de Inserción (HTML / Head / Body):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const snippet = `<!-- =================================================================== -->\n<!-- CEREBRO UNIVERSAL MICHAEL PEN - CONEXIÓN UNIFICADA A FIREBASE -->\n<!-- Proyecto Central: agente-universal-ecosistemas -->\n<!-- =================================================================== -->\n<script>\n  // 1. Origen de la Mansión Matriz (donde reside el motor de voz y cerebro)\n  window.MASTER_PEN_ORIGIN = "https://ais-dev-rq5irbycwkls33x4wuyzaz-506893424321.us-west1.run.app";\n\n  // 2. Nombre del ecosistema destino\n  window.MASTER_PEN_ECOSYSTEM = "${selectedSdkEcosystem}";\n</script>\n\n<!-- 3. SDK Universal con Cerebro, Voz Oficial de Michael Pen y Sincronización en Tiempo Real -->\n<script src="https://ais-dev-rq5irbycwkls33x4wuyzaz-506893424321.us-west1.run.app/agent-universal-bridge.js"></script>\n<!-- BOTÓN EXCLUSIVO PARA EL DASHBOARD ADMINISTRADOR -->\n<button \n  type="button" \n  onclick="window.UniversalAgent && window.UniversalAgent.openControlPanel ? window.UniversalAgent.openControlPanel() : alert('El Agente Michael Pen se está inicializando...')"\n  style="padding: 10px 18px; background: #0b0f17; color: #d4af37; border: 1.5px solid #d4af37; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"\n>\n  <span>⚙️ Configurar Agente Michael Pen & Seudónimos</span>\n</button>`;
                    navigator.clipboard.writeText(snippet);
                    setCopiedSdkCode(true);
                    setTimeout(() => setCopiedSdkCode(false), 3000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#f5e2a3] border border-[#d4af37]/50 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  {copiedSdkCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSdkCode ? '¡Código Copiado!' : 'Copiar Código Completo'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black/90 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed shadow-inner">
{`<!-- =================================================================== -->
<!-- CEREBRO UNIVERSAL MICHAEL PEN - CONEXIÓN UNIFICADA A FIREBASE -->
<!-- Proyecto Central: agente-universal-ecosistemas -->
<!-- =================================================================== -->
<script>
  // 1. Origen de la Mansión Matriz (donde reside el motor de voz y cerebro)
  window.MASTER_PEN_ORIGIN = "https://ais-dev-rq5irbycwkls33x4wuyzaz-506893424321.us-west1.run.app";

  // 2. Nombre del ecosistema destino
  window.MASTER_PEN_ECOSYSTEM = "${selectedSdkEcosystem}";
</script>

<!-- 3. SDK Universal con Cerebro, Voz Oficial de Michael Pen y Sincronización en Tiempo Real -->
<script src="https://ais-dev-rq5irbycwkls33x4wuyzaz-506893424321.us-west1.run.app/agent-universal-bridge.js"></script>
<!-- BOTÓN EXCLUSIVO PARA EL DASHBOARD ADMINISTRADOR -->
<button 
  type="button" 
  onclick="window.UniversalAgent && window.UniversalAgent.openControlPanel ? window.UniversalAgent.openControlPanel() : alert('El Agente Michael Pen se está inicializando...')"
  style="padding: 10px 18px; background: #0b0f17; color: #d4af37; border: 1.5px solid #d4af37; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"
>
  <span>⚙️ Configurar Agente Michael Pen & Seudónimos</span>
</button>`}
              </pre>

              {/* Botón de Prueba en Vivo para el Administrador */}
              <div className="p-4 rounded-xl bg-black/40 border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-left">
                  <span className="text-xs font-bold text-white">Vista Previa Interactiva del Botón:</span>
                  <p className="text-[11px] text-zinc-400">Pruébalo aquí directamente para abrir el Panel de Activación de Seudónimos, Voz y Avatar:</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    if ((window as any).UniversalAgent && (window as any).UniversalAgent.openControlPanel) {
                      (window as any).UniversalAgent.openControlPanel();
                    } else if ((window as any).MichaelPenAgent && (window as any).MichaelPenAgent.openControlPanel) {
                      (window as any).MichaelPenAgent.openControlPanel();
                    } else {
                      alert('El Agente Michael Pen se está inicializando...');
                    }
                  }}
                  style={{ padding: '10px 18px', background: '#0b0f17', color: '#d4af37', border: '1.5px solid #d4af37', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
                >
                  <span>⚙️ Configurar Agente Michael Pen & Seudónimos</span>
                </button>
              </div>
            </div>

            {/* Guía de Uso Rápido */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3 text-xs text-zinc-300">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#d4af37]">
                Instrucciones de Implementación en Sitios Externos:
              </h5>
              <ul className="space-y-1.5 text-[11px] text-zinc-400 list-disc list-inside leading-relaxed">
                <li>Pega este código antes del cierre de la etiqueta <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">&lt;/body&gt;</code> en cualquier página web.</li>
                <li>El widget flotante aparecerá automáticamente en la esquina inferior derecha con el avatar oficial y la voz de Michael Pen.</li>
                <li>Adapta automáticamente el saludo y el rol institucional según el nombre indicado en <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">window.MASTER_PEN_ECOSYSTEM</code>.</li>
                <li>Incluye protección contra jailbreaks y extracción de prompts confidenciales de manera autónoma.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
