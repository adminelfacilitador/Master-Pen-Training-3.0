import { 
  AcademicBlock, 
  UserProfile, 
  CertificateTemplate, 
  CloudStorageAsset,
  PsychometricQuestion,
  OptionLetter
} from '../types';
import { BRANDING } from '../assets/branding';
import { getAcademicBlocksForCourse, QUIERO_SER_ESCRITOR_BLOCKS } from './quieroSerEscritorCourse';

// Real Accounts (Master Pen Training)
export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'usr_admin_principal_01',
    email: 'admin@masterpentraining.com',
    displayName: 'Michael Pen',
    firstName: 'Michael',
    lastName: 'Pen',
    role: 'admin_principal',
    is2FAEnabled: true,
    totpSecret: 'JBSWY3DPEHPK3PXP',
    argon2HashPreview: '$2b$12$e6c2a8f9d0e1b2c3d4e5f6',
    enrolledDate: '2025-01-01',
    isExemptFromPayment: true,
    photoUrl: BRANDING.portrait,
    coverPhotoUrl: BRANDING.banner,
    residenceCity: 'Panamá'
  },
  {
    uid: 'usr_student_active_01',
    email: 'alumno@masterpentraining.com',
    displayName: 'Carlos Mendoza',
    role: 'student_enrolled',
    is2FAEnabled: false,
    argon2HashPreview: '$2b$12$a1b2c3d4e5f6a7b8c9d0e1',
    enrolledDate: '2026-03-01',
    isExemptFromPayment: false,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  }
];

// Course Intro Resource: Quiero ser Escritor
export const COURSE_INTRO_RESOURCE = {
  id: 'res_intro_00',
  title: 'Lección Cero: Manifiesto "Quiero ser Escritor" por Michael Pen',
  type: 'video' as const,
  storageUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  signedTokenExpiresAt: Date.now() + 15 * 60 * 1000,
  durationMinutes: 5.0,
  subtitles: `00:00:01.000 --> 00:00:06.000
Bienvenidos al curso Quiero ser Escritor de Master Pen Training. Soy Michael Pen.

00:00:06.500 --> 00:00:12.000
Este curso es su guía integral para transmutar el anhelo interior en una obra publicada.

00:00:12.500 --> 00:00:18.000
Aprenderá los orígenes de la palabra, la anatomía de un libro, los géneros literarios y el proceso editorial.

00:00:18.500 --> 00:00:24.000
Cada diapositiva y fotovideo ha sido concebido para formarle con rigor, calidez y excelencia.`,
  transcript: `Bienvenido al curso "Quiero ser Escritor" de Master Pen Training. En este manifiesto fundacional, Michael Pen desglosa los pilares que separan al aficionado del autor publicado: el dominio de la estructura formal del libro, la construcción de hábitos inquebrantables de redacción, la comprensión del mercado editorial contemporáneo y la confianza en la propia voz. Ningún estudiante avanza en esta academia sin haber demostrado comprensión categórica de cada principio evaluado.`,
  fileSizeBytes: 48500000,
  order: 0
};

// Academic Curriculum Blocks: 5 Real Blocks of "Quiero ser Escritor"
export const INITIAL_BLOCKS: AcademicBlock[] = getAcademicBlocksForCourse();

// Helper to generate psychometric question banks per block for "Quiero ser Escritor"
export function generateBlockQuestionBank(blockId: string): PsychometricQuestion[] {
  const bank: PsychometricQuestion[] = [];
  
  const blockData = QUIERO_SER_ESCRITOR_BLOCKS.find(b => b.id === blockId);
  const baseQuestions = blockData?.questionBank || [];

  bank.push(...baseQuestions);

  const blockThemes: Record<string, { topic: string; correctAnswers: string[]; similarFalses: string[]; completelyFalses: string[]; confusingFalses: string[] }> = {
    block_01: {
      topic: 'Los Orígenes de la Escritura',
      correctAnswers: [
        'La escritura cuneiforme nació en Mesopotamia hacia el 3200 a.C. sobre arcilla para preservar leyes y relatos.',
        'Gutenberg democratizó el acceso al saber en 1440 mediante la invención de tipos móviles metálicos y la prensa.',
        'La Biblia es el fenómeno editorial más influyente al haber sido forjada a lo largo de 1,500 años por más de 40 autores.',
        'La autopublicación digital contemporánea permite distribuir obras internacionalmente en menos de 72 horas reteniendo hasta el 70% de regalías.',
        'Los textos antiguos como el Código de Hammurabi demostraron que la ley escrita frena la arbitrariedad y consolida la civilización.'
      ],
      similarFalses: [
        'La escritura surgió hace apenas dos siglos gracias a la masificación de las máquinas de escribir mecánicas.',
        'Gutenberg inventó la tinta china pero no pudo imprimir libros en vida por prohibición imperial.',
        'La Biblia fue redactada íntegramente por un único cronista en un lapso de cinco meses.',
        'Las plataformas de autopublicación exigen pagar mil dólares de matrícula por cada país de distribución.',
        'Las tablillas cuneiformes solo se empleaban para dibujos decorativos y carecían de significado lingüístico.'
      ],
      completelyFalses: [
        'Los libros comenzaron a existir con la llegada de las redes sociales e internet.',
        'Escribir es un delito en las sociedades modernas con legislación digital.',
        'Los jeroglíficos egipcios fueron inventados en París durante la Revolución Francesa.',
        'Nadie lee libros en la actualidad debido a la desaparición total del papel.',
        'La literatura universal solo admite textos escritos en latín clásico.'
      ],
      confusingFalses: [
        'La escritura cuneiforme sumeria surgió exclusivamente para el entretenimiento lírico infantil.',
        'La imprenta de Gutenberg encareció los libros haciendo que solo los reyes pudieran adquirirlos.',
        'La tradición oral desapareció por completo el mismo día en que se escribió la primera tablilla de arcilla.',
        'La autopublicación digital prohíbe al autor elegir el precio de venta de su propia obra.',
        'El Código de Hammurabi era una novela costumbrista sobre pescadores del Éufrates.'
      ]
    },
    block_02: {
      topic: 'Anatomía de un Libro',
      correctAnswers: [
        'El prólogo es redactado por una tercera persona reconocida, mientras que el prefacio o introducción lo escribe el propio autor.',
        'La página de derechos (copyright) protege la propiedad intelectual mediante el año, titular y código ISBN.',
        'El índice o tabla de contenidos es indispensable en no ficción para guiar la navegación temática del lector.',
        'La portada profesional debe transmitir género, título y promesa de valor en menos de tres segundos.',
        'La dedicatoria es una sección íntima de una a tres líneas que se coloca en página impar antes del primer capítulo.'
      ],
      similarFalses: [
        'El prólogo y el prefacio son exactamente el mismo texto repetido dos veces por error tipográfico.',
        'La página de derechos solo es requerida si el libro supera las mil páginas de extensión.',
        'El índice debe colocarse de forma obligatoria en la portada exterior del libro.',
        'La portada no influye en las ventas digitales puesto que nadie mira las imágenes.',
        'La dedicatoria debe tener un mínimo de cincuenta páginas para ser válida legalmente.'
      ],
      completelyFalses: [
        'Un libro profesional carece de capítulos y se redacta en un solo párrafo corrido.',
        'El código ISBN es un número telefónico para llamar al presidente de la editorial.',
        'Los epílogos están prohibidos en la literatura hispanoamericana.',
        'La biografía del autor debe ocultarse para que nadie sepa quién escribió la obra.',
        'Las portadas de libros deben imprimirse siempre sin título para fomentar el misterio.'
      ],
      confusingFalses: [
        'El prefacio debe ser redactado obligatoriamente por el impresor del taller.',
        'La página de derechos sustituye la necesidad de registrar el título ante el gobierno.',
        'El índice es opcional en diccionarios y enciclopedias médicas pero obligatorio en sonetos sueltos.',
        'Un prólogo escrito por el autor se convierte automáticamente en el epílogo de la obra.',
        'La dedicatoria debe incluir la firma notariada de todos los personajes de ficción del libro.'
      ]
    },
    block_03: {
      topic: 'Géneros Literarios y tu Voz',
      correctAnswers: [
        'Un género literario establece un pacto de expectativas claras entre el autor y su público específico.',
        'La no ficción busca educar, transformar y resolver dilemas reales de la vida cotidiana del lector.',
        'La ficción utiliza tramas verosímiles o imaginadas para desentrañar verdades profundas de la condición humana.',
        'El seudónimo es una decisión legal y estratégica para proteger la privacidad o separar registros artísticos.',
        'La voz propia del autor madura leyendo con devoción a los maestros y eliminando la afectación retórica.'
      ],
      similarFalses: [
        'Los géneros literarios fueron creados para encerrar al escritor e impedirle innovar.',
        'La no ficción prohíbe el uso de ejemplos prácticos o testimonios de personas vivas.',
        'La ficción exige obligatoriamente inventar un idioma nuevo en cada relato.',
        'Usar seudónimo es un delito castigado con la anulación de las regalías en Amazon.',
        'La voz propia se compra mediante plantillas de inteligencia artificial sin esfuerzo humano.'
      ],
      completelyFalses: [
        'Solo existe un género literario válido en el mundo: la poesía rimada renacentista.',
        'Los libros infantiles deben utilizar tecnicismos médicos para instruir a los bebés.',
        'La poesía es una fórmula matemática que prescinde de toda emoción humana.',
        'La literatura devocional y espiritual carece de lectores en el siglo XXI.',
        'Todos los escritores del mundo tienen exactamente la misma voz y estilo.'
      ],
      confusingFalses: [
        'Un libro de no ficción pierde su condición si incluye anécdotas de la infancia del autor.',
        'La autoficción exige que todos los hechos narrados sean certificados ante un juez de paz.',
        'El seudónimo solo puede ser utilizado por autores que hayan publicado al menos veinte libros.',
        'La poesía lírica no admite el verso libre según las normas de la Real Academia.',
        'El género infantil debe evitar moralejas y contener únicamente acertijos matemáticos.'
      ]
    },
    block_04: {
      topic: 'El Proceso de Escritura',
      correctAnswers: [
        'El primer borrador tiene como meta exclusiva existir; el pulido y la sofisticación nacen en la revisión.',
        'El outline o escaleta argumental previene bloqueos al trazar el mapa de los puntos de giro y capítulos.',
        'Un personaje tridimensional posee un deseo consciente, una necesidad inconsciente y una herida del pasado.',
        'La disciplina de escribir una cuota diaria vence a la espera pasiva de una supuesta inspiración milagrosa.',
        'Los diálogos memorables se nutren del subtexto: lo que no se dice supera en fuerza a lo pronunciado.'
      ],
      similarFalses: [
        'El primer borrador debe publicarse inmediatamente sin cambiar una sola coma.',
        'La escaleta solo sirve para guiones de cine y arruina la frescura de una novela.',
        'Los personajes tridimensionales deben ser siempre perfectos y carecer de debilidades.',
        'Escribir a diario fatiga el cerebro y destruye el talento creativo del autor.',
        'Los diálogos deben reproducir con exactitud todas las muletillas y silencios de una charla telefónica.'
      ],
      completelyFalses: [
        'Para escribir un libro no se debe pensar en ninguna idea previa.',
        'El bloqueo del escritor se cura no volviendo a escribir nunca más en la vida.',
        'La revisión consiste en borrar el manuscrito completo y empezar de cero cada semana.',
        'Los mejores libros se redactan en diez minutos durante un sueño profundo.',
        'Corregir la ortografía es considerado un insulto al alma del artista.'
      ],
      confusingFalses: [
        'El primer borrador debe corregirse línea por línea antes de pasar al siguiente párrafo.',
        'El subtexto en los diálogos es una técnica exclusiva de manuales de derecho penal.',
        'La escaleta argumental debe memorizarse y quemarse para no contaminar el borrador.',
        'El bloqueo creativo indica de forma irrefutable que el autor carece de vocación literaria.',
        'Los personajes secundarios deben tener más páginas de biografía que el protagonista.'
      ]
    },
    block_05: {
      topic: 'Publicación y Éxito Editorial',
      correctAnswers: [
        'Amazon KDP permite publicar bajo demanda sin costo de stock, depositando hasta el 70% de regalías.',
        'El catálogo prolífico multiplica el valor del autor; cada nuevo título impulsa las ventas de los anteriores.',
        'El ISBN asigna una identidad jurídica internacional y única a cada formato de edición (e-book, rústica, tapa dura).',
        'El equipo de lanzamiento con lectores beta genera las primeras reseñas que activan la recomendación algorítmica.',
        'El rango de $2.99 a $9.99 en e-books en Amazon KDP asegura la liquidación máxima del 70% de regalías netas.'
      ],
      similarFalses: [
        'Amazon KDP exige pagar una fianza obligatoria de cinco mil euros para publicar el primer libro.',
        'Un autor exitoso solo debe publicar un libro en toda su vida para no saturar a sus lectores.',
        'El ISBN es opcional y puede ser reemplazado por la cédula de identidad del abuelo del autor.',
        'Las reseñas de lectores beta están prohibidas en las plataformas de comercio digital.',
        'Fijar el precio de un libro digital en $0.10 garantiza obtener un 95% de regalías.'
      ],
      completelyFalses: [
        'Para publicar en Amazon se requiere ser ciudadano de la luna.',
        'Los libros impresos bajo demanda tardan cinco años en llegar a la casa del comprador.',
        'El marketing de autor consiste en pegar carteles de papel en postes de alumbrado público.',
        'Ningún escritor gana dinero con libros en el mundo contemporáneo.',
        'Las regalías editoriales son una invención mitológica de la antigua Roma.'
      ],
      confusingFalses: [
        'La publicación bajo demanda exige almacenar 500 ejemplares en la cocina de la casa del autor.',
        'El ISBN de la versión digital es idéntico obligatoriamente al de la edición en tapa dura de lujo.',
        'El precio de $0.99 en Amazon otorga el 70% de regalías netas al creador.',
        'Los lectores beta deben pagar el doble del precio de portada antes de recibir el borrador de prueba.',
        'Tener un catálogo amplio perjudica el posicionamiento porque los algoritmos dividen la atención.'
      ]
    }
  };

  const theme = blockThemes[blockId] || blockThemes.block_01;

  for (let i = 0; i < 10; i++) {
    const qIndex = i % theme.correctAnswers.length;
    const variantId = `q_${blockId}_v${i + 1}`;
    
    bank.push({
      id: variantId,
      blockId,
      question: `[${theme.topic} • Reactivo ${i + 1}] ¿Cuál de los siguientes principios fundamenta la doctrina de Master Pen sobre la materia?`,
      options: {
        A: theme.correctAnswers[qIndex],
        B: theme.similarFalses[qIndex],
        C: theme.completelyFalses[qIndex],
        D: theme.confusingFalses[qIndex]
      },
      correctAnswer: 'A',
      explanation: `La opción A sintetiza con exactitud la directriz de Michael Pen: ${theme.correctAnswers[qIndex]}`,
      difficulty: i % 2 === 0 ? 'medium' : 'hard',
      psychometricAxis: i % 3 === 0 ? 'retention' : i % 3 === 1 ? 'analysis' : 'application'
    });
  }

  return bank;
}

// Initial Certificate Template: Quiero ser Escritor (Module 5)
export const INITIAL_CERTIFICATE_TEMPLATE: CertificateTemplate = {
  academyName: 'MASTER PEN TRAINING ACADEMY',
  headerTitle: 'DIPLOMA DE MAESTRÍA LITERARIA: QUIERO SER ESCRITOR',
  bodyTemplate: 'Por haber acreditado con calificación perfecta (100%) los cinco bloques curriculares, lecciones audiovisuales y evaluaciones magistrales del programa oficial Quiero ser Escritor, bajo la tutela y supervisión directa de:',
  signatory1Name: 'Michael Pen',
  signatory1Title: 'Director Académico & Master Mentor',
  signatory2Name: 'Dr. Valeriano Capray',
  signatory2Title: 'Decano de Certificación y Excelencia Curricular',
  sealText: 'MASTER PEN TRAINING • OFFICIAL ACCREDITATION • CURSO QUIERO SER ESCRITOR',
  borderStyle: 'classic_gold'
};

// Initial Cloud Storage Assets (Module 2 CMS)
export const INITIAL_STORAGE_ASSETS: CloudStorageAsset[] = [
  {
    id: 'asset_01_logo',
    filename: 'Logo Master Pen Training.png',
    category: 'logo',
    url: BRANDING.logo,
    bytes: 964162,
    uploadedAt: '2026-09-28 08:48:55',
    inUse: true
  },
  {
    id: 'asset_02_banner',
    filename: 'Banner Michael Pen.png',
    category: 'banner',
    url: BRANDING.banner,
    bytes: 981050,
    uploadedAt: '2026-09-28 08:48:39',
    inUse: true
  },
  {
    id: 'asset_03_portrait',
    filename: 'Perfil Michael Pen.png',
    category: 'portrait',
    url: BRANDING.portrait,
    bytes: 962795,
    uploadedAt: '2026-09-28 08:48:12',
    inUse: true
  }
];
