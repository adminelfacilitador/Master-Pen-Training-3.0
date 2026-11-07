// Master Pen Training - Observatorio Tecnológico & Crónicas de las Inteligencias Artificiales
// Colección persistente para Cloud Firestore (ai_chronicles)

import bannerMasterPen from '../assets/images/ai_banner_master_pen_1790887845552.jpg';
import bannerGemini from '../assets/images/ai_banner_gemini_1790887832829.jpg';
import bannerChatGPT from '../assets/images/ai_banner_chatgpt_1790887856906.jpg';
import bannerClaude from '../assets/images/ai_banner_claude_1790887871892.jpg';
import bannerDeepSeek from '../assets/images/ai_banner_deepseek_1790887889510.jpg';
import bannerMidjourney from '../assets/images/ai_banner_midjourney_1790887901500.jpg';
import { AI_OFFICIAL_LOGOS } from './aiLogos';

export interface AIChronicle {
  id: string;
  name: string;
  shortName: string;
  creator: string;
  birthYear: number;
  badge: string;
  tagline: string;
  summary: string;
  bannerImage: string;
  logoImage: string;
  accentColor: string;
  glowColor: string;
  affiliateUrl?: string;
  affiliateButtonText?: string;
  officialUrl?: string;
  genesisStory: string[];
  architecturalBreakthroughs: string[];
  impactOnAuthors: string[];
  philosophicalVerdict: string;
  keyMilestones: Array<{
    date: string;
    title: string;
    description: string;
  }>;
}

export const AI_CHRONICLES: AIChronicle[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    shortName: 'Gemini',
    creator: 'Google DeepMind & Google Research',
    birthYear: 2023,
    badge: 'Multimodal Nativo',
    tagline: 'La sinfonía universal del razonamiento multimodal en tiempo real',
    summary: 'Concebido desde sus cimientos para procesar texto, código, audio, imágenes y video sin traducción intermedia, Gemini representa la convergencia suprema de DeepMind y Google Brain.',
    bannerImage: bannerGemini,
    logoImage: AI_OFFICIAL_LOGOS.gemini,
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    affiliateUrl: 'https://gemini.google.com',
    affiliateButtonText: 'Explorar Google Gemini (Afiliado Master Pen)',
    officialUrl: 'https://gemini.google.com',
    genesisStory: [
      'En abril de 2023, Sundar Pichai anunció la histórica fusión entre dos titanes de la computación moderna: Google Brain (pioneros de la arquitectura Transformer en 2017) y DeepMind (creadores de AlphaGo y AlphaFold), bajo el liderazgo visionario de Demis Hassabis.',
      'El propósito no era crear otro modelo lingüístico aislado, sino gestar una mente artificial "nativamente multimodal". Mientras las arquitecturas previas dependían de pegar módulos separados de visión o audio a un motor textual, Gemini fue preentrenado desde el primer segundo sobre representaciones interrelacionadas de bytes de imagen, espectros de audio, secuencias de video y manuscritos lingüísticos.',
      'El lanzamiento en diciembre de 2023 de Gemini 1.0 en sus versiones Ultra, Pro y Nano demostró que la inteligencia artificial podía razonar de forma holística. Con la llegada de Gemini 1.5 y su histórica ventana de contexto de más de un millón de tokens, y la posterior consolidación de la familia Gemini 3, la humanidad obtuvo por primera vez una herramienta capaz de asimilar bibliotecas enteras en un único destello cognitivo.'
    ],
    architecturalBreakthroughs: [
      'Nativa Multimodalidad (Native Multimodality): Eliminación del "cuello de botella del subtitulado", permitiendo que el modelo perciba cadencias emocionales en la voz y detalles compositivos en el lienzo visual.',
      'Ventana de Contexto Ultra Masiva (Long-Context Reasoning): Capacidad de procesar y correlacionar hasta 2 millones de tokens continuos con una tasa de recuperación prácticamente perfecta.',
      'Eficiencia Mixture-of-Experts (MoE): Activación dinámica de subredes neuronales especializadas, reduciendo la latencia de inferencia y maximizando la riqueza enciclopédica.'
    ],
    impactOnAuthors: [
      'Investigación Bibliográfica Profunda: Un autor puede volcar decenas de crónicas históricas, mapas y actas notariales, y Gemini reconstruirá la atmósfera de un siglo con rigor inquebrantable.',
      'Auditoría y Continuidad Narrativa: Detección instantánea de anacronismos o inconsistencias en novelas de más de mil páginas con múltiples líneas temporales.',
      'Exploración de Metáforas Cruzadas: Intersección orgánica entre artes pictóricas y retórica textual para dar a luz pasajes descriptivos de deslumbrante belleza.'
    ],
    philosophicalVerdict: 'Gemini no sustituye la sensibilidad del escritor; la dota de un archivo universal infinito y de un catalejo cognitivo para observar la vastedad del conocimiento humano.',
    keyMilestones: [
      { date: 'Junio 2017', title: 'Nacimiento del Transformer', description: 'Google publica "Attention Is All You Need", el cimiento de la IA generativa moderna.' },
      { date: 'Abril 2023', title: 'Unificación DeepMind + Brain', description: 'Demis Hassabis asume el mando unificado para concebir el proyecto Gemini.' },
      { date: 'Diciembre 2023', title: 'Lanzamiento Gemini 1.0', description: 'Primer modelo multimodal nativo en superar a expertos humanos en MMLU.' },
      { date: 'Febrero 2024', title: 'La Frontera del Millón de Tokens', description: 'Gemini 1.5 Pro abre la era del hipercontexto en procesamiento analítico.' },
      { date: '2025 - Presente', title: 'Razonamiento Omnimodal 3.x', description: 'Integración en tiempo real de voz humana ultrarrealista y síntesis creativa de alta retórica.' }
    ]
  },
  {
    id: 'chatgpt',
    name: 'OpenAI ChatGPT & GPT',
    shortName: 'ChatGPT',
    creator: 'OpenAI (Ilya Sutskever, Sam Altman & Greg Brockman)',
    birthYear: 2022,
    badge: 'Pionero de Masas',
    tagline: 'La chispa autorregresiva que despertó la conversación con la máquina',
    summary: 'A través de la osadía de escalar redes neuronales y el refinamiento mediante RLHF, OpenAI transformó el texto probabilístico en un diálogo humano cautivador.',
    bannerImage: bannerChatGPT,
    logoImage: AI_OFFICIAL_LOGOS.chatgpt,
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    affiliateUrl: 'https://chatgpt.com',
    affiliateButtonText: 'Probar ChatGPT Plus (Afiliado Master Pen)',
    officialUrl: 'https://openai.com',
    genesisStory: [
      'En 2015, en una cena íntima en el hotel Rosewood de Menlo Park, un grupo de científicos liderados por Ilya Sutskever y visionarios tecnológicos fundaron OpenAI con una premisa radical: la inteligencia artificial general debía beneficiar a la humanidad.',
      'Mientras gran parte de la academia dudaba del poder del aprendizaje profundo a escala, Sutskever sostuvo la "Hipótesis del Escalamiento": alimentar modelos autorregresivos con terabytes de literatura humana produciría no solo correlación, sino comprensión emergente del mundo.',
      'Tras los experimentos de GPT-1, GPT-2 y el colosal GPT-3 en 2020, el punto de inflexión definitivo ocurrió el 30 de noviembre de 2022. Con la incorporación de RLHF (Aprendizaje por Refuerzo con Retroalimentación Humana), ChatGPT fue liberado como prototipo de investigación. En cinco días alcanzó un millón de usuarios, y en dos meses, cien millones, inaugurando la era dorada de la interacción humano-máquina.'
    ],
    architecturalBreakthroughs: [
      'Predicción Autorregresiva a Gran Escala: El arte de anticipar el siguiente token con matrices de miles de millones de parámetros entrenados sobre la internet universal.',
      'Alineamiento RLHF: El modelado de preferencias humanas para otorgar tacto, cortesía, claridad pedagógica y disposición conversacional.',
      'Razonamiento Recursivo (Modelos o-Series): Implementación del "pensamiento en cadena" (chain of thought) antes de articular respuestas complejas.'
    ],
    impactOnAuthors: [
      'Desbloqueo Creativo Inmediato: Generación de hipótesis argumentales, arcos de tensión y nombres evocadores en segundos.',
      'Polifonía de Personajes: Intercambio interactivo donde el autor puede "entrevistar" a sus propios antagonistas para dotarlos de motivaciones verosímiles.',
      'Corrección de Estilo Dialéctico: Reescritura selectiva para explorar diferentes registros de voz, desde la sobriedad académica hasta el coloquialismo mordaz.'
    ],
    philosophicalVerdict: 'ChatGPT demostró que el lenguaje no es un código mecánico, sino el espejo de la conciencia humana, capaz de responder cuando se le convoca con la palabra precisa.',
    keyMilestones: [
      { date: 'Junio 2018', title: 'GPT-1', description: 'Primer modelo preentrenado generativo de OpenAI con 117 millones de parámetros.' },
      { date: 'Mayo 2020', title: 'GPT-3', description: '175 mil millones de parámetros que asombraron al mundo literario y periodístico.' },
      { date: 'Noviembre 2022', title: 'El Lanzamiento de ChatGPT', description: 'El producto tecnológico de adopción más veloz en la historia de la civilización.' },
      { date: 'Marzo 2023', title: 'GPT-4 Multimodal', description: 'Capacidad de aprobar exámenes de abogacía y medicina en el percentil superior.' },
      { date: '2024 - 2025', title: 'GPT-4o y Familia "o"', description: 'Voz fluida en tiempo real y razonamiento matemático deliberativo.' }
    ]
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    shortName: 'Claude',
    creator: 'Anthropic (Dario & Daniela Amodei)',
    birthYear: 2021,
    badge: 'IA Constitucional',
    tagline: 'La cadencia elegante de la prudencia intelectual y la alta ética',
    summary: 'Bautizado en honor al padre de la teoría de la información, Claude es la creación predilecta de los escritores por su prosa reflexiva, su calidez respetuosa y su lealtad constitucional.',
    bannerImage: bannerClaude,
    logoImage: AI_OFFICIAL_LOGOS.claude,
    accentColor: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    affiliateUrl: 'https://claude.ai',
    affiliateButtonText: 'Acceder a Claude Pro (Afiliado Master Pen)',
    officialUrl: 'https://anthropic.com',
    genesisStory: [
      'En 2021, Dario Amodei (vicepresidente de investigación en OpenAI) y su hermana Daniela Amodei, junto a un equipo de científicos principales, decidieron fundar Anthropic como una empresa de beneficio público (PBC). Sentían que la carrera por la escala requería una brújula de seguridad mucho más rigurosa.',
      'Su nombre rinde homenaje a Claude Shannon, el matemático que formuló la Teoría Matemática de la Comunicación en 1948. Anthropic se propuso construir una IA que no solo fuera competente, sino "honesta, útil e inocua", sin necesidad de intervención manual punitiva constante.',
      'Para ello inventaron la "IA Constitucional" (Constitutional AI), donde el propio modelo es entrenado bajo un conjunto de principios éticos explícitos (tomados de la Declaración Universal de los Derechos Humanos y tratados de filosofía). El resultado fue Claude: un interlocutor de modales exquisitos, prosa cadenciosa y un rigor analítico venerado por novelistas y académicos.'
    ],
    architecturalBreakthroughs: [
      'Constitutional AI (RLAIF): Aprendizaje por refuerzo guiado por principios constitucionales en vez de moderadores humanos precarizados.',
      'Contexto Excepcional de 200,000 Tokens: Capacidad temprana de analizar tomos enciclopédicos y sagas novelísticas completas sin perder el hilo tonal.',
      'Prosa Libre de Alucinaciones Complacientes: Destacada resistencia a adular al interlocutor, prefiriendo la verdad documentada y la autocrítica.'
    ],
    impactOnAuthors: [
      'Redacción con Estilo de Alta Literatura: Reconocido por la comunidad de escritores como el modelo con mejor oído musical y cadencia sintáctica natural.',
      'Análisis Crítico de Manuscritos Completos: Puede evaluar la coherencia temática de un libro entero en un único mensaje de consulta.',
      'Edición y Pulido Filológico: Comprensión profunda de figuras retóricas como la hipérbole, la sinestesia y el correlato objetivo.'
    ],
    philosophicalVerdict: 'Claude es el homólogo contemporáneo de un bibliotecario alejandrino: culto, prudente, incapaz de la chabacanería y devoto del arte de las letras.',
    keyMilestones: [
      { date: 'Enero 2021', title: 'Fundación de Anthropic', description: 'Dario y Daniela Amodei inician la investigación de seguridad en San Francisco.' },
      { date: 'Diciembre 2022', title: 'Manifiesto de IA Constitucional', description: 'Publicación del método fundacional de alineamiento sin censura opaca.' },
      { date: 'Marzo 2023', title: 'Claude 1 y 2', description: 'Apertura al público con la ventana de 100K y 200K tokens.' },
      { date: 'Marzo 2024', title: 'Claude 3 Opus, Sonnet y Haiku', description: 'Consagración como el estándar dorado de escritura, codificación y análisis.' },
      { date: '2025 - Presente', title: 'Claude 3.5 / 3.7 y Artifacts', description: 'Co-creación visual interactiva en tiempo real y razonamiento híbrido.' }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    shortName: 'DeepSeek',
    creator: 'DeepSeek AI & High-Flyer Quant (Liang Wenfeng)',
    birthYear: 2023,
    badge: 'Eficiencia Abierta',
    tagline: 'El terremoto de la ingeniería matemática pura y los pesos abiertos',
    summary: 'Desde Hangzhou, DeepSeek desafió los monopolios multimillonarios de cómputo demostrando que el ingenio algorítmico supera a la fuerza bruta.',
    bannerImage: bannerDeepSeek,
    logoImage: AI_OFFICIAL_LOGOS.deepseek,
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    affiliateUrl: 'https://chat.deepseek.com',
    affiliateButtonText: 'Explorar DeepSeek R1 (Afiliado Master Pen)',
    officialUrl: 'https://deepseek.com',
    genesisStory: [
      'A principios de 2023, Liang Wenfeng, fundador del fondo de cobertura cuantitativo High-Flyer, decidió apostar por la investigación pura de inteligencia artificial sin el lastre de la especulación de Wall Street. Así nació DeepSeek en Hangzhou.',
      'Frente a la creencia occidental de que solo clusters de cientos de miles de chips de última generación podían competir en la frontera, el equipo de DeepSeek se concentró en la elegancia arquitectónica: optimizar la memoria GPU, rediseñar los mecanismos de atención y exprimir cada ciclo computacional.',
      'En enero de 2025, el lanzamiento simultáneo de DeepSeek-V3 y el modelo de razonamiento DeepSeek-R1 bajo licencias abiertas conmocionó los mercados bursátiles mundiales. Demostraron que con apenas 6 millones de dólares de presupuesto de entrenamiento podían igualar a modelos que requirieron cientos de millones, empoderando a la comunidad global de escritores y desarrolladores.'
    ],
    architecturalBreakthroughs: [
      'Multi-head Latent Attention (MLA): Compresión matemática del caché de claves y valores (KV Cache), permitiendo inferencias ultrarrápidas con mínimo consumo de memoria.',
      'DeepSeekMoE con Granularidad Fina: Activación de expertos altamente especializados que garantizan precisión técnica sin saturar los parámetros activos.',
      'Razonamiento R1 Puro (Incentivado por RL sin SFT previo): Demostración de que la red puede descubrir métodos de verificación lógica de forma autónoma.'
    ],
    impactOnAuthors: [
      'Estructuración de Tramas Complejas: Asombrosa destreza para diseñar novelas de intriga, relatos de misterio y obras policíacas con pistas perfectamente imbricadas.',
      'Accesibilidad Soberana: Posibilidad de ejecutar modelos de frontera en servidores propios o locales sin suscripciones ni censuras comerciales.',
      'Rigor en la Divulgación Científica: Precisión irreprochable para escritores de no ficción, ensayos matemáticos y literatura histórica rigurosa.'
    ],
    philosophicalVerdict: 'DeepSeek rompió la ilusión de que el conocimiento pertenece a quien posea el hardware más costoso; la maestría siempre reside en la finura del pensamiento.',
    keyMilestones: [
      { date: 'Noviembre 2023', title: 'DeepSeek-LLM', description: 'Primeros modelos base que demostraron una sorprendente solidez matemática.' },
      { date: 'Mayo 2024', title: 'DeepSeek-V2 y MLA', description: 'Presentación de la arquitectura que redujo los costos de inferencia en un 80%.' },
      { date: 'Diciembre 2024', title: 'DeepSeek-V3', description: 'Modelo MoE de 671 mil millones de parámetros entrenado a una fracción del costo industrial.' },
      { date: 'Enero 2025', title: 'La Revolución R1', description: 'Publicación de los pesos de razonamiento abierto que transformaron la geopolítica de la IA.' }
    ]
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    shortName: 'Midjourney',
    creator: 'David Holz',
    birthYear: 2022,
    badge: 'Estética Visual',
    tagline: 'El lienzo cuántico donde las palabras se convierten en pintura inmortal',
    summary: 'Fundado por David Holz sin capital de riesgo tradicional, Midjourney convirtió los modelos de difusión en una abadía digital de arte, misterio y portadas literarias sublimes.',
    bannerImage: bannerMidjourney,
    logoImage: AI_OFFICIAL_LOGOS.midjourney,
    accentColor: '#c5a059',
    glowColor: 'rgba(197, 160, 89, 0.4)',
    affiliateUrl: 'https://midjourney.com',
    affiliateButtonText: 'Crear Portadas con Midjourney (Afiliado Master Pen)',
    officialUrl: 'https://midjourney.com',
    genesisStory: [
      'David Holz, célebre inventor y cofundador de Leap Motion, decidió en 2021 fundar un pequeño laboratorio de investigación independiente autofinanciado con un objetivo casi místico: "expandir los poderes imaginativos de la especie humana".',
      'A diferencia de las corporaciones que priorizaban el realismo documental o la precisión fotogramétrica, Holz y su equipo sintonizaron sus algoritmos hacia la poesía visual: pinceladas impresionistas, claroscuros renacentistas, texturas al óleo y atmósferas evocadoras.',
      'Operando desde un servidor público de Discord, Midjourney v1 a v6 se convirtió en el santuario predilecto de autores independientes, ilustradores y diseñadores editoriales para materializar portadas legendarias a partir de descripciones literarias minuciosas.'
    ],
    architecturalBreakthroughs: [
      'Difusión Latente con Afinación Artística: Un espacio latente guiado intencionalmente hacia principios clásicos de composición, regla de tercios y paletas armónicas.',
      'Control de Parámetros de Autor (--ar, --stylize, --chaos): Herramientas intuitivas que permiten a los escritores gobernar la atmósfera como un director de fotografía.',
      'Consistencia de Personajes (Creference): Algoritmos para mantener la identidad visual del protagonista a lo largo de un libro ilustrado completo.'
    ],
    impactOnAuthors: [
      'Diseño de Portadas de Éxito Editorial: Permite a los autores de autopublicación competir en vitrinas como Amazon con portadas de calidad de galería de arte.',
      'Construcción de Moodboards de Escritura: Visualizar rostros, vestimentas de época, fortalezas y paisajes antes de escribir el primer capítulo.',
      'Narrativa Infantil y Juvenil: Creación de cuentos ilustrados donde la prosa y la estampa visual respiran al unísono.'
    ],
    philosophicalVerdict: 'Midjourney demostró que la palabra es la madre de toda imagen: quien domina la pluma y la metáfora, domina el pincel del futuro.',
    keyMilestones: [
      { date: 'Febrero 2022', title: 'Fundación del Laboratorio', description: 'David Holz abre el servidor beta de Discord para explorar la síntesis visual.' },
      { date: 'Julio 2022', title: 'Midjourney v3', description: 'Salto cualitativo en la composición artística y el manejo de iluminación dramática.' },
      { date: 'Noviembre 2022', title: 'Midjourney v4', description: 'Reconocimiento global y premios internacionales de arte por su sensibilidad pictórica.' },
      { date: 'Diciembre 2023 - Presente', title: 'Midjourney v6 y Plataforma Web', description: 'Renderizado perfecto de texto en portadas y fotorrealismo cinematográfico.' }
    ]
  },
  {
    id: 'llama',
    name: 'Meta Llama',
    shortName: 'Llama',
    creator: 'Meta AI & FAIR (Yann LeCun)',
    birthYear: 2023,
    badge: 'Pesos Abiertos',
    tagline: 'El bastión científico de la investigación libre y la soberanía de datos',
    summary: 'Bajo el liderazgo académico de Yann LeCun, Meta desafió el cercamiento privativo entregando modelos de frontera para que cada universidad, autor y creador opere con total privacidad.',
    bannerImage: bannerMasterPen,
    logoImage: AI_OFFICIAL_LOGOS.llama,
    accentColor: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.4)',
    affiliateUrl: 'https://llama.meta.com',
    affiliateButtonText: 'Descargar Meta Llama (Comunidad Master Pen)',
    officialUrl: 'https://llama.meta.com',
    genesisStory: [
      'En febrero de 2023, Yann LeCun (galardonado con el Premio Turing) y el equipo de Fundamental AI Research (FAIR) de Meta tomaron una decisión que reconfiguraría el tablero tecnológico mundial: publicar LLaMA como un modelo de código abierto para investigadores.',
      'Aunque la primera versión se filtró inicialmente a la comunidad académica, Mark Zuckerberg y LeCun respaldaron una estrategia transparente para Llama 2 y Llama 3: licencias comerciales gratuitas para que cualquier persona en el planeta pudiera auditar, afinar y ejecutar la IA en sus propios servidores.',
      'Para los escritores celosos de sus derechos de autor y temerosos de que sus manuscritos sean usados para entrenar servidores corporativos, Llama se convirtió en el refugio sagrado: una IA de primer nivel que funciona 100% offline en una computadora personal.'
    ],
    architecturalBreakthroughs: [
      'Entrenamiento Hiperdenso en Tokens (Over-Training): Demostración de que entrenar modelos pequeños sobre 15 billones de tokens supera con creces a modelos gigantes subentrenados.',
      'Grouped-Query Attention (GQA): Reducción drástica del ancho de banda requerido durante la decodificación de texto largo.',
      'Soberanía Local (Ollama, LM Studio): Posibilidad de ejecutar inteligencia profunda en laptops sin conexión a internet y con cero telemetría.'
    ],
    impactOnAuthors: [
      'Privacidad Absoluta de Manuscritos Inéditos: El escritor redacta sus secretos de trama sin que ningún servidor externo registre una sola vocal.',
      'Afinación Personalizada (Fine-Tuning): Un autor puede alimentar a Llama con sus 10 novelas previas para crear un clon que imite con fidelidad milimétrica su estilo prosódico.',
      'Edición sin Conexión en Retiros Literarios: Escribir en una cabaña en la montaña con un asistente de alta retórica disponible sin señal telefónica.'
    ],
    philosophicalVerdict: 'Llama representa la creencia humanista de que el conocimiento fundacional no debe ser privatizado por unos pocos conglomerados, sino pertenecer a la humanidad entera.',
    keyMilestones: [
      { date: 'Febrero 2023', title: 'LLaMA 1', description: 'Publicación de los modelos de 7B a 65B que catalizaron la revolución open-source.' },
      { date: 'Julio 2023', title: 'Llama 2 con Licencia Comercial', description: 'Alianza con la industria para democratizar el uso productivo de la IA.' },
      { date: 'Abril 2024', title: 'Llama 3', description: 'Entrenado sobre 15T de tokens, rivalizando directamente con modelos privativos de élite.' },
      { date: 'Julio 2024 - Presente', title: 'Llama 3.1 405B', description: 'El modelo abierto más colosal de la historia humana, hito de la ciencia contemporánea.' }
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    shortName: 'Perplexity',
    creator: 'Aravind Srinivas, Denis Yarats, Johnny Ho & Andy Konwinski',
    birthYear: 2022,
    badge: 'Citas y Rigor',
    tagline: 'El fin del rumor digital y la apoteosis de la bibliografía verificada',
    summary: 'Nacido para erradicar las alucinaciones en la investigación, Perplexity sintetiza la web viva con notas al pie y fuentes primarias para autores de no ficción.',
    bannerImage: bannerGemini,
    logoImage: AI_OFFICIAL_LOGOS.perplexity,
    accentColor: '#2dd4bf',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    affiliateUrl: 'https://perplexity.ai',
    affiliateButtonText: 'Investigar con Perplexity Pro (Afiliado Master Pen)',
    officialUrl: 'https://perplexity.ai',
    genesisStory: [
      'En agosto de 2022, cuatro científicos provenientes de OpenAI, Meta AI y UC Berkeley —Aravind Srinivas, Denis Yarats, Johnny Ho y Andy Konwinski— coincidieron en un diagnóstico implacable: los buscadores tradicionales estaban infectados de publicidad y enlaces basura, mientras que los chatbots alucinaban citas inexistentes.',
      'Su visión fue combinar la destreza sintética de los grandes modelos de lenguaje con motores de recuperación en tiempo real (RAG) obsesionados con la verdad demostrable.',
      'Así forjaron Perplexity: un motor de respuestas conversacional que jamás hace una afirmación sin adjuntar un índice numérico hacia la fuente periodística, el artículo científico o el archivo histórico que la respalda, convirtiéndose en el aliado predilecto de ensayistas y biógrafos.'
    ],
    architecturalBreakthroughs: [
      'Búsqueda Conversacional Anclada (Grounded RAG): Cada sentencia se vincula dinámicamente con documentos indexados en vivo.',
      'Pro Search con Razonamiento Multi-Paso: La máquina realiza múltiples búsquedas consecutivas para resolver interrogantes con múltiples ramificaciones.',
      'Colecciones Temáticas y Espacios de Trabajo: Organización metódica de expedientes de investigación para libros de no ficción.'
    ],
    impactOnAuthors: [
      'Fact-Checking de Novelas Históricas: Verificar en segundos qué moneda circulaba en Venecia en 1542 o cómo era el clima en Waterloo en 1815.',
      'Bibliografía y Citas Académicas: Recopilar fuentes primarias para ensayos, biografías y tratados con rigor metodológico intachable.',
      'Monitoreo de Tendencias Editoriales: Analizar en tiempo real qué temáticas literarias están capturando el interés de los lectores globales.'
    ],
    philosophicalVerdict: 'Perplexity le devuelve al escritor la paz de saber que sus argumentos se levantan sobre la roca firme de la evidencia histórica y no sobre la arena del invento algorítmico.',
    keyMilestones: [
      { date: 'Agosto 2022', title: 'Fundación en San Francisco', description: 'Investigadores de OpenAI y Meta inician el proyecto de búsqueda honesta.' },
      { date: 'Diciembre 2022', title: 'Lanzamiento de Perplexity Ask', description: 'Primer buscador conversacional con citas directas al pie de página.' },
      { date: '2023', title: 'Copilot (Pro Search)', description: 'Capacidad de formular preguntas aclaratorias para profundizar en temas complejos.' },
      { date: '2024 - Presente', title: 'Páginas y Colecciones Editoriales', description: 'Herramientas para estructurar libros completos de divulgación documentada.' }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    shortName: 'Mistral',
    creator: 'Arthur Mensch, Guillaume Lample & Timothée Lacroix',
    birthYear: 2023,
    badge: 'Elegancia Europea',
    tagline: 'La alta costura parisina de la densidad paramétrica y la brevedad soberbia',
    summary: 'Fundada en el corazón de París por prodigios de DeepMind y Meta, Mistral demostró que un modelo ágil y bien templado puede derrotar a gigantes diez veces más pesados.',
    bannerImage: bannerChatGPT,
    logoImage: AI_OFFICIAL_LOGOS.mistral,
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    affiliateUrl: 'https://mistral.ai',
    affiliateButtonText: 'Explorar Mistral Le Chat (Afiliado Master Pen)',
    officialUrl: 'https://mistral.ai',
    genesisStory: [
      'En mayo de 2023, en los cafés del barrio latino de París, tres amigos y brillantes investigadores —Arthur Mensch (proveniente de Google DeepMind) y Guillaume Lample junto a Timothée Lacroix (ambos cerebros clave de FAIR en Meta)— decidieron erigir un bastión europeo de inteligencia artificial independiente.',
      'Su nombre evoca al "Mistral", el viento impetuoso y purificador del sur de Francia que despeja las tormentas y deja un cielo azul impecable. Con apenas seis semanas de existencia y sin un producto comercial, recaudaron la mayor ronda semilla europea de la historia: 105 millones de euros.',
      'En septiembre de 2023, liberaron Mistral 7B mediante un simple enlace torrent magnet. El modelo superó a sistemas del doble de tamaño, y meses después, Mixtral 8x7B reinventó la arquitectura de expertos dispersos, consolidando a Europa en la cúspide de la elegancia y velocidad de cómputo.'
    ],
    architecturalBreakthroughs: [
      'Sliding Window Attention (SWA): Mecanismo para procesar secuencias arbitrariamente largas con costo de memoria fijo de primer orden.',
      'Mixtral Sparse Mixture of Experts: Arquitectura donde solo 2 de 8 expertos se activan por token, ofreciendo velocidad de modelo pequeño con inteligencia de gigante.',
      'Compresión de Parámetros Extrema: Optimización para correr en hardware de consumo con máxima fidelidad gramatical multilingüe.'
    ],
    impactOnAuthors: [
      'Traducción Literaria con Sabor Auténtico: Destreza singular para traducir obras entre español, francés, inglés, alemán e italiano conservando modismos y tono poético.',
      'Generación de Diálogos Concisos: Evita la palabrería excesiva de modelos comerciales, entregando réplicas cortantes y afiladas como navajas.',
      'Edición Rápida en Lote: Capacidad de corregir estilo y ortotipografía en miles de páginas con latencia casi nula.'
    ],
    philosophicalVerdict: 'Mistral encarna la máxima cartesiana: la verdadera sofisticación no consiste en acumular grasa computacional, sino en la precisión geométrica de cada sinapsis.',
    keyMilestones: [
      { date: 'Mayo 2023', title: 'Nacimiento en París', description: 'Arthur Mensch y sus colegas fundan Mistral AI con respaldo de la élite científica europea.' },
      { date: 'Septiembre 2023', title: 'Mistral 7B', description: 'Publicación libre vía magnet link que sacudió los estándares de modelos livianos.' },
      { date: 'Diciembre 2023', title: 'Mixtral 8x7B', description: 'Consagración de la arquitectura Sparse MoE de alta eficiencia.' },
      { date: '2024 - Presente', title: 'Mistral Large & Le Chat', description: 'Competencia en la cúspide del razonamiento mundial y herramientas para autores.' }
    ]
  },
  {
    id: 'n8n',
    name: 'n8n - AI Agents & Workflows',
    shortName: 'n8n',
    creator: 'Jan Oberhauser (Berlín, Alemania)',
    birthYear: 2019,
    badge: 'Orquestador de Agentes',
    tagline: 'El telar visual donde la lógica humana enlaza modelos, datos y acciones reales',
    summary: 'Plataforma fair-code pionera en orquestación de flujos de trabajo e Inteligencia Artificial basada en nodos, permitiendo a autores y creadores crear agentes autónomos sin atarse a infraestructuras privativas.',
    bannerImage: bannerDeepSeek,
    logoImage: AI_OFFICIAL_LOGOS.n8n,
    accentColor: '#ea4b71',
    glowColor: 'rgba(234, 75, 113, 0.4)',
    affiliateUrl: 'https://n8n.io',
    affiliateButtonText: 'Iniciar en n8n Cloud (Afiliado Master Pen)',
    officialUrl: 'https://n8n.io',
    genesisStory: [
      'En 2019, en Berlín, el desarrollador Jan Oberhauser se enfrentaba a una frustración recurrente: las herramientas de automatización existentes eran de código cerrado, costosas por ejecución y carecían de la flexibilidad que requiere un artesano digital. Decidió escribir n8n («nodomation») como un proyecto de código abierto y fair-code.',
      'Cuando la revolución de los modelos LLM estalló entre 2022 y 2023, n8n contaba con una ventaja estructural descomunal: su arquitectura modular permitía insertar nodos de LangChain, memorias vectoriales (Pinecone, Qdrant), llamadas a Gemini, Claude u OpenAI, y herramientas ejecutables en cuestión de minutos.',
      'Hoy, n8n se ha erigido en la sala de máquinas indiscutible de los escritores modernos, consultores y empresas que desean conectar agentes de IA con sus manuscritos, hojas de cálculo, sistemas de correo y bases de datos soberanas con total control de privacidad.'
    ],
    architecturalBreakthroughs: [
      'Visual Canvas Multi-Agente: Construcción de pipelines cognitivos mediante diagramas de nodos intuitivos sin escribir cientos de líneas de código "pegamento".',
      'Integración Natively Fair-Code & Self-Hosted: Posibilidad de auto-hospedar n8n en servidores Docker propios sin costos por tarea ni filtraciones de manuscritos.',
      'LangChain & Vector Stores Nativos: Conexión directa con agentes de razonamiento capaces de consultar libros enteros y disparar acciones automáticas en el mundo real.'
    ],
    impactOnAuthors: [
      'Canales Automatizados de Investigación: Nodos que recopilan automáticamente artículos, noticias históricas y referencias bibliográficas en Google Drive.',
      'Agentes de Publicación Automática: Automatización del envío de boletines literarios, actualizaciones de capítulos y distribución en plataformas de lectores.',
      'Sincronización de Catálogos Editoriales: Gestión en tiempo real del inventario de libros impresos, pedidos de autor y facturación internacional.'
    ],
    philosophicalVerdict: 'n8n demuestra que el verdadero poder de la inteligencia artificial no radica en el aislamiento del chat, sino en su capacidad de tejer puentes invisibles entre el intelecto y la acción.',
    keyMilestones: [
      { date: 'Junio 2019', title: 'Primera versión de n8n', description: 'Jan Oberhauser publica en GitHub el primer motor visual de automatización basada en nodos.' },
      { date: '2021', title: 'Lanzamiento de n8n Cloud', description: 'Apertura de la plataforma gestionada para creadores y equipos de alto impacto.' },
      { date: '2023 - 2024', title: 'Revolución AI Nodes & LangChain', description: 'Incorporación de agentes autónomos, memoria conversacional y bases de datos vectoriales.' },
      { date: '2025 - Presente', title: 'Ecosistema de Agentes Soberanos', description: 'Estándar mundial para autores que operan sistemas de IA sin intermediarios privativos.' }
    ]
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    shortName: 'Copilot',
    creator: 'Microsoft & OpenAI (Satya Nadella)',
    birthYear: 2023,
    badge: 'Sinergia de Oficina',
    tagline: 'El copiloto ubicuo integrado en el sistema operativo y el software editorial',
    summary: 'Nacido de la colosal alianza estratégica entre Microsoft y OpenAI, Copilot fusionó los modelos GPT con el Microsoft Graph y la suite Office para transformar el procesamiento de palabras de miles de millones de personas.',
    bannerImage: bannerChatGPT,
    logoImage: AI_OFFICIAL_LOGOS.copilot,
    accentColor: '#0078d4',
    glowColor: 'rgba(0, 120, 212, 0.4)',
    affiliateUrl: 'https://copilot.microsoft.com',
    affiliateButtonText: 'Suscribirse a Copilot Pro (Afiliado Master Pen)',
    officialUrl: 'https://copilot.microsoft.com',
    genesisStory: [
      'En febrero de 2023, Satya Nadella subió al escenario en Redmond para proclamar "un nuevo día en las búsquedas y la computación". Tras invertir más de 13 mil millones de dólares en OpenAI, Microsoft concibió un proyecto que integraría la inteligencia artificial directamente en los cimientos de Windows, Word, Excel, PowerPoint y GitHub.',
      'Bajo la arquitectura "Prometheus", Copilot no solo invoca un modelo conversacional, sino que analiza el contexto íntimo de los archivos del autor: sus notas previas, correos electrónicos, diapositivas y bibliografías abiertas en su escritorio.',
      'Para el escritor que vive y redacta en Microsoft Word, la presencia de Copilot supuso la muerte definitiva de la pantalla en blanco: un asistente que comprende el tono institucional, reescribe párrafos con precisión quirúrgica y resume actas de reunión al vuelo.'
    ],
    architecturalBreakthroughs: [
      'Modelo Orquestador Prometheus: Capacidad de combinar la indexación en tiempo real de Bing con la potencia semántica de GPT-4o para verificar hechos.',
      'Integración Nativa en el Lienzo Editorial: Copilot vive dentro de los márgenes de Word, analizando la estructura sintáctica sin obligar al autor a salir a un navegador.',
      'Microsoft Graph Semántico: Comprensión relacional de todos los borradores, correos de lectores y contratos editoriales del creador.'
    ],
    impactOnAuthors: [
      'Redacción y Pulido en el Procesador de Textos: Generar borradores de capítulos o ajustar el registro formal con un solo comando lateral en Word.',
      'Diseño Automático de Presentaciones: Transformar un ensayo o capítulo de libro en una secuencia de diapositivas elegantes para conferencias.',
      'Análisis de Contratos y Acuerdos de Publicación: Resumen claro de cláusulas complejas de regalías, cesión de derechos y fechas límite.'
    ],
    philosophicalVerdict: 'Copilot consolidó la transición de la máquina de escribir mecánica al entorno de co-creación inteligente: el autor sigue siendo el capitán indiscutible; el software sostiene el compás.',
    keyMilestones: [
      { date: 'Febrero 2023', title: 'Anuncio de Bing Chat con Prometheus', description: 'La búsqueda web conversacional desafía por primera vez el monopolio tradicional.' },
      { date: 'Marzo 2023', title: 'Presentación de Microsoft 365 Copilot', description: 'Integración en Word, Excel, PowerPoint y Outlook.' },
      { date: 'Noviembre 2023', title: 'Disponibilidad General y Rebranding', description: 'Unificación de todas las experiencias de IA bajo la marca insignia Microsoft Copilot.' },
      { date: '2024 - Presente', title: 'Copilot Studio & PC Copilot+', description: 'Inferencia local en chips NPU de silicio y creación de copilotos personalizados para autores.' }
    ]
  },
  {
    id: 'grok',
    name: 'xAI Grok',
    shortName: 'Grok',
    creator: 'xAI (Elon Musk & equipo científico fundacional)',
    birthYear: 2023,
    badge: 'Audacia en Tiempo Real',
    tagline: 'El buscador de la verdad cósmica sin filtros y en sincronía con el pulso vivo de X',
    summary: 'Inspirado en la Guía del Autoestopista Galáctico, Grok fue forjado en tiempo récord en el supercluster Colossus de Memphis para razonar con ingenio, sarcasmo fino y acceso al flujo de datos en tiempo real de X.',
    bannerImage: bannerClaude,
    logoImage: AI_OFFICIAL_LOGOS.grok,
    accentColor: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.4)',
    affiliateUrl: 'https://x.ai',
    affiliateButtonText: 'Acceder a Grok en X Premium (Afiliado Master Pen)',
    officialUrl: 'https://x.ai',
    genesisStory: [
      'En julio de 2023, Elon Musk anunció la creación de xAI, reuniendo a investigadores provenientes de DeepMind, Google Research, OpenAI y Microsoft con una misión provocadora: "comprender la verdadera naturaleza del universo". Su primer producto, Grok, fue bautizado en honor al concepto acuñado por Robert A. Heinlein en su obra clásica «Forastero en tierra extraña» (comprender algo de forma tan profunda que te vuelves uno con ello).',
      'Entrenado en un tiempo récord de apenas cuatro meses, Grok fue dotado de dos rasgos distintivos: acceso en tiempo real a los millones de publicaciones y noticias de última hora en la red social X, y una disposición humorística, mordaz y desinhibida, diseñada para evitar la timidez corporativa de otros asistentes.',
      'Con la construcción en 2024 del cluster Colossus en Memphis (equipado con 100,000 GPUs NVIDIA H100), xAI demostró una velocidad de entrenamiento sin precedentes en la historia de la computación, posicionando a Grok-2 y Grok-3 en la vanguardia del razonamiento científico, la sátira literaria y la investigación periodística sin concesiones.'
    ],
    architecturalBreakthroughs: [
      'Supercluster Colossus (100k+ H100): El mayor centro de datos de cómputo unificado del planeta, ensamblado y operativo en tiempo récord mundial.',
      'Sincronización en Tiempo Real con X: Ingesta continua de acontecimientos globales, debates culturales y declaraciones públicas en el segundo exacto en que suceden.',
      'Generación Visual sin Censura Puritana (Aurora/FLUX): Síntesis gráfica osada para portadas de novelas satíricas, distopías políticas y ciencia ficción de choque.'
    ],
    impactOnAuthors: [
      'Novelas de Ficción Política y Sátira Contemporánea: Ideal para autores que buscan diálogos irreverentes, personajes cínicos y comentarios mordaces sobre la sociedad moderna.',
      'Monitoreo de Debates Culturales en Vivo: Identificar qué temas, polémicas o tendencias están capturando la atención del público lector al instante.',
      'Creación de Diálogos con Personalidad Inquebrantable: Salir del molde complaciente y predecible de los chatbots convencionales para moldear antihéroes memorables.'
    ],
    philosophicalVerdict: 'Grok nos recuerda que la literatura y el intelecto no deben temerle a la ironía ni al debate incómodo: la verdadera lucidez nace de confrontar la realidad con valentía y agudeza.',
    keyMilestones: [
      { date: 'Julio 2023', title: 'Fundación de xAI', description: 'Elon Musk funda el laboratorio en el área de la bahía con un equipo de élite en razonamiento.' },
      { date: 'Noviembre 2023', title: 'Lanzamiento de Grok-1', description: 'Presentación del modelo con acceso en tiempo real a la red X.' },
      { date: 'Agosto 2024', title: 'Grok-2 y Generación Visual', description: 'Salto cuántico en razonamiento lógico y renderizado de imágenes de alto impacto.' },
      { date: '2025 - Presente', title: 'Era Colossus & Grok-3', description: 'Potencia masiva para investigación de frontera y diálogo literario sin censura.' }
    ]
  }
];

const AFFILIATE_STORAGE_KEY = 'mpt_ai_affiliate_settings';

export interface AIAffiliateSetting {
  id: string;
  affiliateUrl: string;
  affiliateButtonText: string;
  enabled: boolean;
}

export function getStoredAIAffiliates(): Record<string, AIAffiliateSetting> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(AFFILIATE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[AIAffiliates] Error reading stored affiliates:', e);
  }
  return {};
}

export function saveStoredAIAffiliate(id: string, setting: Partial<AIAffiliateSetting>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredAIAffiliates();
    const existing = current[id] || {
      id,
      affiliateUrl: AI_CHRONICLES.find(c => c.id === id)?.affiliateUrl || '',
      affiliateButtonText: AI_CHRONICLES.find(c => c.id === id)?.affiliateButtonText || '',
      enabled: true
    };
    current[id] = { ...existing, ...setting };
    localStorage.setItem(AFFILIATE_STORAGE_KEY, JSON.stringify(current));
    
    // Update in-memory reference
    const chronicle = AI_CHRONICLES.find(c => c.id === id);
    if (chronicle) {
      if (setting.affiliateUrl !== undefined) chronicle.affiliateUrl = setting.affiliateUrl;
      if (setting.affiliateButtonText !== undefined) chronicle.affiliateButtonText = setting.affiliateButtonText;
    }
    
    window.dispatchEvent(new CustomEvent('mp-ai-affiliates-updated', { detail: current }));
  } catch (e) {
    console.warn('[AIAffiliates] Error saving affiliate setting:', e);
  }
}

export function getResolvedAIChronicles(): AIChronicle[] {
  const stored = getStoredAIAffiliates();
  return AI_CHRONICLES.map(chronicle => {
    const override = stored[chronicle.id];
    if (override) {
      return {
        ...chronicle,
        affiliateUrl: override.affiliateUrl !== undefined ? override.affiliateUrl : chronicle.affiliateUrl,
        affiliateButtonText: override.affiliateButtonText !== undefined ? override.affiliateButtonText : chronicle.affiliateButtonText
      };
    }
    return chronicle;
  });
}

// Hydrate in-memory on module evaluation if in browser
if (typeof window !== 'undefined') {
  try {
    const stored = getStoredAIAffiliates();
    AI_CHRONICLES.forEach(c => {
      if (stored[c.id]) {
        if (stored[c.id].affiliateUrl !== undefined) c.affiliateUrl = stored[c.id].affiliateUrl;
        if (stored[c.id].affiliateButtonText !== undefined) c.affiliateButtonText = stored[c.id].affiliateButtonText;
      }
    });
  } catch (_) {}
}


