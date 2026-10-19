// Master Pen Training - Catálogo Oficial de Cursos del Ecosistema
// Cualquier curso actual o futuro registrado aquí se sincroniza automáticamente con Cloud Firestore

export interface CourseCatalogItem {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  mentor: string;
  narrator: string;
  blocksCount: number;
  slidesCount: number;
  status: 'published' | 'draft' | 'archived';
  badge: string;
  tags: string[];
  schemaVersion?: string;
  updatedAt?: string;
}

export const OFFICIAL_COURSES_CATALOG: CourseCatalogItem[] = [
  {
    id: 'quiero_ser_escritor',
    title: 'Quiero ser Escritor',
    subtitle: 'El Arte y Oficio de Escribir, Estructurar y Publicar tu Propia Obra',
    author: 'Master Pen Studio Creations',
    mentor: 'Michael Pen',
    narrator: 'Michael Pen',
    blocksCount: 5,
    slidesCount: 50,
    status: 'published',
    badge: 'Cátedra Rectoral',
    tags: ['literatura', 'oratoria', 'maestría_estilo', 'cátedra_rectoral']
  },
  {
    id: 'escritura_creativa',
    title: 'Escritura Creativa',
    subtitle: 'Captura de Disparadores, Principio de Fricción Cero y Registro de 4 Campos',
    author: 'Anthony Small',
    mentor: 'Anthony Small',
    narrator: 'Michael Pen / Anthony Small',
    blocksCount: 1,
    slidesCount: 5,
    status: 'published',
    badge: 'Especialización',
    schemaVersion: 'ASSESSMENT_SCHEMA_v1',
    tags: ['escritura_creativa', 'fricción_cero', 'disparadores', 'psicometría']
  }
];
