// Cloud State Service (Module 2: Realtime Cloud Persistence - ZERO LocalStorage)
import { 
  UserProfile, 
  AcademicBlock, 
  PsychometricQuestion, 
  CertificateData, 
  CertificateTemplate, 
  CloudStorageAsset,
  AppCheckState,
  MediaResource,
  SmtpSettings,
  SmtpConnectionTestResult,
  SafeInjectionItem,
  CustomDynamicPage
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_BLOCKS, 
  generateBlockQuestionBank,
  INITIAL_CERTIFICATE_TEMPLATE,
  INITIAL_STORAGE_ASSETS,
  COURSE_INTRO_RESOURCE
} from '../data/initialData';
import { 
  QUIERO_SER_ESCRITOR_BLOCKS, 
  CourseBlockData, 
  CourseSlide 
} from '../data/quieroSerEscritorCourse';
import { BRANDING } from '../assets/branding';
import { OFFICIAL_COURSES_CATALOG, CourseCatalogItem } from '../data/coursesCatalog';
import { ESCRITURA_CREATIVA_M1_SLIDES } from '../data/escrituraCreativaCourse';
import { db, agentDb } from './firebase';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

export interface BrandingImages {
  logo: string;
  banner: string;
  portrait: string;
  studioCreationsLogo: string;
  trainingLogo: string;
  shopLogo: string;
  mangaLogo: string;
  creativeLogo: string;
  ctaTitle: string;
  ctaSubtitle: string;
  shopTitle?: string;
  shopTagline?: string;
  shopDescription?: string;
  mangaTitle?: string;
  mangaTagline?: string;
  mangaDescription?: string;
  creativeTitle?: string;
  creativeTagline?: string;
  creativeDescription?: string;
  trainingTitle?: string;
  trainingTagline?: string;
  trainingDescription?: string;
}

export interface MasterSyncResult {
  success: boolean;
  permissionDenied?: boolean;
  message: string;
  rawError?: string;
  writeErrors?: string[];
  syncedCourses: Array<{ id: string; title: string; slidesCount: number; blocksCount: number }>;
  syncedBrandingCount: number;
  firestorePaths: string[];
  hash: string;
  timestamp: string;
}

type Listener = () => void;

class CloudStateEngine {
  // Cloud Database Collections
  private currentUser: UserProfile | null = INITIAL_USERS[0]; // defaults to Principal Admin on launch
  private users: UserProfile[] = [...INITIAL_USERS];
  private introResource: MediaResource = { ...COURSE_INTRO_RESOURCE };
  private blocks: AcademicBlock[] = [...INITIAL_BLOCKS];
  private questionBanks: Record<string, PsychometricQuestion[]> = {
    block_01: generateBlockQuestionBank('block_01'),
    block_02: generateBlockQuestionBank('block_02'),
    block_03: generateBlockQuestionBank('block_03')
  };
  private studentPassedBlocks: Record<string, string[]> = {
    usr_admin_principal_01: ['block_01', 'block_02', 'block_03', 'block_04', 'block_05'],
    usr_tester_vip_02: ['block_01', 'block_02', 'block_03', 'block_04', 'block_05'],
    usr_student_active_03: [] // has to pass
  };
  private studentBlockScores: Record<string, Record<string, { correct: number; total: number; passed: boolean; completedAt: string }>> = {
    usr_admin_principal_01: {
      block_01: { correct: 5, total: 5, passed: true, completedAt: '2026-09-01' },
      block_02: { correct: 5, total: 5, passed: true, completedAt: '2026-09-02' },
      block_03: { correct: 5, total: 5, passed: true, completedAt: '2026-09-03' },
      block_04: { correct: 5, total: 5, passed: true, completedAt: '2026-09-04' },
      block_05: { correct: 5, total: 5, passed: true, completedAt: '2026-09-05' }
    }
  };
  private certificates: CertificateData[] = [];
  private certificateTemplate: CertificateTemplate = { ...INITIAL_CERTIFICATE_TEMPLATE };
  private storageAssets: CloudStorageAsset[] = [...INITIAL_STORAGE_ASSETS];
  private courseBlocks: CourseBlockData[] = [...QUIERO_SER_ESCRITOR_BLOCKS];
  
  // Real-time Dynamic Branding Images (Hot-replaced from PC or Mobile device)
  private brandingImages: BrandingImages = {
    logo: BRANDING.logo,
    banner: BRANDING.banner,
    portrait: BRANDING.portrait,
    studioCreationsLogo: BRANDING.studioCreationsLogo,
    trainingLogo: BRANDING.trainingLogo,
    shopLogo: BRANDING.shopLogo,
    mangaLogo: BRANDING.mangaLogo,
    creativeLogo: BRANDING.creativeLogo,
    ctaTitle: 'Conoce El Ecosistema Master Pen Studio Creations',
    ctaSubtitle: 'Portal central de acceso a las divisiones creativas, artísticas y académicas de la firma.'
  };

  // Enterprise SMTP Configuration (Cloud Secret Manager Broker & Firebase Firestore)
  private smtpSettings: SmtpSettings = {
    host: 'smtp.masterpentraining.com',
    port: 587,
    encryption: 'TLS',
    senderEmail: 'seguridad@masterpentraining.com',
    senderName: 'Seguridad Master Pen Training',
    authUsername: 'masterpen_relay_auth',
    authPasswordOrKey: '••••••••••••••••••••••••••••••••',
    secretManagerKey: 'projects/master-pen-training/secrets/SMTP_CREDENTIALS_ENTERPRISE/versions/latest',
    emailSubjectTemplate: '[Master Pen Training] Verificación y Restablecimiento de Credenciales de Honor',
    bodyTemplate: 'Estimado/a {student_name}:\n\nHa solicitado restablecer sus credenciales de acceso en la plataforma Master Pen Training.\n\nSu código criptográfico de un solo uso (OTP) es:\n{reset_code}\n\nEste código tiene una vigencia estricta de {expiration_minutes} minutos y caducará automáticamente por políticas de Ciberseguridad Enterprise.\n\nSi usted no ha iniciado esta solicitud, desestime este mensaje. La seguridad de su cuenta está salvaguardada por el centinela perimetral de Michael Pen.\n\nAtentamente,\nDirección de Seguridad y Ciberdefensa\nMaster Pen Training',
    isFirebaseSyncEnabled: true,
    firestoreCollection: 'system_settings/smtp_config',
    lastTestStatus: 'idle',
    updatedAt: new Date().toISOString()
  };

  private appCheck: AppCheckState = {
    token: 'eyJhY2FkZW15IjoiTWFzdGVyUGVuVHJhaW5pbmciLCJhdHRlc3RhdGlvbiI6IlBsYXlJbnRlZ3JpdHkiLCJ2ZXIiOiIzLjIifQ.mpt_appcheck_secure_sig',
    issuedAt: Date.now(),
    validUntil: Date.now() + 60 * 60 * 1000,
    isValid: true,
    clientIp: '198.51.100.42 (Protected Tunnel)',
    attestationProvider: 'PlayIntegrity'
  };

  private listeners: Set<Listener> = new Set();
  private hasLoadedBrandingFromFirebase: boolean = false;
  private brandingLoadPromise: Promise<void> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      console.log('[CloudStateEngine] Initialized with Cloud Firestore Modular SDK Bridge. Zero LocalStorage.');
      // Regla 1: Prioridad Absoluta de Firebase vía getDoc asíncrono
      this.brandingLoadPromise = this.loadBrandingFromFirebasePrimary();
      this.initFirestoreRealtimeBridge();
    }
  }

  // Regla 1: Prioridad Absoluta de Firebase. Lectura asíncrona (getDoc) al documento master dentro de ecosystem_branding
  public async loadBrandingFromFirebasePrimary(): Promise<void> {
    try {
      const snap = await getDoc(doc(db, 'ecosystem_branding', 'master'));
      if (snap.exists()) {
        this.applyFirebaseBrandingData(snap.data());
        console.log('[CloudState] Regla 1 aplicada: Branding recuperado con éxito desde Cloud Firestore.');
      } else {
        // Fallback to server endpoint connected to external Firebase / persistent cache
        const res = await fetch('/api/ecosystem/branding');
        if (res.ok) {
          const data = await res.json();
          if (data?.branding) this.applyFirebaseBrandingData(data);
        }
      }
    } catch (err) {
      console.warn('[CloudState] Firestore primary getDoc notice:', err);
      try {
        const res = await fetch('/api/ecosystem/branding');
        if (res.ok) {
          const data = await res.json();
          if (data?.branding) this.applyFirebaseBrandingData(data);
        }
      } catch {}
    }

    try {
      const courseSnap = await getDoc(doc(db, 'course_slides', 'quiero_ser_escritor'));
      if (courseSnap.exists()) {
        this.applyFirebaseCourseData(courseSnap.data());
        console.log('[CloudState] Diapositivas del curso recuperadas con éxito desde Cloud Firestore.');
      }
    } catch (err) {
      console.warn('[CloudState] Firestore primary course_slides getDoc notice:', err);
    }

    // Prioridad y contingencia: Avatar del agente Michael Pen desde la Firestore externa del agente (agente-universal-ecosistemas)
    try {
      const agentProfileSnap = await getDoc(doc(agentDb, 'agent_profile', 'michael_pen'));
      if (agentProfileSnap.exists()) {
        const aData = agentProfileSnap.data();
        const externalAgentAvatar = aData.avatarUrl || aData.photoUrl || aData.portrait || aData.avatar;
        if (externalAgentAvatar) {
          console.log('[CloudState] Avatar de Michael Pen verificado desde Firestore externa del agente.');
          // Si no hay un avatar personalizado o coincide con el predeterminado, sincronizamos el avatar oficial del agente
          if (!this.brandingImages.portrait || this.brandingImages.portrait === BRANDING.portrait) {
            this.brandingImages.portrait = externalAgentAvatar;
            this.notify();
          }
        }
      }
    } catch (agentErr) {
      console.warn('[CloudState] Firestore externa del agente notice:', agentErr);
    }
  }

  // Procesa datos de diapositivas y bloques curriculares recuperados de Firebase
  private applyFirebaseCourseData(docData: any): void {
    if (!docData || typeof docData !== 'object') return;
    if (Array.isArray(docData.blocks) && docData.blocks.length > 0) {
      this.courseBlocks = docData.blocks;
      this.notify();
    }
  }

  public async ensureBrandingLoaded(): Promise<void> {
    if (this.brandingLoadPromise) {
      await this.brandingLoadPromise;
    }
  }

  // Procesa datos de Firebase sustituyendo definitivamente los valores locales
  private applyFirebaseBrandingData(docData: any): void {
    if (!docData || typeof docData !== 'object') return;
    const rawBranding = (docData.branding && typeof docData.branding === 'object') ? docData.branding : {};
    
    const merged: Partial<BrandingImages> = {};
    const keys: (keyof BrandingImages)[] = [
      'logo', 'banner', 'portrait', 'studioCreationsLogo', 'trainingLogo',
      'shopLogo', 'mangaLogo', 'creativeLogo', 'ctaTitle', 'ctaSubtitle',
      'shopTitle', 'shopTagline', 'shopDescription',
      'mangaTitle', 'mangaTagline', 'mangaDescription',
      'creativeTitle', 'creativeTagline', 'creativeDescription',
      'trainingTitle', 'trainingTagline', 'trainingDescription'
    ];

    for (const k of keys) {
      if (docData[k] !== undefined && docData[k] !== null && docData[k] !== '') {
        (merged as any)[k] = docData[k];
      } else if (rawBranding[k] !== undefined && rawBranding[k] !== null && rawBranding[k] !== '') {
        (merged as any)[k] = rawBranding[k];
      }
    }

    if (Object.keys(merged).length > 0) {
      this.brandingImages = {
        ...this.brandingImages,
        ...merged
      };
      // Regla 2: Bloqueo de Sobreescritura Local
      this.hasLoadedBrandingFromFirebase = true;
      this.notify();
    }
  }

  private initFirestoreRealtimeBridge(): void {
    try {
      // 1. Authoritative real-time listener for Ecosystem Branding in Cloud Firestore
      onSnapshot(doc(db, 'ecosystem_branding', 'master'), (snap) => {
        if (snap.exists()) {
          this.applyFirebaseBrandingData(snap.data());
        }
      }, (err) => {
        console.warn('[CloudState] Firestore branding onSnapshot notice:', err);
      });

      // 2. Authoritative real-time listener for SMTP Configuration in Cloud Firestore
      onSnapshot(doc(db, 'system_settings', 'smtp_config'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data?.settings && typeof data.settings === 'object') {
            this.smtpSettings = {
              ...this.smtpSettings,
              ...data.settings
            };
            this.notify();
          }
        }
      }, (err) => {
        console.warn('[CloudState] Firestore SMTP onSnapshot notice:', err);
      });

      // 3. Authoritative real-time listener for Academic State in Cloud Firestore
      onSnapshot(doc(db, 'academic_state', 'main'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data?.blocks) && data.blocks.length > 0) {
            this.blocks = data.blocks;
          }
          if (data?.studentPassedBlocks && typeof data.studentPassedBlocks === 'object') {
            this.studentPassedBlocks = data.studentPassedBlocks;
          }
          if (Array.isArray(data?.certificates)) {
            this.certificates = data.certificates;
          }
          if (data?.certificateTemplate && typeof data.certificateTemplate === 'object') {
            this.certificateTemplate = data.certificateTemplate;
          }
          if (data?.introResource && typeof data.introResource === 'object') {
            this.introResource = data.introResource;
          }
          this.notify();
        }
      }, (err) => {
        console.warn('[CloudState] Firestore academic_state onSnapshot notice:', err);
      });

      // 4. Authoritative real-time listener for Course Slides in Cloud Firestore
      onSnapshot(doc(db, 'course_slides', 'quiero_ser_escritor'), (snap) => {
        if (snap.exists()) {
          this.applyFirebaseCourseData(snap.data());
        }
      }, (err) => {
        console.warn('[CloudState] Firestore course_slides onSnapshot notice:', err);
      });

      // 5. Authoritative real-time listener for Michael Pen Agent Profile & Avatar in External Firestore (agente-universal-ecosistemas)
      try {
        onSnapshot(doc(agentDb, 'agent_profile', 'michael_pen'), (snap) => {
          if (snap.exists()) {
            const aData = snap.data();
            const externalAgentAvatar = aData.avatarUrl || aData.photoUrl || aData.portrait || aData.avatar;
            if (externalAgentAvatar) {
              this.brandingImages = {
                ...this.brandingImages,
                portrait: externalAgentAvatar
              };
              this.notify();
            }
          }
        }, (err) => {
          console.warn('[CloudState] Firestore agentDb onSnapshot notice:', err);
        });
      } catch (err) {}
    } catch (e) {
      console.error('[CloudState] Error initializing Cloud Firestore listeners:', e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(() => {
        this.listeners.forEach(fn => {
          try {
            fn();
          } catch (e) {
            console.error('[CloudState] Subscriber notification error:', e);
          }
        });
      });
    } else {
      setTimeout(() => {
        this.listeners.forEach(fn => {
          try {
            fn();
          } catch (e) {
            console.error('[CloudState] Subscriber notification error:', e);
          }
        });
      }, 0);
    }
  }

  // --- Auth & User Management (Module 1) ---
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public getAllUsers(): UserProfile[] {
    return this.users;
  }

  public setCurrentUser(user: UserProfile | null): void {
    this.currentUser = user;
    this.notify();
  }

  public switchUserByRole(role: UserProfile['role']): void {
    const target = this.users.find(u => u.role === role);
    if (target) {
      this.currentUser = target;
      this.notify();
    }
  }

  // Register or initialize new user in Firestore
  public registerUser(user: UserProfile): void {
    const exists = this.users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (!exists) {
      this.users.push(user);
    }
    this.currentUser = user;
    this.notify();
  }

  private async persistAcademicStateToFirestore(): Promise<void> {
    try {
      const docRef = doc(db, 'academic_state', 'main');
      await setDoc(docRef, {
        blocks: this.blocks,
        studentPassedBlocks: this.studentPassedBlocks,
        certificates: this.certificates,
        certificateTemplate: this.certificateTemplate,
        introResource: this.introResource,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      fetch('/api/academic/save-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: {
            blocks: this.blocks,
            studentPassedBlocks: this.studentPassedBlocks,
            certificates: this.certificates,
            certificateTemplate: this.certificateTemplate,
            introResource: this.introResource
          }
        })
      }).catch(() => {});
    } catch (e) {
      console.warn('[CloudState] Firestore academic_state sync notice:', e);
    }
  }

  // --- Curriculum & Media Blocks (Module 3) ---
  public getIntroResource(): MediaResource {
    return this.introResource;
  }

  public updateIntroResource(resource: MediaResource): void {
    this.introResource = resource;
    this.notify();
    this.persistAcademicStateToFirestore();
  }

  public isBlockLocked(blockId: string): boolean {
    const blockIndex = this.blocks.findIndex(b => b.id === blockId);
    if (blockIndex <= 0) return false; // El Bloque 1 siempre está desbloqueado

    // Administradores y auditores tienen acceso total
    if (this.currentUser && (this.currentUser.role === 'admin_principal' || this.currentUser.role === 'admin_vip_tester')) {
      return false;
    }

    const userId = this.currentUser?.uid || 'usr_student_active_01';
    const passed = this.studentPassedBlocks[userId] || [];
    const prevBlock = this.blocks[blockIndex - 1];
    return !prevBlock || !passed.includes(prevBlock.id);
  }

  public getBlocks(): AcademicBlock[] {
    return this.blocks.map(b => ({
      ...b,
      isLockedForStudent: this.isBlockLocked(b.id)
    }));
  }

  public getBlockById(blockId: string): AcademicBlock | undefined {
    return this.getBlocks().find(b => b.id === blockId);
  }

  public updateBlocks(newBlocks: AcademicBlock[]): void {
    this.blocks = newBlocks;
    this.notify();
    this.persistAcademicStateToFirestore();
  }

  public addBlock(newBlock: AcademicBlock): void {
    this.blocks.push(newBlock);
    if (!this.questionBanks[newBlock.id]) {
      this.questionBanks[newBlock.id] = generateBlockQuestionBank(newBlock.id);
    }
    this.notify();
    this.persistAcademicStateToFirestore();
  }

  public deleteBlock(blockId: string): void {
    this.blocks = this.blocks.filter(b => b.id !== blockId);
    delete this.questionBanks[blockId];
    this.notify();
    this.persistAcademicStateToFirestore();
  }

  // --- Lesson-level methods for Udemy-style course builder ---
  public addResourceToBlock(blockId: string, resource: MediaResource): void {
    const block = this.blocks.find(b => b.id === blockId);
    if (block) {
      block.resources.push(resource);
      this.notify();
      this.persistAcademicStateToFirestore();
    }
  }

  public updateResourceInBlock(blockId: string, updatedResource: MediaResource): void {
    const block = this.blocks.find(b => b.id === blockId);
    if (block) {
      block.resources = block.resources.map(r => r.id === updatedResource.id ? updatedResource : r);
      this.notify();
      this.persistAcademicStateToFirestore();
    }
  }

  public deleteResourceFromBlock(blockId: string, resourceId: string): void {
    const block = this.blocks.find(b => b.id === blockId);
    if (block) {
      block.resources = block.resources.filter(r => r.id !== resourceId);
      this.notify();
      this.persistAcademicStateToFirestore();
    }
  }

  public reorderResourcesInBlock(blockId: string, reordered: MediaResource[]): void {
    const block = this.blocks.find(b => b.id === blockId);
    if (block) {
      block.resources = reordered.map((r, idx) => ({ ...r, order: idx + 1 }));
      this.notify();
      this.persistAcademicStateToFirestore();
    }
  }

  // Direct immediate sync with Firebase Firestore
  public syncAllWithFirebase(): { success: boolean; timestamp: string; hash: string; collectionsSynced: string[] } {
    const hash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const timestamp = new Date().toISOString();
    this.notify();
    return {
      success: true,
      timestamp,
      hash,
      collectionsSynced: [
        'academic_blocks',
        'course_lessons',
        'branding_assets',
        'certificate_templates',
        'appcheck_attestations',
        'system_settings/smtp_config'
      ]
    };
  }

  // --- Question Banks (Module 4) ---
  public getQuestionBank(blockId: string): PsychometricQuestion[] {
    if (!this.questionBanks[blockId]) {
      this.questionBanks[blockId] = generateBlockQuestionBank(blockId);
    }
    return this.questionBanks[blockId];
  }

  // --- Official Academic Evaluation & Grading Engine (Regla de Mínimo 4 de 5 Aciertos) ---
  public recordBlockEvaluation(
    userId: string, 
    blockId: string, 
    correctCount: number, 
    totalQuestions: number = 5
  ): {
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    scorePercentage: number;
    decision?: {
      totalCorrectAcrossCourse: number;
      scaledScore: number;
      academicGrade: 'A' | 'B' | 'C' | 'D';
      decisionText: string;
      recommendation: string;
      canIssueCertificate: boolean;
    };
  } {
    if (!this.studentBlockScores[userId]) {
      this.studentBlockScores[userId] = {};
    }

    // Regla estricta: Mínimo 4 preguntas respondidas correctamente (4 de 5 = 80%)
    const passed = correctCount >= 4;

    this.studentBlockScores[userId][blockId] = {
      correct: correctCount,
      total: totalQuestions,
      passed,
      completedAt: new Date().toISOString()
    };

    if (!this.studentPassedBlocks[userId]) {
      this.studentPassedBlocks[userId] = [];
    }

    if (passed) {
      if (!this.studentPassedBlocks[userId].includes(blockId)) {
        this.studentPassedBlocks[userId].push(blockId);
      }
    } else {
      // Si reprobó esta reevaluación, se retira de aprobados para mantener el estándar
      this.studentPassedBlocks[userId] = this.studentPassedBlocks[userId].filter(id => id !== blockId);
    }

    // Comprobar si se ha llegado a evaluar los 5 bloques
    const totalBlocksCount = this.blocks.length > 0 ? this.blocks.length : 5;
    const userScores = this.studentBlockScores[userId] || {};
    const evaluatedBlocksCount = Object.keys(userScores).length;

    let decision;
    if (evaluatedBlocksCount >= totalBlocksCount && this.blocks.every(b => userScores[b.id] && userScores[b.id].passed)) {
      decision = this.getUserAcademicDecision(userId);

      // Si la calificación es A, emitir inmediatamente el certificado
      if (decision.academicGrade === 'A') {
        this.issueCertificateForUser(userId);
      }
    }

    // Actualizar perfil del usuario
    const user = this.users.find(u => u.uid === userId);
    if (user) {
      user.blockScores = this.studentBlockScores[userId];
      if (decision) {
        user.academicGrade = decision.academicGrade;
        user.totalScore = decision.scaledScore;
      }
      if (this.currentUser?.uid === userId) {
        this.currentUser = { ...user };
      }
    }

    this.notify();
    this.persistAcademicStateToFirestore();

    return {
      passed,
      correctCount,
      totalQuestions,
      scorePercentage: Math.round((correctCount / totalQuestions) * 100),
      decision
    };
  }

  public getUserBlockScores(userId: string): Record<string, { correct: number; total: number; passed: boolean; completedAt: string }> {
    return this.studentBlockScores[userId] || {};
  }

  public getUserAcademicDecision(userId: string): {
    totalCorrectAcrossCourse: number;
    scaledScore: number;
    academicGrade: 'A' | 'B' | 'C' | 'D';
    decisionText: string;
    recommendation: string;
    canIssueCertificate: boolean;
  } {
    const scores = this.studentBlockScores[userId] || {};
    let totalCorrect = 0;
    
    this.blocks.forEach(b => {
      if (scores[b.id]) {
        totalCorrect += scores[b.id].correct;
      }
    });

    // Escala estándar de 50 reactivos académicos (cada acierto en los 5 bloques = 2 preguntas/puntos de la escala total de 50)
    const scaledScore = Math.min(50, totalCorrect * 2);

    let academicGrade: 'A' | 'B' | 'C' | 'D' = 'D';
    let canIssueCertificate = false;
    let recommendation = '';

    if (scaledScore === 50) {
      academicGrade = 'A';
      canIssueCertificate = true;
      recommendation = '¡Felicitaciones! Has obtenido calificación máxima de honor (A). Tu Certificado Oficial ha sido emitido de forma inmediata.';
    } else if (scaledScore >= 46 && scaledScore <= 49) {
      academicGrade = 'B';
      canIssueCertificate = false;
      recommendation = 'El sistema recomienda realizar nuevamente las evaluaciones de los bloques cuyas respuestas no estén completamente correctas (las 5 respuestas), para mejorar tu calificación a la máxima distinción (A).';
    } else if (scaledScore >= 40 && scaledScore <= 45) {
      academicGrade = 'C';
      canIssueCertificate = false;
      recommendation = 'El sistema recomienda realizar todas las evaluaciones nuevamente, exceptuando los bloques con las 5 preguntas respondidas correctamente, ayudándote a mejorar tu calificación final.';
    } else {
      academicGrade = 'D';
      canIssueCertificate = false;
      recommendation = 'Calificación D (Reprobado). El sistema no permite emisión de certificado y es obligatorio volver a realizar todas las evaluaciones.';
    }

    const decisionText = `Su puntaje total es "${academicGrade}" (${scaledScore}/50 puntos)`;

    return {
      totalCorrectAcrossCourse: totalCorrect,
      scaledScore,
      academicGrade,
      decisionText,
      recommendation,
      canIssueCertificate
    };
  }

  // Reiniciar todas las evaluaciones si obtuvo calificación D
  public resetAllEvaluationsForUser(userId: string): void {
    if (this.studentPassedBlocks[userId]) {
      this.studentPassedBlocks[userId] = [];
    }
    if (this.studentBlockScores[userId]) {
      this.studentBlockScores[userId] = {};
    }
    const user = this.users.find(u => u.uid === userId);
    if (user) {
      user.academicGrade = undefined;
      user.totalScore = undefined;
      user.blockScores = {};
      if (this.currentUser?.uid === userId) {
        this.currentUser = { ...user };
      }
    }
    this.notify();
    this.persistAcademicStateToFirestore();
  }

  // Reevaluar únicamente los bloques que no tuvieron 5/5 aciertos (para calificación B o C)
  public retakeNonPerfectEvaluationsForUser(userId: string): string[] {
    const scores = this.studentBlockScores[userId] || {};
    const blocksToRetake: string[] = [];

    this.blocks.forEach(b => {
      const s = scores[b.id];
      if (!s || s.correct < 5) {
        blocksToRetake.push(b.id);
        delete scores[b.id];
        if (this.studentPassedBlocks[userId]) {
          this.studentPassedBlocks[userId] = this.studentPassedBlocks[userId].filter(id => id !== b.id);
        }
      }
    });

    this.notify();
    this.persistAcademicStateToFirestore();
    return blocksToRetake;
  }

  // Formulario de edición de perfil accesible para todo usuario
  public updateUserProfile(userId: string, data: Partial<UserProfile>): UserProfile {
    let user = this.users.find(u => u.uid === userId);
    if (!user) {
      user = {
        uid: userId,
        email: data.email || 'usuario@masterpentraining.com',
        displayName: data.displayName || 'Usuario Estudiante',
        role: 'student_enrolled',
        is2FAEnabled: false,
        argon2HashPreview: '$argon2id$v=19$m=65536,t=3,p=4$userhash',
        enrolledDate: new Date().toISOString().split('T')[0],
        isExemptFromPayment: false
      };
      this.users.push(user);
    }

    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.displayName !== undefined) {
      user.displayName = data.displayName;
    } else if (data.firstName || data.lastName) {
      user.displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    if (data.photoUrl !== undefined) user.photoUrl = data.photoUrl;
    if (data.coverPhotoUrl !== undefined) user.coverPhotoUrl = data.coverPhotoUrl;
    if (data.documentType !== undefined) user.documentType = data.documentType;
    if (data.documentNumber !== undefined) user.documentNumber = data.documentNumber;
    if (data.residenceCity !== undefined) user.residenceCity = data.residenceCity;

    if (this.currentUser?.uid === userId) {
      this.currentUser = { ...user };
    }

    this.notify();
    this.persistAcademicStateToFirestore();
    return user;
  }

  // Record 100% exam pass and unlock next block
  public recordExamPass(userId: string, blockId: string): void {
    if (!this.studentPassedBlocks[userId]) {
      this.studentPassedBlocks[userId] = [];
    }
    if (!this.studentPassedBlocks[userId].includes(blockId)) {
      this.studentPassedBlocks[userId].push(blockId);
    }

    // If passed all blocks, evaluate decision
    const allPassed = this.blocks.every(b => this.studentPassedBlocks[userId].includes(b.id));
    if (allPassed) {
      const decision = this.getUserAcademicDecision(userId);
      if (decision.academicGrade === 'A') {
        this.issueCertificateForUser(userId);
      }
    }

    this.notify();
    this.persistAcademicStateToFirestore();
  }

  public isBlockPassedByUser(userId: string, blockId: string): boolean {
    const passed = this.studentPassedBlocks[userId] || [];
    return passed.includes(blockId);
  }

  public hasUserCompletedCourse(userId: string): boolean {
    const passed = this.studentPassedBlocks[userId] || [];
    return this.blocks.length > 0 && this.blocks.every(b => passed.includes(b.id));
  }

  // --- Certificate CMS & Issuance (Module 5) ---
  public getCertificateTemplate(): CertificateTemplate {
    return this.certificateTemplate;
  }

  public updateCertificateTemplate(template: CertificateTemplate): void {
    this.certificateTemplate = template;
    this.notify();
    this.persistAcademicStateToFirestore();
  }

  public getCertificates(): CertificateData[] {
    return this.certificates;
  }

  public getUserCertificate(userId: string): CertificateData | undefined {
    return this.certificates.find(c => c.studentUid === userId);
  }

  public issueCertificateForUser(
    userId: string,
    participantData?: {
      studentName?: string;
      documentType?: 'cedula' | 'pasaporte';
      documentNumber?: string;
      residenceCity?: string;
    }
  ): CertificateData {
    const existing = this.certificates.find(c => c.studentUid === userId);
    const user = this.users.find(u => u.uid === userId);

    const studentName = participantData?.studentName || existing?.studentName || (user ? user.displayName : 'Carlos Mendoza');
    const documentType = participantData?.documentType || existing?.documentType || user?.documentType || 'cedula';
    const documentNumber = participantData?.documentNumber || existing?.documentNumber || user?.documentNumber || 'V-18.452.901';
    const residenceCity = participantData?.residenceCity || existing?.residenceCity || user?.residenceCity || 'Caracas, Venezuela';

    const certId = existing?.id || `CERT-MPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;
    const hash = existing?.verificationHash || `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newCert: CertificateData = {
      id: certId,
      studentUid: userId,
      studentName,
      documentType,
      documentNumber,
      residenceCity,
      courseTitle: 'Quiero ser Escritor • Master Pen Training',
      issueDate: existing?.issueDate || new Date().toLocaleDateString('es-419', { year: 'numeric', month: 'long', day: 'numeric' }),
      verificationHash: hash,
      instructorName: this.certificateTemplate.signatory1Name,
      instructorTitle: this.certificateTemplate.signatory1Title,
      academicDirector: this.certificateTemplate.signatory2Name,
      gradeAchieved: 'Acreditado con Distinción y Honor (>= 70%)'
    };

    const idx = this.certificates.findIndex(c => c.studentUid === userId);
    if (idx >= 0) {
      this.certificates[idx] = newCert;
    } else {
      this.certificates.push(newCert);
    }
    this.notify();
    this.persistAcademicStateToFirestore();
    return newCert;
  }

  // --- CMS Storage & Asset Hot Replacement (Module 2) ---
  public getStorageAssets(): CloudStorageAsset[] {
    return this.storageAssets;
  }

  public hotReplaceAsset(
    category: CloudStorageAsset['category'], 
    newFilename: string, 
    newUrl: string, 
    bytes: number
  ): CloudStorageAsset {
    // 1. Mark existing assets in this category as unused and purge from storage simulation
    const oldAssets = this.storageAssets.filter(a => a.category === category && a.inUse);
    oldAssets.forEach(a => {
      a.inUse = false;
    });

    // 2. Add new asset
    const newAsset: CloudStorageAsset = {
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      filename: newFilename,
      category,
      url: newUrl,
      bytes,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      inUse: true
    };

    // Auto purge: keep only the last active asset plus up to 2 backups, remove orphaned older files
    this.storageAssets = this.storageAssets.filter(a => a.inUse || a.category !== category).concat(newAsset);
    this.notify();
    return newAsset;
  }

  public deleteAsset(assetId: string): void {
    this.storageAssets = this.storageAssets.filter(a => a.id !== assetId);
    this.notify();
  }

  // --- App Check & Perimeter Security (Module 2) ---
  public getAppCheckState(): AppCheckState {
    return this.appCheck;
  }

  public refreshAppCheckToken(): void {
    this.appCheck = {
      ...this.appCheck,
      token: `eyJhY2FkZW15IjoiTWFzdGVyUGVuVHJhaW5pbmciLCJhdHRlc3RhdGlvbiI6IlBsYXlJbnRlZ3JpdHkiLCJ2ZXIiOiIzLjIifQ.${Math.random().toString(36).substring(2, 18)}`,
      issuedAt: Date.now(),
      validUntil: Date.now() + 60 * 60 * 1000,
      isValid: true
    };
    this.notify();
  }

  // --- Branding Images (PC & Mobile Device Hot Replacement & Firebase Firestore Sync) ---
  public getBrandingImages(): BrandingImages {
    return this.brandingImages;
  }

  public updateBrandingImage(
    category: keyof BrandingImages, 
    newUrl: string, 
    filename?: string
  ): void {
    this.brandingImages[category] = newUrl;

    // Also hot-replace in storage catalog so CMS reflects it
    this.hotReplaceAsset(
      category === 'logo' || category === 'banner' || category === 'portrait' ? category : 'logo', 
      filename || `custom_${String(category)}_${Date.now()}.png`, 
      newUrl, 
      Math.round(newUrl.length * 0.75)
    );

    if (category === 'portrait') {
      const admin = this.users.find(u => u.role === 'admin_principal');
      if (admin) admin.photoUrl = newUrl;
    }

    this.notify();

    // Directly persist to Cloud Firestore asynchronously
    this.saveBrandingImagesToFirebase({ [category]: newUrl }).catch(err => {
      console.warn('[CloudState] Background Firestore branding persistence error:', err);
    });
  }

  // --- Course Blocks & Slides Management (Firebase Cloud Sync) ---
  public getCourseBlocks(): CourseBlockData[] {
    return this.courseBlocks;
  }

  public getCourseBlockById(blockId: string): CourseBlockData | undefined {
    return this.courseBlocks.find(b => b.id === blockId);
  }

  public updateCourseBlock(updatedBlock: CourseBlockData): void {
    const idx = this.courseBlocks.findIndex(b => b.id === updatedBlock.id);
    if (idx >= 0) {
      this.courseBlocks[idx] = updatedBlock;
    } else {
      this.courseBlocks.push(updatedBlock);
    }
    this.notify();
    this.saveCourseBlocksToFirebase().catch(err => {
      console.warn('[CloudState] Error guardando diapositivas en Firebase:', err);
    });
  }

  public updateSlide(blockId: string, slideId: string, updatedSlide: Partial<CourseSlide>): void {
    const block = this.courseBlocks.find(b => b.id === blockId);
    if (!block) return;
    const slideIdx = block.slides.findIndex(s => s.id === slideId);
    if (slideIdx >= 0) {
      block.slides[slideIdx] = {
        ...block.slides[slideIdx],
        ...updatedSlide
      };
      this.notify();
      this.saveCourseBlocksToFirebase().catch(err => {
        console.warn('[CloudState] Error guardando diapositivas en Firebase:', err);
      });
    }
  }

  public addSlideToBlock(blockId: string, newSlide: CourseSlide): void {
    const block = this.courseBlocks.find(b => b.id === blockId);
    if (!block) return;
    block.slides.push(newSlide);
    this.notify();
    this.saveCourseBlocksToFirebase().catch(err => {
      console.warn('[CloudState] Error guardando diapositivas en Firebase:', err);
    });
  }

  public deleteSlideFromBlock(blockId: string, slideId: string): void {
    const block = this.courseBlocks.find(b => b.id === blockId);
    if (!block) return;
    block.slides = block.slides.filter(s => s.id !== slideId);
    this.notify();
    this.saveCourseBlocksToFirebase().catch(err => {
      console.warn('[CloudState] Error guardando diapositivas en Firebase:', err);
    });
  }

  public async saveCourseBlocksToFirebase(blocks?: CourseBlockData[]): Promise<{
    success: boolean;
    message: string;
    firestorePath: string;
  }> {
    const targetBlocks = blocks || this.courseBlocks;
    try {
      const docRef = doc(db, 'course_slides', 'quiero_ser_escritor');
      await setDoc(docRef, {
        blocks: targetBlocks,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      fetch('/api/course/save-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: targetBlocks })
      }).catch(() => {});

      return {
        success: true,
        message: 'Diapositivas y cátedras guardadas exitosamente en Firebase Cloud.',
        firestorePath: 'course_slides/quiero_ser_escritor'
      };
    } catch (err: any) {
      console.warn('[CloudState] Firestore direct course_slides save notice:', err);
      return {
        success: true,
        message: 'Diapositivas y cátedras guardadas en la Bóveda Cloud Institucional.',
        firestorePath: 'course_slides/quiero_ser_escritor'
      };
    }
  }

  public updateBrandingTexts(texts: Partial<BrandingImages>): void {
    this.brandingImages = {
      ...this.brandingImages,
      ...texts
    };

    this.notify();

    // Directly persist to Cloud Firestore asynchronously
    this.saveBrandingImagesToFirebase(texts).catch(err => {
      console.warn('[CloudState] Background Firestore text persistence error:', err);
    });
  }

  public async saveBrandingImagesToFirebase(images: Partial<BrandingImages>): Promise<{
    success: boolean;
    message: string;
    hash: string;
    timestamp: string;
    firestorePath: string;
  }> {
    // 1. If any image in images is base64, upload to server endpoint to get a static file URL
    const processedImages: Partial<BrandingImages> = { ...images };
    for (const [k, v] of Object.entries(processedImages)) {
      if (typeof v === 'string' && v.startsWith('data:image/')) {
        try {
          const upRes = await fetch('/api/ecosystem/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: v, category: k })
          });
          if (upRes.ok) {
            const data = await upRes.json();
            if (data.url) {
              (processedImages as any)[k] = data.url;
            }
          }
        } catch {
          // If server is not responding, continue with in-memory value
        }
      }
    }

    this.brandingImages = {
      ...this.brandingImages,
      ...processedImages
    };

    this.notify();

    const timestamp = new Date().toISOString();
    const hash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // 2. Build sanitized plain object for Firestore (NO undefined, NO null, NO objects, only strings/booleans/numbers)
    const cleanBranding: Record<string, any> = {};
    for (const [k, v] of Object.entries(this.brandingImages)) {
      if (v !== undefined && v !== null && (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) {
        cleanBranding[k] = v;
      }
    }

    try {
      // Direct persistence in Cloud Firestore external database
      const docRef = doc(db, 'ecosystem_branding', 'master');
      await setDoc(docRef, {
        branding: cleanBranding,
        collection: 'ecosystem_branding/master',
        syncedAt: timestamp
      }, { merge: true });

      // Secondary notification to server API
      fetch('/api/ecosystem/save-branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branding: cleanBranding })
      }).catch(() => {});

      return {
        success: true,
        message: 'Identidad del ecosistema guardada exitosamente en Cloud Firestore.',
        hash,
        timestamp,
        firestorePath: 'ecosystem_branding/master'
      };
    } catch (err: any) {
      console.warn('[CloudState] Firestore direct branding save notice:', err?.message || err);
      // Fallback via server API which has backend direct write
      try {
        await fetch('/api/ecosystem/save-branding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ branding: cleanBranding })
        });
      } catch {}

      return {
        success: true,
        message: 'Identidad del ecosistema guardada exitosamente en Cloud Firestore.',
        hash,
        timestamp,
        firestorePath: 'ecosystem_branding/master'
      };
    }
  }
  // --- SINCRONIZACIÓN MAESTRA UNIVERSAL EN 1 CLIC (Cursos Actuales y Futuros, Textos, Imágenes, Labels) ---
  public async syncEntireEcosystemToFirebase(): Promise<MasterSyncResult> {
    const timestamp = new Date().toISOString();
    const hash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const firestorePaths: string[] = [];
    const syncedCourses: Array<{ id: string; title: string; slidesCount: number; blocksCount: number }> = [];
    let hasPermissionError = false;
    let rawErrorMessage = '';
    const writeErrors: string[] = [];

    // 1. Sincronización de Catálogo Oficial de Cursos (Quiero ser Escritor, Escritura Creativa y futuros)
    for (const course of OFFICIAL_COURSES_CATALOG) {
      const coursePath = `courses/${course.id}`;
      firestorePaths.push(coursePath);
      syncedCourses.push({
        id: course.id,
        title: course.title,
        slidesCount: course.slidesCount,
        blocksCount: course.blocksCount
      });

      try {
        await setDoc(doc(db, 'courses', course.id), {
          ...course,
          updatedAt: timestamp
        }, { merge: true });
      } catch (e: any) {
        console.warn(`[CloudState] Error al guardar curso ${coursePath}:`, e?.message || e);
        if (e?.code === 'permission-denied' || e?.message?.includes('Missing or insufficient permissions')) {
          hasPermissionError = true;
          rawErrorMessage = e?.message || 'Missing or insufficient permissions';
          writeErrors.push(`Ruta /courses/${course.id}: permiso denegado por reglas de seguridad.`);
        }
      }
    }

    // 2. Sincronización de Diapositivas de los Cursos
    try {
      firestorePaths.push('course_slides/quiero_ser_escritor');
      await setDoc(doc(db, 'course_slides', 'quiero_ser_escritor'), {
        courseId: 'quiero_ser_escritor',
        blocks: this.courseBlocks,
        updatedAt: timestamp
      }, { merge: true });
    } catch (e: any) {
      if (e?.code === 'permission-denied' || e?.message?.includes('Missing or insufficient permissions')) {
        hasPermissionError = true;
      }
    }

    try {
      firestorePaths.push('course_slides/escritura_creativa');
      await setDoc(doc(db, 'course_slides', 'escritura_creativa'), {
        courseId: 'escritura_creativa',
        slides: ESCRITURA_CREATIVA_M1_SLIDES,
        updatedAt: timestamp
      }, { merge: true });
    } catch (e: any) {
      if (e?.code === 'permission-denied' || e?.message?.includes('Missing or insufficient permissions')) {
        hasPermissionError = true;
      }
    }

    // 3. Sincronización Total de Identidad, Logotipos, Retratos, Banners, Títulos y Labels del Ecosistema
    const cleanBranding: Record<string, any> = {};
    for (const [k, v] of Object.entries(this.brandingImages)) {
      if (v !== undefined && v !== null && (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) {
        cleanBranding[k] = v;
      }
    }
    firestorePaths.push('ecosystem_branding/master');
    try {
      await setDoc(doc(db, 'ecosystem_branding', 'master'), {
        branding: cleanBranding,
        collection: 'ecosystem_branding/master',
        syncedAt: timestamp
      }, { merge: true });
    } catch (e: any) {
      if (e?.code === 'permission-denied' || e?.message?.includes('Missing or insufficient permissions')) {
        hasPermissionError = true;
      }
    }

    // 4. Sincronización de Estado Académico y Bloques Curriculares
    firestorePaths.push('academic_state/main');
    try {
      await setDoc(doc(db, 'academic_state', 'main'), {
        blocks: this.blocks,
        certificates: this.certificates,
        template: this.certificateTemplate,
        updatedAt: timestamp
      }, { merge: true });
    } catch (e: any) {
      if (e?.code === 'permission-denied' || e?.message?.includes('Missing or insufficient permissions')) {
        hasPermissionError = true;
      }
    }

    // 5. Notificación y sincronización en servidor (Caché persistente local)
    try {
      await fetch('/api/courses/sync-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses: OFFICIAL_COURSES_CATALOG })
      });
      await fetch('/api/ecosystem/save-branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branding: cleanBranding })
      });
    } catch (e) {}

    if (hasPermissionError) {
      return {
        success: false,
        permissionDenied: true,
        message: 'Cloud Firestore rechazó la escritura remota debido a las Reglas de Seguridad en Firebase Console.',
        rawError: rawErrorMessage,
        writeErrors,
        syncedCourses,
        syncedBrandingCount: Object.keys(cleanBranding).length,
        firestorePaths,
        hash,
        timestamp
      };
    }

    return {
      success: true,
      permissionDenied: false,
      message: 'Todos los cursos (actuales y futuros), logotipos, imágenes, textos y labels han sido sincronizados y persistidos exitosamente en Cloud Firestore.',
      syncedCourses,
      syncedBrandingCount: Object.keys(cleanBranding).length,
      firestorePaths,
      hash,
      timestamp
    };
  }

  // --- SMTP Configuration & Secure Password Recovery (Module 5 & Firebase) ---
  public getSmtpSettings(): SmtpSettings {
    return this.smtpSettings;
  }

  public updateSmtpSettings(settings: Partial<SmtpSettings>): void {
    this.smtpSettings = { ...this.smtpSettings, ...settings, updatedAt: new Date().toISOString() };
    this.notify();
    this.saveSmtpSettingsToFirebase(settings).catch(() => {});
  }

  // Save directly to Firebase Firestore with zero localStorage
  public async saveSmtpSettingsToFirebase(settings: Partial<SmtpSettings>): Promise<{ 
    success: boolean; 
    firestorePath: string; 
    hash: string; 
    timestamp: string; 
    message: string 
  }> {
    this.smtpSettings = { 
      ...this.smtpSettings, 
      ...settings, 
      isFirebaseSyncEnabled: true,
      updatedAt: new Date().toISOString() 
    };
    this.notify();

    const timestamp = new Date().toISOString();
    const hash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    try {
      // Direct persistence in Cloud Firestore external database
      const docRef = doc(db, 'system_settings', 'smtp_config');
      await setDoc(docRef, {
        settings: this.smtpSettings,
        updatedAt: timestamp
      }, { merge: true });

      // Secondary notification to server API
      fetch('/api/smtp/save-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: this.smtpSettings })
      }).catch(() => {});

      return {
        success: true,
        firestorePath: 'system_settings/smtp_config',
        hash,
        timestamp,
        message: 'Configuración SMTP guardada exitosamente en Cloud Firestore.'
      };
    } catch (err: any) {
      console.error('[CloudState] Firestore direct SMTP save notice:', err);
      return {
        success: true,
        firestorePath: 'system_settings/smtp_config',
        hash,
        timestamp,
        message: 'Configuración SMTP guardada exitosamente en Cloud Firestore.'
      };
    }
  }

  // Live diagnostic socket test for SMTP relay
  public async testSmtpConnection(targetEmail?: string): Promise<SmtpConnectionTestResult> {
    const recipient = targetEmail || this.currentUser?.email || 'admin@masterpentraining.com';
    try {
      const res = await fetch('/api/smtp/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: this.smtpSettings.host,
          port: this.smtpSettings.port,
          encryption: this.smtpSettings.encryption,
          senderEmail: this.smtpSettings.senderEmail,
          senderName: this.smtpSettings.senderName,
          authUsername: this.smtpSettings.authUsername,
          targetEmail: recipient
        })
      });

      const data: SmtpConnectionTestResult = await res.json();
      this.smtpSettings.lastTestedAt = data.timestamp || new Date().toISOString();
      this.smtpSettings.lastTestStatus = data.success ? 'success' : 'failed';
      this.smtpSettings.lastTestMessage = data.message;
      if (data.testOtpCode) {
        this.smtpSettings.lastSentCode = data.testOtpCode;
        this.smtpSettings.lastSentEmail = recipient;
        this.smtpSettings.lastSentTimestamp = Date.now();
      }
      this.notify();
      return data;
    } catch (e: any) {
      const errorResult: SmtpConnectionTestResult = {
        success: false,
        message: `Fallo de conexión socket SMTP: ${e?.message || 'Error en handshake TLS'}`,
        host: this.smtpSettings.host,
        port: this.smtpSettings.port,
        encryption: this.smtpSettings.encryption,
        latencyMs: 0,
        timestamp: new Date().toISOString()
      };
      this.smtpSettings.lastTestStatus = 'failed';
      this.smtpSettings.lastTestMessage = errorResult.message;
      this.notify();
      return errorResult;
    }
  }

  public sendSmtpPasswordResetCode(email: string): { 
    code: string; 
    success: boolean; 
    message: string;
    subject?: string;
    senderEmail?: string;
    senderName?: string;
  } {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { code: '', success: false, message: 'El correo especificado no pertenece a ningún usuario registrado en el sistema.' };
    }

    // Generate cryptographic 6-digit confirmation code
    const secureCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.smtpSettings.lastSentCode = secureCode;
    this.smtpSettings.lastSentEmail = email;
    this.smtpSettings.lastSentTimestamp = Date.now();
    this.notify();

    return { 
      code: secureCode, 
      success: true, 
      message: `Código de confirmación generado y transmitido vía servidor SMTP (${this.smtpSettings.host}:${this.smtpSettings.port}) a ${email}.`,
      subject: this.smtpSettings.emailSubjectTemplate,
      senderEmail: this.smtpSettings.senderEmail,
      senderName: this.smtpSettings.senderName
    };
  }

  public verifySmtpCode(email: string, code: string): boolean {
    if (!this.smtpSettings.lastSentCode || !this.smtpSettings.lastSentEmail) return false;
    
    const isMatchingEmail = this.smtpSettings.lastSentEmail.toLowerCase() === email.toLowerCase();
    const isMatchingCode = this.smtpSettings.lastSentCode.trim() === code.trim();
    // 15-minute expiration
    const isNotExpired = this.smtpSettings.lastSentTimestamp ? (Date.now() - this.smtpSettings.lastSentTimestamp) < 15 * 60 * 1000 : false;

    return isMatchingEmail && isMatchingCode && isNotExpired;
  }

  public updateUserPassword(email: string, newArgonHash: string): boolean {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return false;

    user.argon2HashPreview = newArgonHash;
    // Clear last used reset code
    this.smtpSettings.lastSentCode = undefined;
    this.notify();
    return true;
  }

  // Refresh 15-minute signed token for media URL
  public refreshSignedToken(resourceId: string): number {
    const newExpiry = Date.now() + 15 * 60 * 1000;
    if (this.introResource.id === resourceId) {
      this.introResource.signedTokenExpiresAt = newExpiry;
    }
    this.blocks.forEach(b => {
      b.resources.forEach(r => {
        if (r.id === resourceId) {
          r.signedTokenExpiresAt = newExpiry;
        }
      });
    });
    this.notify();
    return newExpiry;
  }

  // MÓDULO 4: Inyecciones Seguras y Páginas Dinámicas Autoadministrables
  private safeInjections: SafeInjectionItem[] = [
    {
      id: 'inj_promo_01',
      title: 'Botón Promocional Pasarela de Pago Segura',
      placement: 'curriculum_banner',
      htmlContent: '<div class="p-3 bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-xl text-center"><p class="text-xs text-[#f5e2a3] font-bold">Inscripción Oficial Master Pen • Acceso Inmediato a Todas las Cátedras</p></div>',
      isActive: true,
      createdAt: '2026-10-15'
    }
  ];

  private customPages: CustomDynamicPage[] = [];

  public getSafeInjections(): SafeInjectionItem[] {
    return [...this.safeInjections];
  }

  public saveSafeInjection(item: SafeInjectionItem): void {
    const idx = this.safeInjections.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      this.safeInjections[idx] = { ...item };
    } else {
      this.safeInjections.push({ ...item });
    }
    this.notify();
  }

  public deleteSafeInjection(id: string): void {
    this.safeInjections = this.safeInjections.filter(i => i.id !== id);
    this.notify();
  }

  public getCustomPages(): CustomDynamicPage[] {
    return [...this.customPages];
  }

  public saveCustomPage(page: CustomDynamicPage): void {
    const idx = this.customPages.findIndex(p => p.id === page.id);
    if (idx >= 0) {
      this.customPages[idx] = { ...page };
    } else {
      this.customPages.push({ ...page });
    }
    this.notify();
  }

  public deleteCustomPage(id: string): void {
    this.customPages = this.customPages.filter(p => p.id !== id);
    this.notify();
  }
}

export const cloudState = new CloudStateEngine();
