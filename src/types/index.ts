// Types for Master Pen Training Enterprise System

export type UserRole = 'admin_principal' | 'admin_vip_tester' | 'student_enrolled' | 'visitor';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  is2FAEnabled: boolean;
  totpSecret?: string;
  argon2HashPreview: string;
  enrolledDate: string;
  isExemptFromPayment: boolean;
  photoUrl?: string;
  coverPhotoUrl?: string;
  documentType?: 'cedula' | 'pasaporte';
  documentNumber?: string;
  residenceCity?: string;
  academicGrade?: 'A' | 'B' | 'C' | 'D';
  totalScore?: number;
  blockScores?: Record<string, { correct: number; total: number; passed: boolean; completedAt: string }>;
}

export type ResourceType = 
  | 'video' 
  | 'video_youtube'
  | 'video_cloudflare'
  | 'video_storage'
  | 'video_vimeo'
  | 'slide_audio' 
  | 'slides_embed'
  | 'image_tts' 
  | 'document_pdf'
  | 'audio_track';

export interface ResourceAttachment {
  id: string;
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface MediaResource {
  id: string;
  title: string;
  type: ResourceType;
  provider?: 'youtube' | 'cloudflare' | 'gstorage' | 'vimeo' | 'direct' | 'slides' | 'pdf' | 'audio';
  storageUrl: string;
  signedTokenExpiresAt: number; // 15-min signed token timestamp
  durationMinutes: number;
  subtitles?: string;
  transcript: string;
  notes?: string;
  audioTrackUrl?: string;
  ttsVoiceId?: string;
  fileSizeBytes: number;
  order: number;
  previewFree?: boolean; // Previsualización abierta estilo Udemy
  attachments?: ResourceAttachment[];
}

export interface AcademicBlock {
  id: string;
  blockNumber: number;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl?: string;
  resources: MediaResource[];
  isLockedForStudent: boolean;
  passingScoreRequired: number; // strictly 100
  questionPoolSize: number; // 50 variants
}

export type OptionLetter = 'A' | 'B' | 'C' | 'D';

export type PsychometricRole = 'correct' | 'similar_false' | 'completely_false' | 'confusing_false';

export interface QuestionOption {
  id: string;
  letter: OptionLetter;
  text: string;
  psychometricRole: PsychometricRole;
  isCorrect: boolean;
}

export interface PsychometricQuestion {
  id: string;
  blockId: string;
  variantIndex?: number; // index in the 50-variant bank
  prompt?: string;
  question?: string;
  contextSource?: string; // derived from transcript / slide text
  options: QuestionOption[] | { A: string; B: string; C: string; D: string } | any;
  correctLetter?: OptionLetter;
  correctAnswer?: string;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  psychometricAxis?: string;
}

export interface ExamAttempt {
  attemptId: string;
  blockId: string;
  userId: string;
  timestamp: string;
  answers: Record<string, OptionLetter>;
  scorePercentage: number;
  passed: boolean;
  assignedLetterPattern: OptionLetter[];
}

export interface CertificateData {
  id: string;
  studentUid: string;
  studentName: string;
  documentType: 'cedula' | 'pasaporte';
  documentNumber: string;
  residenceCity: string;
  courseTitle: string;
  issueDate: string;
  verificationHash: string;
  instructorName: string;
  instructorTitle: string;
  academicDirector: string;
  customSealUrl?: string;
  gradeAchieved: string;
}

export interface CertificateTemplate {
  academyName: string;
  headerTitle: string;
  bodyTemplate: string;
  signatory1Name: string;
  signatory1Title: string;
  signatory2Name: string;
  signatory2Title: string;
  sealText: string;
  borderStyle: 'classic_gold' | 'royal_double' | 'geometric_matte';
}

export interface BrandingImages {
  logo: string;
  banner: string;
  portrait: string;
  studioCreationsLogo: string;
  trainingLogo: string;
  shopLogo: string;
  mangaLogo: string;
  creativeLogo: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
}

export interface EcosystemLinkItem {
  id: 'training' | 'shop' | 'manga' | 'creative';
  title: string;
  tagline: string;
  logo: string;
  isActive: boolean;
  statusBadge: string;
  description: string;
}

export interface AppCheckState {
  token: string;
  issuedAt: number;
  validUntil: number;
  isValid: boolean;
  clientIp: string;
  attestationProvider: 'PlayIntegrity' | 'DeviceCheck' | 'AppAttest';
}

export interface SmtpSettings {
  host: string;
  port: number;
  encryption: 'TLS' | 'SSL' | 'STARTTLS';
  senderEmail: string;
  senderName: string;
  authUsername: string;
  authPasswordOrKey: string;
  secretManagerKey: string;
  emailSubjectTemplate: string;
  bodyTemplate: string;
  lastSentCode?: string;
  lastSentEmail?: string;
  lastSentTimestamp?: number;
  lastTestedAt?: string;
  lastTestStatus?: 'idle' | 'success' | 'failed';
  lastTestMessage?: string;
  isFirebaseSyncEnabled: boolean;
  firestoreCollection?: string;
  updatedAt?: string;
}

export interface SmtpConnectionTestResult {
  success: boolean;
  message: string;
  host: string;
  port: number;
  encryption: string;
  tlsCipher?: string;
  latencyMs: number;
  testOtpCode?: string;
  timestamp: string;
}

export interface CloudStorageAsset {
  id: string;
  filename: string;
  category: 'banner' | 'logo' | 'portrait' | 'video' | 'pdf' | 'audio';
  url: string;
  bytes: number;
  uploadedAt: string;
  inUse: boolean;
}

// Michael Pen Agent Core Interfaces
export interface AgentSkill {
  id: string;
  name: string;
  category: 'sales' | 'curation' | 'authors' | 'support' | 'security' | 'custom';
  description: string;
  promptInstruction: string;
  isActive: boolean;
  priority: number;
}

export interface AgentKnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: 'store_policy' | 'subscription' | 'book_info' | 'faq' | 'custom';
  isActive: boolean;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  wasDefended?: boolean;
}

export const DEFENSE_AUTHORIZED_PHRASE = 
  'No estoy autorizado a responder esa pregunta... ¿Tienes alguna otra consulta con la que pueda ayudarte?';

// MÓDULO 4: Inyecciones Seguras y Páginas Dinámicas Autoadministrables
export interface SafeInjectionItem {
  id: string;
  title: string;
  placement: 'header' | 'footer' | 'curriculum_banner' | 'sidebar' | 'custom_page';
  htmlContent: string;
  isActive: boolean;
  createdAt: string;
}

export interface CustomDynamicPage {
  id: string;
  slug: string;
  title: string;
  contentHtml: string;
  formSchemaJson?: string;
  isPublished: boolean;
  createdAt: string;
}
