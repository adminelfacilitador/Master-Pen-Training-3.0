// Master Pen Training - Curso Oficial: "Quiero ser Escritor"
// 5 Bloques Curriculares, 50 Diapositivas Maestras de Alta Densidad, Narraciones Humanas de Michael Pen y Reactivos Psicométricos

import { AcademicBlock, PsychometricQuestion, MediaResource } from '../types';

export interface CourseSlide {
  id: string;
  slideNumber: number;
  blockNumber: number;
  title: string;
  subtitle: string;
  expandedText: string;
  michaelPenNarration: string;
  keyAxiom: string;
  writingExercise: string;
  imageUrl: string;
  estimatedMinutes: number;
}

export interface CourseBlockData {
  id: string;
  blockNumber: number;
  title: string;
  subtitle: string;
  description: string;
  congratulationMessage: string;
  slides: CourseSlide[];
  questionBank: PsychometricQuestion[];
}

export const QUIERO_SER_ESCRITOR_BLOCKS: CourseBlockData[] = [
  // =========================================================================
  // BLOQUE 1: LOS ORÍGENES DE LA ESCRITURA
  // =========================================================================
  {
    id: 'block_01',
    blockNumber: 1,
    title: 'Bloque I: Los Orígenes de la Escritura',
    subtitle: 'Historia, propósito y legado eterno de la palabra',
    description: 'Comprende el nacimiento de la escritura humana hace más de cinco milenios, desde la arcilla cuneiforme sumeria hasta la democratización de la imprenta y la autopublicación digital.',
    congratulationMessage: '¡Fantástico! Completaste el Bloque 1. Ahora conoces los cimientos milenarios de la escritura humana. ¡Felicitaciones! Has dado el primer gran paso hacia tu destino como autor.',
    slides: [
      {
        id: 'b1_s1',
        slideNumber: 1,
        blockNumber: 1,
        title: 'Bienvenido al Camino de la Pluma',
        subtitle: 'El despertar de tu identidad como autor publicado',
        expandedText: 'Iniciar este curso no es una simple decisión académica; es un pacto de honor con tu propia voz interior. "Quiero ser Escritor" ha sido edificado como una catedral formativa donde cada concepto, desde la primera pulsión creativa hasta el manuscrito impreso, se desglosa con rigor profesional. A lo largo de la historia, quienes dejaron huella en el mundo no fueron seres dotados de una magia inalcanzable, sino hombres y mujeres que aprendieron a disciplinar su pensamiento, dominar la estructura del lenguaje y perseverar ante la página en blanco. En este primer bloque desentrañaremos por qué la humanidad necesitó inventar la escritura, cómo los primeros signos transformaron la civilización y de qué manera tú estás conectado con esa misma estirpe de creadores.',
        michaelPenNarration: 'Estimado discípulo, le doy la más cordial bienvenida a nuestra academia. Soy Michael Pen, su anfitrión y mentor literario. Es para mí un honor acompañarle en este noble viaje. Permítame asegurarle que dentro de usted habita una voz singular que el mundo necesita escuchar. Avancemos con paso firme y serenidad.',
        keyAxiom: 'El escritor no nace cuando publica su libro; nace en el instante en que decide que su palabra merece ser inmortalizada.',
        writingExercise: 'Tome una libreta física y escriba en una sola frase: "¿Cuál es la verdad más profunda que deseo compartir con mis futuros lectores?".',
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.5
      },
      {
        id: 'b1_s2',
        slideNumber: 2,
        blockNumber: 1,
        title: '¿Por Qué Escribimos?',
        subtitle: 'La necesidad antropológica de trascender el tiempo',
        expandedText: 'Hace más de 5,000 años, en los valles fértiles entre el Tigris y el Éufrates, la mente humana experimentó una mutación trascendental: la memoria oral ya no era suficiente. Escribir surgió inicialmente como una herramienta práctica de registro y comercio, pero rápidamente se convirtió en el vehículo supremo de la preservación espiritual, las leyes y el arte poético. Sumerios, egipcios y mayas desarrollaron de forma independiente sistemas simbólicos complejos porque comprendieron que la voz se desvanece con el viento, mientras que el signo grabado permanece inalterable a través de las eras. Cuando escribes hoy, estás empleando la tecnología más revolucionaria jamás ideada por nuestra especie.',
        michaelPenNarration: 'Escribir es uno de los dones más extraordinarios concedidos al ser humano. Nos permite dialogar con personas que aún no han nacido y consolar a corazones que jamás estrecharemos en persona. Usted también lleva esa capacidad grabada en su intelecto.',
        keyAxiom: 'La palabra hablada viaja a la velocidad del sonido; la palabra escrita viaja a través de los milenios.',
        writingExercise: 'Identifique tres momentos de su vida donde una carta, un libro o un mensaje escrito cambiaron radicalmente el rumbo de sus decisiones.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.0
      },
      {
        id: 'b1_s3',
        slideNumber: 3,
        blockNumber: 1,
        title: 'Los Primeros Textos de la Humanidad',
        subtitle: 'De las tablillas cuneiformes al Código de Hammurabi',
        expandedText: 'Hacia el 3200 a.C., en Uruk, escribas anónimos presionaron cañas afiladas sobre arcilla fresca, creando la escritura cuneiforme. Simultáneamente, a orillas del Nilo, los jeroglíficos egipcios combinaban fonética y riqueza pictórica sobre rollos de papiro. Con el Código de Hammurabi (1750 a.C.), la ley escrita sustituyó la arbitrariedad del gobernante de turno por la fijeza del texto público. La Epopeya de Gilgamesh narró la angustia de un rey ante la muerte y su búsqueda de la inmortalidad, demostrando que los anhelos humanos no han cambiado un ápice en cinco mil años. El texto escrito fue, desde su origen, el antídoto contra el olvido.',
        michaelPenNarration: 'Imagine que hace cinco milenios alguien tomó una caña de junco y decidió no dejar morir su pensamiento. Hoy, cada vez que usted abre un cuaderno o teclea en su computadora, continúa con devoción esa misma tradición sagrada.',
        keyAxiom: 'El texto escrito es el único monumento que no puede ser destruido por la erosión de las tormentas.',
        writingExercise: 'Redacte un breve párrafo de 50 palabras describiendo un dilema universal como si fuera a ser leído dentro de mil años.',
        imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.2
      },
      {
        id: 'b1_s4',
        slideNumber: 4,
        blockNumber: 1,
        title: 'La Biblia: El Libro Más Leído de la Historia',
        subtitle: 'El fenómeno editorial e influencia literaria sin precedentes',
        expandedText: 'Compuesta a lo largo de más de 1,500 años por más de 40 autores de diversos orígenes —desde reyes y estadistas hasta pescadores y filósofos—, la Biblia constituye el fenómeno literario más prodigioso de la civilización. Traducida a más de 3,500 idiomas y dialectos, y con miles de millones de ejemplares distribuidos, ha forjado la ética, el derecho, el arte renacentista y la sintaxis de las lenguas modernas. Desde la sublime poesía del Génesis y los Salmos hasta la dialéctica epistolar paulina, su estructura enseña que un mensaje profundamente arraigado en la verdad de la condición humana trasciende todas las barreras temporales, culturales y políticas.',
        michaelPenNarration: 'La Biblia es un testimonio extraordinario del poder transformador de la escritura. Generaciones enteras de amanuenses custodiaron cada consonante con veneración para que hoy podamos leerla con nitidez. Es la prueba viva de que un libro puede moldear la historia.',
        keyAxiom: 'La grandeza de una obra no reside en el lujo de sus páginas, sino en el peso moral y espiritual de su mensaje.',
        writingExercise: 'Analice la cadencia poética de un proverbio clásico y note cómo la simetría de las palabras intensifica su autoridad.',
        imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.5
      },
      {
        id: 'b1_s5',
        slideNumber: 5,
        blockNumber: 1,
        title: 'Obras que Cambiaron el Rumbo del Mundo',
        subtitle: 'La inmortalidad de los grandes clásicos universales',
        expandedText: 'La Ilíada y la Odisea de Homero cantaron la cólera de Aquiles y la astucia de Ulises, forjando el alma de Grecia. Siglos más tarde, Miguel de Cervantes Saavedra, herido en Lepanto y preso en Argel, compuso en El Quijote la primera novela moderna, enseñándonos que la cordura sin ideales es una forma de muerte. En el siglo XX, Gabriel García Márquez abrió las puertas de Macondo en Cien Años de Soledad, demostrando que lo fantástico es la forma más honesta de retratar nuestra realidad. Cada una de estas cumbres literarias comenzó con una duda y una primera palabra temblorosa en la soledad de una mesa de trabajo.',
        michaelPenNarration: 'Cada uno de esos ilustres maestros fue, alguna vez, alguien que sintió miedo ante la cuartilla virgen y aun así decidió escribir su primera línea. Usted se encuentra exactamente en ese mismo umbral de grandeza.',
        keyAxiom: 'Un clásico no es un libro que encierra todas las respuestas, sino una obra que nunca termina de formular sus preguntas.',
        writingExercise: 'Elija su libro favorito de todos los tiempos y escriba en tres líneas qué emoción perdurable le regaló.',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.0
      },
      {
        id: 'b1_s6',
        slideNumber: 6,
        blockNumber: 1,
        title: 'El Renacimiento y la Imprenta de Gutenberg',
        subtitle: 'La democratización definitiva del pensamiento y la ciencia',
        expandedText: 'Hasta mediados del siglo XV, un solo ejemplar de un libro requería meses o años de labor minuciosa por parte de monjes copistas en los scriptoria medievales, convirtiendo las bibliotecas en tesoros inaccesibles para el pueblo llano. Hacia 1440, en Maguncia, Johannes Gutenberg combinó caracteres móviles de plomo, tinta oleosa y una prensa de uvas adaptada, pariendo la imprenta moderna. En pocas décadas, millones de volúmenes circularon por Europa, catalizando el Renacimiento, la Revolución Científica y la Ilustración. Gutenberg no solo multiplicó las letras; le arrebató el monopolio del saber a los poderosos para entregárselo a la humanidad.',
        michaelPenNarration: 'Gracias a Gutenberg, las ideas de mentes audaces pudieron cruzar océanos y llegar al hogar de los hombres sencillos. Recuerde siempre que la tecnología jamás ha sido enemiga del escritor; es su más poderosa aliada cuando se usa con maestría.',
        keyAxiom: 'Cuando el conocimiento se multiplica en copias idénticas, la tiranía de la ignorancia comienza su retirada.',
        writingExercise: 'Reflexione sobre la bendición de tener hoy acceso a publicar con un clic y escriba cómo honrará ese privilegio.',
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.3
      },
      {
        id: 'b1_s7',
        slideNumber: 7,
        blockNumber: 1,
        title: 'Literatura Universal para Todo Lector',
        subtitle: 'La diversidad inagotable de miradas, épocas y géneros',
        expandedText: 'La literatura no es un club exclusivo de eruditos encumbrados; es un banquete pantagruélico donde caben todos los paladares. Desde los enigmas fantásticos de Las Mil y Una Noches narrados por Scheherezade para aplacar la muerte, hasta las travesías científicas y submarinas de Julio Verne, los relatos góticos de Edgar Allan Poe o las parábolas morales de Tolstói, cada época ha cultivado su propio néctar. Leer a los grandes maestros con ojos de aprendiz es el entrenamiento insustituible de todo autor novel. Quien no lee con avidez es como un músico que pretende componer sin haber escuchado jamás una sinfonía.',
        michaelPenNarration: 'Leer con atención a los grandes arquitectos del idioma es el más refinado gimnasio intelectual que existe. Le aconsejo vivamente dedicar al menos treinta minutos al día a la lectura de clásicos.',
        keyAxiom: 'Dime qué lees con devoción y te diré qué tipo de prosa brotará de tu pluma.',
        writingExercise: 'Haga una lista de tres autores que le gustaría tener como maestros imaginarios sentados a su mesa de redacción.',
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.0
      },
      {
        id: 'b1_s8',
        slideNumber: 8,
        blockNumber: 1,
        title: 'El Valor de la Escritura en la Era Digital',
        subtitle: 'La caída de las barreras y el poder del autor independiente',
        expandedText: 'Durante siglos, publicar dependía de la venia de comités editoriales herméticos que a menudo rechazaban obras maestras por no encajar en sus fórmulas mercantiles. Hoy, plataformas globales como Amazon KDP, Smashwords, Apple Books y el ecosistema Master Pen han dinamitado las aduanas editoriales. Un autor desde su estudio puede diseñar su libro, fijar su precio de venta y ponerlo al alcance de lectores en Tokio, Madrid, Buenos Aires o Nueva York en cuestión de horas, conservando hasta el 70% de las regalías. La autopublicación ya no es un refugio secundario; es la vía más noble y directa de soberanía artística.',
        michaelPenNarration: 'Vivimos, sin exageración alguna, en la era dorada del autor independiente. Las murallas feudales de las antiguas editoriales se han desmoronado. Su momento histórico es ahora.',
        keyAxiom: 'El éxito de un libro ya no depende del visto bueno de un burócrata, sino de la autenticidad con que toques el corazón de tu lector.',
        writingExercise: 'Investigue tres autores célebres contemporáneos que iniciaron su carrera triunfal mediante la autopublicación digital.',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.2
      },
      {
        id: 'b1_s9',
        slideNumber: 9,
        blockNumber: 1,
        title: 'La Escritura como Legado Personal Inmutable',
        subtitle: 'Lo que construyes hoy perdurará cuando tu voz descanse',
        expandedText: 'Un libro es mucho más que un producto mercantil o un archivo digital formateado; es una extensión viva de tu alma, un testamento intelectual y la huella indeleble de tu paso por este mundo. Los bienes materiales se disipan, las posesiones cambian de manos y las opiniones cotidianas son olvidadas con la caída de la noche, pero un libro bien concebido permanece en estanterías familiares y bibliotecas digitales para siempre. Cuando escribes con devoción, estás pensando en aquellos que leerán tus reflexiones cuando tú ya no estés para defenderlas. Esa es la mayor responsabilidad y la más alta gloria del escritor.',
        michaelPenNarration: 'Permítame formularle una pregunta trascendental: ¿Qué desea usted que las futuras generaciones recuerden de su paso por la vida? Su libro puede ser, con certeza, la respuesta más elocuente y hermosa.',
        keyAxiom: 'Escribir con seriedad es esculpir nuestro propio epitafio con tinta viva.',
        writingExercise: 'Redacte una dedicatoria imaginaria a un lector de dentro de cincuenta años que encuentre su libro por casualidad.',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.1
      },
      {
        id: 'b1_s10',
        slideNumber: 10,
        blockNumber: 1,
        title: 'Reflexión Final del Bloque 1',
        subtitle: 'El puente tendido hacia la maestría estructural',
        expandedText: 'Has recorrido el río caudaloso de la historia: desde las marcas en barro de Mesopotamia hasta la red digital de nuestros días. Ahora sabes que el anhelo de plasmar palabras no es un capricho pasajero, sino una vocación milenaria que te precede y te ennoblece. Estás listo para adentrarte en el corazón del artefacto literario: su anatomía, sus secciones vitales y las reglas profesionales que separan a un borrador confuso de una obra de arte digna de ser publicada. Prepárate para el Bloque 2, donde examinaremos pieza por pieza la arquitectura interna de un libro profesional.',
        michaelPenNarration: '¡Felicitaciones por completar con dedicación este primer bloque! Ha dado usted el paso fundacional más importante. Descanse un instante la mirada, beba un sorbo de agua y continuemos juntos con renovado entusiasmo.',
        keyAxiom: 'El edificio de la gran literatura requiere cimientos hondos; hoy has colocado la primera piedra con firmeza.',
        writingExercise: 'Escriba un breve compromiso de tres líneas reafirmando su decisión inquebrantable de culminar su libro.',
        imageUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1200&h=675&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.8
      }
    ],
    questionBank: [
      {
        id: 'q_b1_01',
        blockId: 'block_01',
        question: '¿Hace cuántos años aproximadamente surgió la escritura humana como sistema simbólico de registro y comunicación?',
        options: {
          A: 'Aproximadamente 1,000 años, coincidiendo con la imprenta europea.',
          B: 'Más de 5,000 años, con desarrollos en Mesopotamia, Egipto y Mesoamérica.',
          C: 'Menos de 2,000 años, tras la caída del Imperio Romano.',
          D: '10,000 años, durante las pinturas rupestres del Paleolítico.'
        },
        correctAnswer: 'B',
        explanation: 'La escritura cuneiforme y jeroglífica floreció hacia el 3200 a.C. (hace más de 5,000 años), transformando la organización civilizatoria.',
        difficulty: 'medium',
        psychometricAxis: 'retention'
      },
      {
        id: 'q_b1_02',
        blockId: 'block_01',
        question: '¿Qué civilización inventó la escritura cuneiforme sobre tablillas de arcilla hacia el 3200 a.C.?',
        options: {
          A: 'Los sumerios en Mesopotamia.',
          B: 'Los fenicios en el Mediterráneo.',
          C: 'Los griegos en el Peloponeso.',
          D: 'Los visigodos en Hispania.'
        },
        correctAnswer: 'A',
        explanation: 'Los sumerios en la antigua Mesopotamia fueron pioneros en usar incisiones cuneiformes sobre arcilla para registrar leyes, comercio y mitos.',
        difficulty: 'medium',
        psychometricAxis: 'analysis'
      },
      {
        id: 'q_b1_03',
        blockId: 'block_01',
        question: '¿Por qué la Biblia es considerada el fenómeno editorial y literario más influyente de la historia humana?',
        options: {
          A: 'Porque fue el único libro publicado en el siglo XV.',
          B: 'Porque fue escrita por un solo monarca en un breve lapso de tres meses.',
          C: 'Por su composición a lo largo de 1,500 años por más de 40 autores y su traducción a miles de lenguas.',
          D: 'Porque carece de metáforas poéticas y relatos históricos.'
        },
        correctAnswer: 'C',
        explanation: 'Su génesis colectiva a lo largo de quince siglos y su difusión global la convierten en el texto más influyente en la ética y sintaxis universal.',
        difficulty: 'medium',
        psychometricAxis: 'synthesis'
      },
      {
        id: 'q_b1_04',
        blockId: 'block_01',
        question: '¿Qué hito tecnológico introdujo Johannes Gutenberg hacia 1440 que democratizó el conocimiento?',
        options: {
          A: 'El pergamino de cuero curtido.',
          B: 'La imprenta de tipos móviles metálicos con prensa adaptada.',
          C: 'El papel de arroz oriental.',
          D: 'El sistema de encuadernación rústica cosida.'
        },
        correctAnswer: 'B',
        explanation: 'Gutenberg combinó tipos móviles de aleación metálica y prensa oleosa, posibilitando la producción masiva de libros a precios asequibles.',
        difficulty: 'medium',
        psychometricAxis: 'application'
      },
      {
        id: 'q_b1_05',
        blockId: 'block_01',
        question: '¿Cuál es el beneficio primordial de la autopublicación digital contemporánea para el autor independiente?',
        options: {
          A: 'La obligación de ceder todos los derechos a un comité mercantil.',
          B: 'La imposibilidad de vender ejemplares fuera del país de origen.',
          C: 'La soberanía creativa, distribución global en días y control de hasta el 70% de regalías.',
          D: 'La exclusividad de publicación en formato sonoro únicamente.'
        },
        correctAnswer: 'C',
        explanation: 'Las plataformas digitales eliminaron los filtros burocráticos, otorgando alcance internacional inmediato y retención de derechos al autor.',
        difficulty: 'medium',
        psychometricAxis: 'retention'
      }
    ]
  },

  // =========================================================================
  // BLOQUE 2: ANATOMÍA DE UN LIBRO
  // =========================================================================
  {
    id: 'block_02',
    blockNumber: 2,
    title: 'Bloque II: Anatomía de un Libro',
    subtitle: 'Partes esenciales, opcionales y su propósito editorial',
    description: 'Aprende a estructurar cada sección de una obra profesional: desde la portada y la página de derechos hasta el prólogo, dedicatoria, índice analítico y epílogo.',
    congratulationMessage: '¡Fantástico! Ya dominas la estructura de un libro. ¡Felicitaciones! Ahora sabes exactamente qué partes incluir y cuándo. Estás a un paso más de ser autor publicado.',
    slides: [
      {
        id: 'b2_s1',
        slideNumber: 1,
        blockNumber: 2,
        title: '¿Qué es Realmente un Libro?',
        subtitle: 'El artefacto arquitectónico que organiza la mente del lector',
        expandedText: 'Un libro profesional no es un simple montón de hojas engrapadas ni un archivo de texto corrido. Es un artefacto arquitectónico meticulosamente estructurado que guía al lector a través de una experiencia inmersiva. Conocer cada una de sus partes —desde las páginas preliminares hasta los apéndices finales— te permite tomar decisiones editoriales informadas desde el primer borrador. Un libro que respeta las convenciones formales del mundo editorial transmite autoridad y confianza mucho antes de que el lector haya digerido el primer párrafo. En este bloque desglosaremos la anatomía exacta de una obra bien nacida.',
        michaelPenNarration: 'Un libro bien estructurado comunica prestancia y rigor editorial antes de que el lector lea una sola palabra. Quien domina la anatomía del libro demuestra respeto por el tiempo y la inteligencia de su público.',
        keyAxiom: 'El formato no es un adorno superfluo; es el canal que permite al mensaje fluir sin fricción cognitiva.',
        writingExercise: 'Tome un libro de su biblioteca y analice el orden exacto de sus primeras diez páginas antes del capítulo uno.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.6
      },
      {
        id: 'b2_s2',
        slideNumber: 2,
        blockNumber: 2,
        title: 'La Portada: La Primera y Crucial Impresión',
        subtitle: 'Título magnético, subtítulo clarificador e impacto visual',
        expandedText: 'Suele decirse con ingenuidad que no se debe juzgar un libro por su portada, pero en el mercado editorial moderno todos los lectores lo hacen en menos de tres segundos. La portada es la cara visible de tu alma creativa y tu principal herramienta de seducción comercial. Debe constar de cuatro elementos armónicos: un título memorable, un subtítulo que prometa un beneficio o clarifique el género, el nombre o seudónimo del autor con tipografía legible, y una ilustración o fotografía de calidad superior. Una portada descuidada destruirá el mejor de los textos; una portada magistral abrirá las puertas del éxito.',
        michaelPenNarration: 'Dicen que no se debe juzgar un libro por su cubierta... mas la naturaleza humana es visual por instinto. Invertir tiempo y esmero en una portada pulcra es un deber ineludible de todo escritor serio.',
        keyAxiom: 'La portada promete la experiencia; el texto interior debe cumplirla con creces.',
        writingExercise: 'Escriba tres variantes de título para su futuro libro: uno poético, uno directo y uno provocador.',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.0
      },
      {
        id: 'b2_s3',
        slideNumber: 2,
        blockNumber: 2,
        title: 'Página de Derechos (Copyright)',
        subtitle: 'La protección legal de tu propiedad intelectual',
        expandedText: 'Ubicada tradicionalmente en el reverso de la portada o página de créditos (página par), la página de derechos es el escudo jurídico de tu obra. Contiene el año de publicación, el nombre del titular de los derechos de autor, el código ISBN (International Standard Book Number), la mención obligatoria de "Todos los derechos reservados", los créditos del diseñador de portada y maquetador, y la advertencia legal contra reproducciones no autorizadas. Aunque la protección de autor nace con la mera creación de la obra, explicitar estos datos formaliza tu estatus como profesional ante cualquier distribuidor internacional.',
        michaelPenNarration: 'Proteger su obra intelectual es un acto elemental de respeto hacia su propio esfuerzo creativo. Jamás omita la página de derechos legales en ninguna de sus publicaciones.',
        keyAxiom: 'Quien no cuida la titularidad de su obra renuncia al derecho de cosechar el fruto de sus desvelos.',
        writingExercise: 'Redacte el borrador de su página legal incluyendo: "© 2026 [Su Nombre]. Todos los derechos reservados".',
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.8
      },
      {
        id: 'b2_s4',
        slideNumber: 4,
        blockNumber: 2,
        title: 'La Dedicatoria y el Epígrafe',
        subtitle: 'El tributo afectivo y la clave tonal secreta',
        expandedText: 'La dedicatoria es una sección opcional pero hondamente emotiva. Se ubica en página impar tras los créditos y suele constar de una a tres líneas sobrias dedicadas a personas, mentores o deidades que hicieron posible el viaje del autor. A su vez, el epígrafe es una cita literaria o filosófica de otro autor que anticipa el tono moral de la obra. Un epígrafe bien seleccionado actúa como un faro que ilumina la lectura subterránea del texto.',
        michaelPenNarration: 'Una dedicatoria sentida y breve posee la fuerza de conmover a un lector incluso antes de ingresar al primer capítulo. Empléela con sobriedad y pureza de intención.',
        keyAxiom: 'El epígrafe susurra al oído del lector en qué frecuencia debe sintonizar su espíritu.',
        writingExercise: 'Escriba una dedicatoria de no más de veinte palabras para la persona más influyente en su camino formativo.',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.5
      },
      {
        id: 'b2_s5',
        slideNumber: 5,
        blockNumber: 2,
        title: 'El Prólogo vs. El Prefacio',
        subtitle: 'La distinción entre la voz externa y la voz del autor',
        expandedText: 'Uno de los errores más frecuentes en escritores noveles es confundir el prólogo con el prefacio. El prólogo es una pieza introductoria escrita por una tercera persona (un autor de renombre, un mentor o un especialista en la materia) que avala la calidad del libro y presenta al autor ante la comunidad. El prefacio o introducción del autor, por el contrario, está escrito por la pluma del propio creador, quien explica las motivaciones personales, el contexto en que nació la obra y qué hallará el lector en sus páginas.',
        michaelPenNarration: 'Un prólogo rubricado por una firma respetable puede abrirle puertas monumentales en el medio editorial. Medite desde ya qué mentor o colega distinguido podría apadrinar su obra.',
        keyAxiom: 'El prólogo aporta autoridad externa; el prefacio ofrece intimidad y cercanía.',
        writingExercise: 'Piense en dos personas reconocidas en su ámbito a quienes se atrevería a solicitar un prólogo para su libro.',
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.1
      },
      {
        id: 'b2_s6',
        slideNumber: 6,
        blockNumber: 2,
        title: 'El Índice General de Contenidos',
        subtitle: 'El mapa de navegación del intelecto del lector',
        expandedText: 'El índice o tabla de contenidos es indispensable en libros de no ficción, ensayos y manuales prácticos, y altamente recomendable en novelas con títulos capitulares descriptivos. Proporciona una vista de pájaro de la estructura completa del volumen, permitiendo al lector evaluar en segundos la profundidad del temario y regresar rápidamente a lecciones específicas. En los libros electrónicos modernos, el índice debe ser interactivo, enlazando directamente al inicio de cada sección con un simple clic.',
        michaelPenNarration: 'Un índice armónico, ordenado con títulos sugerentes, refleja a un autor con mente estructurada y metódica. Es la brújula indispensable de su navegación.',
        keyAxiom: 'Si el índice resulta caótico, el lector asumirá con justa razón que el contenido interior carece de norte.',
        writingExercise: 'Diseñe el índice tentativo de su proyecto dividiéndolo en tres partes con tres capítulos cada una.',
        imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.9
      },
      {
        id: 'b2_s7',
        slideNumber: 7,
        blockNumber: 2,
        title: 'El Cuerpo Principal: Los Capítulos',
        subtitle: 'Los eslabones inquebrantables de la trama o argumentación',
        expandedText: 'El cuerpo de la obra representa entre el 85% y el 95% de la extensión total del volumen. Cada capítulo debe funcionar como una unidad dramática o conceptual independiente con inicio, desarrollo y cierre, al tiempo que empuja inexorablemente la corriente general del libro hacia adelante. En la ficción, los capítulos culminan a menudo con ganchos de intriga (cliffhangers); en la no ficción, terminan con síntesis prácticas o llamadas a la acción. Mantener una longitud equilibrada entre capítulos otorga un compás de lectura placentero.',
        michaelPenNarration: 'Cada capítulo es un eslabón de una cadena de oro. Si uno solo se debilita o afloja, la tensión del libro entero se resiente. Cuide la cadencia de cada cierre capitular.',
        keyAxiom: 'El buen capítulo no es el que responde a todo, sino el que hace imposible apagar la lámpara de lectura.',
        writingExercise: 'Escriba la última frase de un capítulo imaginario de tal modo que obligue al lector a pasar la página de inmediato.',
        imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.2
      },
      {
        id: 'b2_s8',
        slideNumber: 8,
        blockNumber: 2,
        title: 'El Epílogo y Conclusiones',
        subtitle: 'El aterrizaje magistral tras el clímax de la obra',
        expandedText: 'El epílogo es la sección final donde se desatan los últimos cabos sueltos tras el clímax de la historia, o donde se brindan reflexiones de largo alcance sobre el destino de los personajes o la vigencia de la tesis presentada. Brinda al lector el necesario reposo emocional e intelectual antes de cerrar las tapas del libro. Debe ser conciso, elegante y dejar un regusto memorable en la memoria.',
        michaelPenNarration: 'El cierre de una obra es su testamento definitivo. La impresión final con la que el lector abandona sus páginas será la recomendación que transmita a sus allegados.',
        keyAxiom: 'El primer capítulo vende el libro actual; el último capítulo vende todos tus libros futuros.',
        writingExercise: 'Redacte en tres oraciones el mensaje de despedida con el que le gustaría sellar su manuscrito.',
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.7
      },
      {
        id: 'b2_s9',
        slideNumber: 9,
        blockNumber: 2,
        title: 'La Biografía del Autor y Nota Final',
        subtitle: 'La consolidación de tu marca personal y presencia pública',
        expandedText: 'La biografía del autor (About the Author) debe colocarse en las páginas finales o solapas. Redactada en tercera persona, sintetiza en uno o dos párrafos quién es el autor, sus pasiones, trayectoria y dónde los lectores pueden contactarlo o seguirlo en redes sociales. Incluir una fotografía profesional en blanco y negro o tono sepia humaniza la experiencia y consolida la marca del escritor.',
        michaelPenNarration: 'Su biografía de autor es su tarjeta de visita ante la república de las letras. Redáctela con dignidad, sin jactancia pero con legítimo orgullo por su vocación.',
        keyAxiom: 'El lector agradecido busca al autor; facilítele el camino para que forme parte de su comunidad fiel.',
        writingExercise: 'Redacte su biografía de autor en exactamente 75 palabras resaltando su visión literaria.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.9
      },
      {
        id: 'b2_s10',
        slideNumber: 10,
        blockNumber: 2,
        title: 'Preludio, Interludio y Secciones Especiales',
        subtitle: 'Herramientas de estilismo para obras de alta distinción',
        expandedText: 'Para obras de gran vuelo artístico existen piezas intermedias: el preludio (que sitúa la atmósfera antes de los hechos principales), los interludios (pausas líricas o reflexivas que separan partes mayores del volumen), los glosarios de términos y los apéndices documentales. Usados con mesura, estos elementos convierten a un libro ordinario en un objeto de colección de extraordinario valor para el bibliófilo.',
        michaelPenNarration: 'Estas secciones singulares dotan a su libro de una personalidad inconfundible. Empléelas con intención estética rigurosa y jamás por mero relleno.',
        keyAxiom: 'Los detalles invisibles para el profano son los que despiertan el aplauso de los maestros.',
        writingExercise: 'Decida si su proyecto se beneficiaría de un apéndice de preguntas frecuentes o un glosario de términos.',
        imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=675&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.8
      }
    ],
    questionBank: [
      {
        id: 'q_b2_01',
        blockId: 'block_02',
        question: '¿Cuál es la diferencia fundamental entre un prólogo y un prefacio en la anatomía editorial?',
        options: {
          A: 'El prólogo lo escribe una tercera persona y el prefacio lo escribe el propio autor.',
          B: 'El prólogo siempre va al final y el prefacio en la portada.',
          C: 'El prólogo es obligatorio por ley y el prefacio no existe.',
          D: 'El prólogo contiene la lista de capítulos y el prefacio los derechos legales.'
        },
        correctAnswer: 'A',
        explanation: 'El prólogo es una presentación o apadrinamiento de un tercero reconocido; el prefacio es la declaración íntima del propio autor.',
        difficulty: 'medium',
        psychometricAxis: 'analysis'
      },
      {
        id: 'q_b2_02',
        blockId: 'block_02',
        question: '¿Qué información imprescindible debe figurar en la página de derechos (copyright)?',
        options: {
          A: 'Únicamente el precio del libro en tres monedas distintas.',
          B: 'Año de publicación, titular del copyright, ISBN y reserva legal de derechos.',
          C: 'La biografía de los padres del autor.',
          D: 'El resumen completo del desenlace del libro.'
        },
        correctAnswer: 'B',
        explanation: 'La página legal debe certificar la titularidad de los derechos, el año, el registro ISBN y las cláusulas de protección de propiedad intelectual.',
        difficulty: 'medium',
        psychometricAxis: 'retention'
      }
    ]
  },

  // =========================================================================
  // BLOQUE 3: GÉNEROS LITERARIOS Y TU VOZ
  // =========================================================================
  {
    id: 'block_03',
    blockNumber: 3,
    title: 'Bloque III: Géneros Literarios y tu Voz',
    subtitle: 'Encuentra tu estilo, tu territorio y tu público lector',
    description: 'Explora las fronteras de la ficción, la no ficción, la literatura infantil, la poesía y el ensayo autobiográfico para forjar una voz propia e inconfundible.',
    congratulationMessage: '¡Fantástico! Ya conoces los géneros literarios y puedes identificar cuál se adapta mejor a tu voz. ¡Felicitaciones! Estás encontrando tu camino como escritor.',
    slides: [
      {
        id: 'b3_s1',
        slideNumber: 1,
        blockNumber: 3,
        title: '¿Qué es un Género Literario?',
        subtitle: 'El pacto tácito entre el autor y el horizonte de expectativas del lector',
        expandedText: 'Un género literario no es una celda carcelaria que limite tu imaginación; es un código de complicidad compartido entre el escritor y su público. Cuando un lector compra una novela de suspense, espera tensión, giros argumentales y misterio; cuando adquiere una guía de autoayuda, busca claridad, método y consuelo. Conocer las convenciones de tu género te permite satisfacer las expectativas fundamentales de tu audiencia al tiempo que introduces innovaciones que deslumbren.',
        michaelPenNarration: 'Conocer su género es conocer a la perfección el pulso cardíaco de su lector. Es el primer cimiento hacia una publicación fructífera.',
        keyAxiom: 'Quien intenta escribir para todo el mundo termina por no conmover a nadie.',
        writingExercise: 'Defina en una frase el género exacto y el lector arquetípico de su proyecto editorial.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.7
      },
      {
        id: 'b3_s2',
        slideNumber: 2,
        blockNumber: 3,
        title: 'Ficción: La Aventura de lo Imaginado',
        subtitle: 'El territorio supremo de la construcción de mundos',
        expandedText: 'La ficción abarca todas aquellas obras donde la trama es fruto de la invención del autor: novela histórica, ciencia ficción, fantasía épica, novela negra, romance y drama psicológico. Su poder radica en que permite explorar verdades universales a través de mentiras bellamente tramadas. Como decía Camus, la ficción es el homenaje que la mentira rinde a la verdad profunda de los corazones.',
        michaelPenNarration: 'La ficción es el santuario donde todo lo imaginable puede cobrar vida. Si usted es capaz de concebirlo con intensidad, puede trasladarlo a la página.',
        keyAxiom: 'En la buena ficción los personajes no son marionetas; tienen vida, respiran y a veces desafían a su creador.',
        writingExercise: 'Cree el esbozo de un conflicto central donde dos personajes honorables tengan motivos opuestos e irreconciliables.',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.0
      },
      {
        id: 'b3_s3',
        slideNumber: 3,
        blockNumber: 3,
        title: 'No Ficción: El Poder del Conocimiento Real',
        subtitle: 'Guiar, educar, transformar y resolver dilemas cotidianos',
        expandedText: 'La no ficción es el género más vendido en el mercado contemporáneo: manuales prácticos, libros de negocios, espiritualidad, desarrollo personal, memorias y ensayos sociológicos. El lector de no ficción no busca evasión; busca una transformación tangible en su vida, sus finanzas, su paz mental o sus destrezas profesionales. Escribir no ficción requiere claridad meridiana, rigor metodológico y generosidad absoluta en la entrega de soluciones.',
        michaelPenNarration: 'Los libros de no ficción poseen la virtud directa de rescatar vidas y orientar voluntades. Si usted atesora un saber valioso, tiene el deber cívico de compartirlo.',
        keyAxiom: 'El mejor libro de no ficción no es el que exhibe lo que sabe el autor, sino el que empodera al lector a actuar.',
        writingExercise: 'Enumere tres problemas concretos que su futuro libro ayudará a resolver a quien lo adquiera.',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.1
      },
      {
        id: 'b3_s4',
        slideNumber: 4,
        blockNumber: 3,
        title: 'Literatura Infantil y Juvenil (LIJ)',
        subtitle: 'La sagrada custodia de la imaginación de las nuevas generaciones',
        expandedText: 'Escribir para niños y jóvenes es una de las misiones más nobles y complejas de las letras. Requiere calibrar con precisión el vocabulario según las franjas etarias (primeros lectores, middle grade, young adult), cultivar la esperanza sin caer en la sensiblería barata y construir ritmos narrativos dinámicos. Un libro infantil memorable es el que un adulto puede releer con deleite y emoción renovada.',
        michaelPenNarration: 'Escribir para la infancia es un altísimo honor. Las frases que usted entregue hoy a un niño pueden convertirse en el escudo moral de su adultez.',
        keyAxiom: 'No se escribe para niños bajando el nivel intelectual, sino elevando la pureza de la mirada.',
        writingExercise: 'Describa un objeto cotidiano con la fascinación y el asombro con que lo vería un niño de siete años.',
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.9
      },
      {
        id: 'b3_s5',
        slideNumber: 5,
        blockNumber: 3,
        title: 'Poesía: La Música Secreta del Alma',
        subtitle: 'La síntesis diamantina de la emoción y el ritmo verbal',
        expandedText: 'La poesía es la forma primordial de la palabra humana. A través de la métrica, el verso libre, la rima y la metáfora luminosa, el poeta logra concentrar en diez versos una densidad emocional que a una novela le cuesta trescientas páginas desentrañar. Practicar la escritura poética, aun si tu objetivo final es la prosa narrativa, afina el oído para evitar cacofonías y dota a tus frases de una musicalidad irresistible.',
        michaelPenNarration: 'Un poema impecable es un diamante tallado con el bisturí de la emoción pura. Dedicar tiempo a la lírica embellecerá para siempre su prosa.',
        keyAxiom: 'La prosa camina; la poesía danza.',
        writingExercise: 'Escriba un poema breve de cuatro versos evocando la lluvia sobre el cristal de una ventana antigua.',
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.6
      },
      {
        id: 'b3_s6',
        slideNumber: 6,
        blockNumber: 3,
        title: 'Literatura Espiritual y Trascendente',
        subtitle: 'El consuelo profundo para las heridas del alma moderna',
        expandedText: 'En una era marcada por la velocidad aturdidora y la angustia existencial, la literatura devocional, de reflexión bíblica y meditación filosófica goza de una lealtad lectora inquebrantable. Estos libros son compañeros de cabecera que se leen en dosis meditadas día a día. Exigen del escritor una vivencia auténtica de lo que predica y una humildad profunda en cada línea trazada.',
        michaelPenNarration: 'Las palabras nacidas de la fe sincera y el recogimiento interior tienen el don de sanar corazones quebrantados. Si siente ese llamamiento en su pecho, respóndale con valor.',
        keyAxiom: 'No hables de la luz como quien la inventó, sino como quien fue rescatado de la penumbra por su resplandor.',
        writingExercise: 'Redacte una meditación de 100 palabras sobre el valor de la paciencia en medio de la adversidad.',
        imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.0
      },
      {
        id: 'b3_s7',
        slideNumber: 7,
        blockNumber: 3,
        title: 'Autoficción y Memorias',
        subtitle: 'Transformar tu experiencia vivida en arte universal',
        expandedText: 'Nuestras vivencias personales, dolores superados y triunfos íntimos son materia prima de altísimo valor. En las memorias y la autoficción, el autor recrea episodios reales de su biografía aplicando técnicas narrativas de la novela (diálogos directos, escenas sensoriales y tensión dramática). El secreto radica en convertir la anécdota individual en un espejo donde cualquier ser humano pueda reconocerse.',
        michaelPenNarration: 'Su biografía es única e irrepetible en toda la extensión del cosmos. Nadie más puede narrarla con su mirada. Ese es su mayor tesoro editorial.',
        keyAxiom: 'Lo más íntimo y personal es siempre lo más universal si se cuenta con honestidad descarnada.',
        writingExercise: 'Recuerde un episodio crucial de su infancia y nárrelo centrándose exclusivamente en los olores y sonidos del entorno.',
        imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.1
      },
      {
        id: 'b3_s8',
        slideNumber: 8,
        blockNumber: 3,
        title: 'El Seudónimo: Tu Identidad Estratégica',
        subtitle: 'Libertad creativa, privacidad y separación de registros',
        expandedText: 'A lo largo de la historia, autores ilustres como George Orwell (Eric Blair), Mark Twain (Samuel Clemens) o Gabriela Mistral (Lucila Godoy) adoptaron seudónimos artísticos. Emplear un nombre de pluma es una decisión perfectamente legal y legítima que permite resguardar la privacidad familiar, separar géneros divergentes o construir una sonoridad más atractiva en el mercado internacional.',
        michaelPenNarration: 'Elegir su nombre de autor es un acto fundacional. Medítelo con serenidad y elija una combinación que resuene con señorío en la memoria del público.',
        keyAxiom: 'El nombre que encabeza tu libro es la bandera bajo la cual marcharán tus palabras.',
        writingExercise: 'Piense en un seudónimo alternativo combinando un nombre clásico con un apellido de resonancia noble.',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.7
      },
      {
        id: 'b3_s9',
        slideNumber: 9,
        blockNumber: 3,
        title: 'Cómo Descubrir y Pulir tu Voz Propia',
        subtitle: 'El timbre inconfundible de tu temperamento sintáctico',
        expandedText: 'Tu voz literaria no se compra en un manual ni se copia de un autor consagrado. Tu voz es el resultado de la colisión entre tus lecturas devotas, tus heridas de vida, tus obsesiones intelectuales y el ritmo natural con que tu cerebro estructura los pensamientos. Al principio es natural imitar a los maestros que admiras, pero la disciplina diaria de escribir irá despojando los ropajes prestados hasta dejar al descubierto tu verdadera entonación.',
        michaelPenNarration: 'No intente jamás sonar como alguien más. El mundo ya tuvo a sus próceres; lo que la literatura anhela hoy es escuchar su timbre genuino.',
        keyAxiom: 'El estilo maduro no consiste en añadir adornos a la frase, sino en despojarla de toda falsedad.',
        writingExercise: 'Escriba una misma escena cotidiana de dos maneras: una en tono solemne y otra en tono irónico y ágil.',
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.2
      },
      {
        id: 'b3_s10',
        slideNumber: 10,
        blockNumber: 3,
        title: 'Reflexión: Tu Manifiesto de Género y Propósito',
        subtitle: 'La brújula que guiará cada jornada ante el teclado',
        expandedText: 'Habiendo explorado el mapa de los géneros, es momento de tomar posición. ¿Serás el arquitecto de una novela de suspense trepidante, el guía de almas en un manual de crecimiento interior o el custodio de la memoria en un libro testimonial? La claridad en esta elección evitará que malgastes meses en callejones sin salida creativa. En el siguiente bloque descenderemos a la fragua del taller: el proceso concreto de escribir de la primera a la última página.',
        michaelPenNarration: '¡Felicitaciones! Ha culminado este recorrido por las diversas comarcas del pensamiento literario. Tómese un instante para asimilar lo aprendido antes de forjar su manuscrito.',
        keyAxiom: 'Cuando sabes exactamente a qué género perteneces, las musas saben dónde encontrarte trabajando.',
        writingExercise: 'Redacte en una cuartilla su "Manifiesto de Autor", declarando por qué escribe y a quién va dirigido su libro.',
        imageUrl: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=1200&h=675&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.8
      }
    ],
    questionBank: [
      {
        id: 'q_b3_01',
        blockId: 'block_03',
        question: '¿Cuál es el propósito central de un género literario en el mercado editorial moderno?',
        options: {
          A: 'Impedir que el autor mezcle ideas de distintos campos.',
          B: 'Establecer un código de complicidad y expectativas claras entre el autor y su lector.',
          C: 'Aumentar obligatoriamente el número de páginas de un libro.',
          D: 'Prohibir el uso de recursos poéticos en prosa.'
        },
        correctAnswer: 'B',
        explanation: 'El género orienta las expectativas del público lector, facilitando la conexión y el posicionamiento de la obra.',
        difficulty: 'medium',
        psychometricAxis: 'analysis'
      }
    ]
  },

  // =========================================================================
  // BLOQUE 4: EL PROCESO DE ESCRITURA
  // =========================================================================
  {
    id: 'block_04',
    blockNumber: 4,
    title: 'Bloque IV: El Proceso de Escritura',
    subtitle: 'De la chispa inicial al manuscrito terminado',
    description: 'Domina el método paso a paso: captura de ideas, diseño del outline, construcción de personajes tridimensionales, superación del bloqueo y la magia de la revisión.',
    congratulationMessage: '¡Fantástico! Dominas el proceso creativo de escritura. ¡Felicitaciones! Ya tienes las herramientas para empezar y terminar tu libro con éxito garantizado.',
    slides: [
      {
        id: 'b4_s1',
        slideNumber: 1,
        blockNumber: 4,
        title: 'La Gran Idea: Captura y Maduración',
        subtitle: 'Cómo atrapar la chispa antes de que se disipe en el viento',
        expandedText: 'Todo libro nace de una semilla minúscula: una conversación escuchada al paso, una injusticia que te indigna, un recuerdo que rehúsa morir o una pregunta para la cual no encuentras respuesta en las enciclopedias. El error del diletante es confiar en su memoria; las ideas más brillantes son etéreas y huyen si no se registran en el instante en que emergen. Llevar un cuaderno de notas o una libreta digital es el hábito cardinal del escritor profesional. Una vez capturada, deja madurar la idea durante varias semanas antes de lanzarte a escribir.',
        michaelPenNarration: 'Las mejores ideas escapan como pájaros asustados si no se apresura usted a enjaularlas en el papel. Lleve siempre consigo un cuaderno o libreta de notas.',
        keyAxiom: 'La inspiración no avisa cuando llega; asegúrate de que te encuentre con la pluma lista.',
        writingExercise: 'Anote en este instante tres ideas embrionarias que hayan rondado su cabeza en el último mes.',
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.8
      },
      {
        id: 'b4_s2',
        slideNumber: 2,
        blockNumber: 4,
        title: 'El Outline o Escaleta: Tu Mapa del Tesoro',
        subtitle: 'La diferencia entre viajar con brújula o perderse en la selva',
        expandedText: 'Lanzarse a escribir una obra de trescientas páginas sin un plan previo suele desembocar en frustración y abandono hacia la página sesenta. El outline o escaleta argumental es el plano maestro donde defines la premisa central, los puntos de giro fundamentales (detonante, primer punto de giro, punto medio, clímax y resolución) y la función de cada capítulo. Una buena escaleta no asfixia la creatividad; te brinda la tranquilidad mental para centrarte en la prosa sin temer perder el rumbo.',
        michaelPenNarration: 'Un buen mapa previo le ahorrará meses enteros de angustiosa reescritura. Es la frontera que separa al caminante seguro del extraviado en la noche.',
        keyAxiom: 'El tiempo invertido en planificar la estructura se recupera multiplicado por diez durante el borrador.',
        writingExercise: 'Trace en una página el arco de tres actos de su libro: inicio desestabilizador, conflicto creciente y clímax resolutivo.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.1
      },
      {
        id: 'b4_s3',
        slideNumber: 3,
        blockNumber: 4,
        title: 'Construcción de Personajes Tridimensionales',
        subtitle: 'Deseo, herida del pasado, contradicción y voz propia',
        expandedText: 'Un personaje memorable jamás es un bloque homogéneo de bondad o maldad. Para que un ser de ficción respire en la mente del lector debe poseer tres dimensiones: un deseo consciente (lo que cree que quiere), una necesidad inconsciente (lo que verdaderamente precisa para madurar) y una herida formativa del pasado (el trauma o carencia que condiciona sus miedos). Cuando tus personajes toman decisiones que te sorprenden a ti mismo como autor, has cruzado el umbral hacia el arte verdadero.',
        michaelPenNarration: 'Cuando un personaje se rebela contra sus planes preconcebidos y toma sus propias decisiones, ¡felicidades! Ha engendrado usted un ser dotado de vida.',
        keyAxiom: 'Los personajes planos obedecen al autor; los personajes inmortales obedecen a su propia naturaleza.',
        writingExercise: 'Cree la ficha psicológica de su protagonista definiendo su mayor virtud, su defecto inconfesable y su más hondo temor.',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.3
      },
      {
        id: 'b4_s4',
        slideNumber: 4,
        blockNumber: 4,
        title: 'La Atmósfera y el Escenario Sensorial',
        subtitle: 'Convertir el espacio físico en un personaje dramático más',
        expandedText: 'El escenario donde transcurre una escena no es un decorado teatral inerte; es un catalizador emocional que influye en el estado de ánimo de los personajes y del lector. Para evocarlo con maestría, destierra las listas aburridas de adjetivos y apela a los cinco sentidos: la humedad densa que pega la camisa al torso, el crujido metálico de una puerta desajustada, el regusto a café quemado o el reflejo cobrizo del ocaso en una copa de cristal.',
        michaelPenNarration: 'Un ambiente vivamente descrito no es mero decorado; es un personaje más que respira y oprime la garganta de sus protagonistas.',
        keyAxiom: 'No digas que hacía frío; haz que al lector le castañeen los dientes al leer tu párrafo.',
        writingExercise: 'Describa una habitación vacía a través de tres sensaciones táctiles y auditivas sin nombrar ningún color.',
        imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.9
      },
      {
        id: 'b4_s5',
        slideNumber: 5,
        blockNumber: 4,
        title: 'El Primer Borrador: Escribir sin Corregir',
        subtitle: 'El pacto de silencio con el crítico interior',
        expandedText: 'El mayor asesino de libros es el perfeccionismo prematuro. Quien pretende que cada frase sea una gema cincelada desde el primer intento se condena al parálisis. El único cometido del primer borrador es existir; es la arcilla informe que luego será esculpida en la revisión. Apaga tu juez interior, tolera las repeticiones y los pasajes torpes, y avanza implacablemente hacia el punto final. Como sentenció Hemingway: "El primer borrador de cualquier cosa es siempre tosco".',
        michaelPenNarration: 'El escritor más vulnerable es aquel que pretende corregir con lupa mientras escribe el primer trazo. Apague el juicio analítico y permita a la creatividad galopar libre.',
        keyAxiom: 'No puedes pulir una página en blanco; primero debes llenarla de vida aunque sea imperfecta.',
        writingExercise: 'Escriba durante quince minutos seguidos sin detenerse a corregir una sola errata ni releer la línea anterior.',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.0
      },
      {
        id: 'b4_s6',
        slideNumber: 6,
        blockNumber: 4,
        title: 'La Disciplina del Hábito Diario',
        subtitle: 'La constancia que transforma aspirantes en autores prolíficos',
        expandedText: 'Los aficionados esperan a que descienda la musa para sentarse a escribir; los profesionales se sientan a trabajar todos los días a la misma hora y la musa sabe dónde encontrarlos. Establecer una meta alcanzable —como 300 o 500 palabras diarias— produce un manuscrito completo de 60,000 palabras en menos de cinco meses. Protege tu bloque horario de escritura como si fuera una audiencia con un jefe de Estado.',
        michaelPenNarration: 'No aguarde a la caprichosa inspiración para tomar la pluma. La verdadera inspiración arriba cuando sus dedos ya están danzando sobre el teclado.',
        keyAxiom: 'Una gota de tinta diaria perfora la roca más dura de la pereza.',
        writingExercise: 'Fije en su calendario la hora exacta e innegociable de cada día que consagrará en adelante a su libro.',
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.8
      },
      {
        id: 'b4_s7',
        slideNumber: 7,
        blockNumber: 4,
        title: 'Superar el Bloqueo del Escritor',
        subtitle: 'Estrategias psicológicas para dinamitar la parálisis',
        expandedText: 'El bloqueo no es una maldición insuperable ni la prueba de que careces de talento; es simplemente una señal de fatiga cognitiva, miedo al juicio ajeno o un error estructural cometido diez páginas atrás que tu inconsciente detecta antes que tú. Cuando te estanques: sal a caminar sin teléfono, escribe una escena del final que te entusiasme, cambia la perspectiva al punto de vista del villano o describe lo que ocurre por tu ventana.',
        michaelPenNarration: 'Todo gran autor que hoy veneramos conoció el rostro gélido del bloqueo creativo. La diferencia es que aprendieron a rodearlo con astucia.',
        keyAxiom: 'El bloqueo se vence caminando, descansando la mente o escribiendo deliberadamente mal durante diez minutos.',
        writingExercise: 'Si se encuentra atascado en una escena, fuerce la entrada imprevista de un mensajero con una noticia inesperada.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.1
      },
      {
        id: 'b4_s8',
        slideNumber: 8,
        blockNumber: 4,
        title: 'Diálogos que Suenan Vivos y Afilados',
        subtitle: 'El arte de la réplica, el subtexto y la elipsis',
        expandedText: 'Un diálogo literario magistral no reproduce la charla aburrida de la vida real con sus muletillas y rodeos vacíos; es una versión estilizada y comprimida donde cada réplica esconde un pulso de poder. El principio reina es el subtexto: lo que los personajes dicen jamás debe coincidir exactamente con lo que realmente desean. Lee siempre tus diálogos en voz alta; si la lengua tropieza o suena artificial, tijera implacable.',
        michaelPenNarration: 'Escuche con atención las conversaciones en cafés y transportes. El más refinado laboratorio para escribir diálogos es la observación atenta de la conducta humana.',
        keyAxiom: 'En el gran diálogo, lo que no se dice resuena con más fuerza que la palabra pronunciada.',
        writingExercise: 'Escriba un diálogo entre dos personas que se aman profundamente pero deben simular indiferencia ante testigos.',
        imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.2
      },
      {
        id: 'b4_s9',
        slideNumber: 9,
        blockNumber: 4,
        title: 'La Revisión Quirúrgica: Donde Nace la Obra Real',
        subtitle: 'El arte de la poda, la coherencia y el ritmo prosódico',
        expandedText: 'Escribir es humano; corregir y podar es divino. Una vez culminado el borrador completo, déjalo reposar en un cajón durante al menos dos semanas para limpiar tu retina de la familiaridad del texto. Luego emprende tres pasadas de revisión: primero, la macro-estructura (trama, ritmo, agujeros lógicos); segundo, el estilo y la poda de adverbios superfluos; tercero, la corrección ortotipográfica y de concordancia.',
        michaelPenNarration: 'En la mesa de revisión es donde el verdadero escritor nace a la vida. No se desanime ante las correcciones; cada párrafo tachado es una victoria del buen gusto.',
        keyAxiom: 'La perfección no se alcanza cuando no hay nada más que añadir, sino cuando no queda nada más que quitar.',
        writingExercise: 'Tome un párrafo propio de 100 palabras y redúzcalo a 60 sin perder un ápice de su fuerza comunicativa.',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.3
      },
      {
        id: 'b4_s10',
        slideNumber: 10,
        blockNumber: 4,
        title: '¡Tu Manuscrito ha Nacido!',
        subtitle: 'La celebración de una victoria que muy pocos alcanzan',
        expandedText: 'Completar el manuscrito de un libro es una proeza titánica que menos del cinco por ciento de quienes lo sueñan consiguen coronar. Has demostrado disciplina, coraje y fidelidad a tu vocación. Respira hondo, celebra este logro con quienes amas y prepárate para la última frontera: transformar ese manojo de cuartillas en un producto editorial impecable listo para triunfar en el mercado global.',
        michaelPenNarration: '¡Fantástico! Lo ha logrado con entereza. Culminar un manuscrito es uno de los triunfos espirituales más excelsos en la existencia de un ser humano. ¡Celebre este instante con legítimo gozo!',
        keyAxiom: 'El manuscrito terminado es la prueba material de que tus sueños no eran humo, sino acero templado.',
        writingExercise: 'Escriba la fecha de hoy y firme la portada de su borrador como un testimonio solemne de victoria.',
        imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1200&h=675&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.9
      }
    ],
    questionBank: [
      {
        id: 'q_b4_01',
        blockId: 'block_04',
        question: '¿Cuál es la función primordial del primer borrador según la metodología de Master Pen?',
        options: {
          A: 'Ser publicado de inmediato sin ninguna corrección.',
          B: 'Simplemente existir, venciendo el juicio del crítico interior para modelar la arcilla en la revisión.',
          C: 'Tener una ortografía perfecta desde la primera línea.',
          D: 'Enviar copias a cien críticos literarios.'
        },
        correctAnswer: 'B',
        explanation: 'El primer borrador tiene como meta única existir; la sofisticación y el pulido nacen en la etapa posterior de revisión quirúrgica.',
        difficulty: 'medium',
        psychometricAxis: 'application'
      }
    ]
  },

  // =========================================================================
  // BLOQUE 5: PUBLICACIÓN Y ÉXITO EDITORIAL
  // =========================================================================
  {
    id: 'block_05',
    blockNumber: 5,
    title: 'Bloque V: Publicación y Éxito Editorial',
    subtitle: 'Lleva tu libro al mundo con estrategia, elegancia y rentabilidad',
    description: 'Aprende las rutas de autopublicación en Amazon KDP, registro legal de ISBN, maquetación profesional de interiores, fijación estratégica de precios y marketing de autor.',
    congratulationMessage: '¡Felicitaciones! Completaste el curso completo Quiero ser Escritor. ¡Fantástico! Ahora tienes todas las herramientas para escribir, publicar y triunfar. El mundo entero espera tu libro.',
    slides: [
      {
        id: 'b5_s1',
        slideNumber: 1,
        blockNumber: 5,
        title: 'Las Rutas Contemporáneas de Publicación',
        subtitle: 'Editorial tradicional, imprentas de vanidad y autopublicación directa',
        expandedText: 'Hoy en día el autor cuenta con tres grandes avenidas: la editorial tradicional (que asume los costos pero exige cesión casi total de derechos y paga regalías del 7% al 10%), las imprentas de pago o vanity press (que cobran costosas tarifas por servicios a menudo precarios) y la autopublicación digital directa (donde el autor controla el diseño, la fecha de lanzamiento y retiene hasta el 70% de los ingresos netos). Para la inmensa mayoría de creadores modernos, la autopublicación soberana es la senda más rentable, rápida y digna.',
        michaelPenNarration: 'La autopublicación moderna ha encumbrado a miles de autores de renombre internacional. Es la ruta más soberana y directa entre su pluma y el corazón de sus lectores.',
        keyAxiom: 'El verdadero dueño de un libro no es quien lo imprime, sino quien retiene la propiedad moral y económica de sus derechos.',
        writingExercise: 'Compare en una tabla los pros y contras de cada modelo según sus metas financieras y artísticas.',
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.0
      },
      {
        id: 'b5_s2',
        slideNumber: 2,
        blockNumber: 5,
        title: 'Amazon KDP: El Coloso de la Distribución Global',
        subtitle: 'Publicación bajo demanda (PoD) en tapa blanda, tapa dura y Kindle e-book',
        expandedText: 'Amazon Kindle Direct Publishing (KDP) es la infraestructura más poderosa jamás construida para escritores. Permite cargar el manuscrito maquetado y la portada en PDF/ePub sin costo inicial alguno. Cuando un lector en Alemania, Estados Unidos o México compra tu libro físico, Amazon lo imprime en una de sus plantas locales, lo empaca y lo entrega en 24 horas, depositando tus regalías directamente en tu cuenta bancaria. Ya no necesitas imprimir miles de ejemplares en un garaje.',
        michaelPenNarration: 'Con Amazon KDP, su libro puede estar disponible en más de cien naciones en menos de setenta y dos horas. Ese es un poder editorial sin precedentes históricos.',
        keyAxiom: 'La impresión bajo demanda eliminó el riesgo financiero del stock no vendido.',
        writingExercise: 'Cree o revise su cuenta en KDP y explore las herramientas de vista previa de manuscrito.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.2
      },
      {
        id: 'b5_s3',
        slideNumber: 3,
        blockNumber: 5,
        title: 'El ISBN y el Registro de Propiedad Intelectual',
        subtitle: 'La cédula de identidad del libro y su salvaguarda judicial',
        expandedText: 'El ISBN (Número Internacional Normalizado del Libro) es el código de 13 dígitos que identifica de manera única a tu edición en las bases de datos de librerías y distribuidores de todo el planeta. Cada formato (e-book, tapa blanda, tapa dura) requiere su propio ISBN. Aunque plataformas como Amazon ofrecen un ISBN gratuito, adquirir tu propio identificador ante la agencia de tu país te acredita como la editorial formal de tu obra.',
        michaelPenNarration: 'Proteger su esfuerzo intelectual es tan vital como el acto mismo de concebirlo. Su trabajo merece portar con orgullo su código de identidad universal.',
        keyAxiom: 'Un libro con ISBN propio es un ciudadano con plenos derechos en la república de las letras.',
        writingExercise: 'Consulte en la página web de la agencia de ISBN de su país cuáles son los requisitos de registro como autor-editor.',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.9
      },
      {
        id: 'b5_s4',
        slideNumber: 4,
        blockNumber: 5,
        title: 'Maquetación y Tipografía Interior Profesional',
        subtitle: 'Márgenes de encuadernación, sangrías y fuentes legibles',
        expandedText: 'Un interior mal diagramado fatiga la vista y delata amateurismo a los pocos segundos. Los estándares de alta legibilidad exigen tipografías serif clásicas (Garamond, Baskerville, Minion Pro o Times New Roman), un interlineado generoso (1.15 a 1.25), márgenes interiores con margen de simetría (gutter) para que el texto no se hunda en el lomo, y cornisas limpias con número de página y título corriente.',
        michaelPenNarration: 'Un diseño tipográfico pulcro incrementa la comodidad de lectura en un treinta por ciento. El diseño interior es la cortesía invisible que el autor brinda a su público.',
        keyAxiom: 'La mejor tipografía es aquella que el lector no nota porque le permite fundirse con las palabras.',
        writingExercise: 'Configure en su procesador de texto una plantilla con fuente Garamond a 11 puntos e interlineado de 1.2 líneas.',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.1
      },
      {
        id: 'b5_s5',
        slideNumber: 5,
        blockNumber: 5,
        title: 'Estrategia Visual de Portada para Tiendas Online',
        subtitle: 'El cartel publicitario que debe convencer en tamaño miniatura',
        expandedText: 'En las tiendas digitales, el 90% de los lectores ve por primera vez tu libro en una miniatura del tamaño de un sello postal en la pantalla de su teléfono celular. Tu portada debe funcionar tanto a tamaño póster como en versión reducida: tipografía gruesa y contrastada, no más de tres elementos focales y una paleta cromática acorde con las tendencias de los libros más vendidos de tu categoría.',
        michaelPenNarration: 'Una portada endeble puede sepultar un texto brillante; una portada seductora puede disparar las ventas de un relato humilde. Invierta con inteligencia en esta vitrina.',
        keyAxiom: 'Si el título no se lee con nitidez en una miniatura de teléfono celular, la portada ha fallado.',
        writingExercise: 'Tome tres portadas líderes de su género y analice qué paleta de colores y tipo de fuente emplean.',
        imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 3.8
      },
      {
        id: 'b5_s6',
        slideNumber: 6,
        blockNumber: 5,
        title: 'Fijación Estratégica del Precio de Venta',
        subtitle: 'Maximizando regalías, percepción de valor y volumen de lectores',
        expandedText: 'El precio de tu libro comunica posicionamiento. En Amazon, el rango de $2.99 a $9.99 otorga el porcentaje máximo de regalías del 70% para libros digitales; precios por debajo de $2.99 devengan solo el 35%. Lanzar a un precio promocional de entrada ($0.99 o $1.99) durante los primeros tres días para acumular reseñas y luego subir al precio regular ($4.99 o $6.99) es la táctica más efectiva para escalar puestos en los algoritmos de recomendación.',
        michaelPenNarration: 'El precio fijado a su obra es una solemne declaración de valor. No la regale por complejo de modestia, ni la sitúe fuera del alcance de sus lectores ideales.',
        keyAxiom: 'El precio bajo atrae curiosos; la calidad intrínseca forja lectores leales.',
        writingExercise: 'Defina su precio de lanzamiento y su precio definitivo calculando el margen de regalías netas estimado.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.0
      },
      {
        id: 'b5_s7',
        slideNumber: 7,
        blockNumber: 5,
        title: 'Marketing de Autor: El Lector Beta y la Reseña Social',
        subtitle: 'El engranaje del boca a boca y la prueba social temprana',
        expandedText: 'Un libro sin reseñas es un restaurante vacío donde nadie se atreve a entrar. Antes del día de publicación oficial, reúne a un "Equipo de Lanzamiento" (Advance Reader Team) de 15 a 30 lectores beta que lean el manuscrito previo y se comprometan a dejar una valoración honesta el primer día. Las primeras diez reseñas cinco estrellas activan los motores algorítmicos de las tiendas digitales, mostrando tu libro a miles de compradores afines.',
        michaelPenNarration: 'Escribir el libro representa la mitad de la hazaña; la otra mitad consiste en tender puentes generosos para que llegue a quienes lo precisan.',
        keyAxiom: 'La opinión honesta de un lector entusiasta vale más que mil dólares invertidos en publicidad fría.',
        writingExercise: 'Elabore una lista de diez amigos, colegas o lectores que estarían dispuestos a integrar su equipo de prelanzamiento.',
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.2
      },
      {
        id: 'b5_s8',
        slideNumber: 8,
        blockNumber: 5,
        title: 'Construcción de tu Marca Personal Literaria',
        subtitle: 'El autor detrás de la obra: autenticidad, presencia y comunidad',
        expandedText: 'Los lectores no solo adquieren libros sueltos; establecen un vínculo de lealtad con personas vivas. Cuida tu biografía pública, tu fotografía oficial y mantén una presencia selecta en uno o dos canales digitales (un boletín por correo o newsletter es diez veces más efectivo que las redes sociales volátiles). Cuando el lector confía en la integridad y el buen gusto de tu firma, comprará automáticamente cualquier nuevo título que pongas en circulación.',
        michaelPenNarration: 'Los autores más admirados del mundo son, por encima de todo, personas auténticas. Su historia personal es el activo más magnético de su marca.',
        keyAxiom: 'Las redes sociales prestan audiencia; tu lista de correo privado te otorga un canal directo con tu tribu de lectores.',
        writingExercise: 'Redacte el asunto y las primeras tres líneas del correo de bienvenida para los suscriptores de su boletín de autor.',
        imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.1
      },
      {
        id: 'b5_s9',
        slideNumber: 9,
        blockNumber: 5,
        title: 'El Secreto del Éxito Editorial: El Catálogo Prolífico',
        subtitle: 'Por qué tu mejor herramienta de marketing es tu siguiente libro',
        expandedText: 'El error fatal de muchos autores noveles es consagrar diez años a promocionar un único libro aislado. El modelo de negocio de los autores independientes más prósperos del mundo descansa sobre el "Catálogo": cada nuevo libro publicado actúa como un imán que reaviva las ventas de todos los anteriores. Cuando un lector concluye tu obra y queda fascinado, buscará de inmediato tu segundo título. Si no existe, esa venta se pierde para siempre. Escribe el primero con devoción, y comienza el segundo con presteza.',
        michaelPenNarration: 'No apueste todo su destino a un único título. ¡El catálogo es el gran secreto editorial! Cada obra que usted suma multiplica el alcance de las anteriores.',
        keyAxiom: 'El mejor marketing para tu primer libro es tener listo en preventa el segundo.',
        writingExercise: 'Escriba el título y la sinopsis tentativa de dos páginas para la obra que emprenderá inmediatamente tras publicar la actual.',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.3
      },
      {
        id: 'b5_s10',
        slideNumber: 10,
        blockNumber: 5,
        title: '¡Consagración: Eres un Escritor de Plena Maestría!',
        subtitle: 'El juramento de honor ante la página y el porvenir',
        expandedText: 'Has completado los cinco bloques formativos de la academia Master Pen Training. Has viajado desde el barro de Babilonia y las imprentas renacentistas hasta el dominio técnico de la estructura, la voz propia, el proceso artesanal del borrador y las palancas del éxito editorial digital. Tienes el conocimiento, posees el método y llevas el fuego sagrado en tu espíritu. No esperes a que se alineen astros inexistentes ni aguardes una aprobación externa que ya reside en ti: abre tu cuaderno, coloca las manos sobre el teclado y escribe tu obra inmortal hoy mismo.',
        michaelPenNarration: '¡Felicitaciones! Ha culminado usted con honor el curso Quiero ser Escritor. ¡Fantástico! Ahora posee todas las herramientas para escribir, publicar y triunfar. El mundo de las letras aguarda su voz. Vaya con valentía y escriba su historia.',
        keyAxiom: 'Las condiciones ideales jamás llegan de forma espontánea; son creadas por la voluntad indomable del autor.',
        writingExercise: 'Firme solemnemente en su diario de trabajo: "Hoy, como autor formado, inicio formalmente la redacción de mi primer libro publicado".',
        imageUrl: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=1200&h=675&auto=format&fit=crop&q=80',
        estimatedMinutes: 4.5
      }
    ],
    questionBank: [
      {
        id: 'q_b5_01',
        blockId: 'block_05',
        question: '¿Qué porcentaje aproximado de regalías netas ofrece Amazon KDP en libros digitales dentro del rango de $2.99 a $9.99?',
        options: {
          A: 'Aproximadamente el 10%, igual a una editorial tradicional.',
          B: 'Hasta el 70% de las regalías netas.',
          C: 'Cero por ciento, cobrando por cada descarga.',
          D: 'El 25% únicamente en fechas festivas.'
        },
        correctAnswer: 'B',
        explanation: 'En el intervalo estándar de $2.99 a $9.99, Amazon liquida el 70% de regalías al autor independiente.',
        difficulty: 'medium',
        psychometricAxis: 'analysis'
      },
      {
        id: 'q_b5_02',
        blockId: 'block_05',
        question: '¿Por qué la construcción de un catálogo con múltiples libros es el secreto cardinal del autor próspero?',
        options: {
          A: 'Porque un solo libro jamás puede venderse legalmente.',
          B: 'Porque cada nuevo libro actúa como un imán publicitario que impulsa las ventas acumuladas de todos los anteriores.',
          C: 'Porque las plataformas borran los libros que tienen más de tres meses.',
          D: 'Porque las leyes exigen publicar una trilogía obligatoria.'
        },
        correctAnswer: 'B',
        explanation: 'Un catálogo amplio maximiza el valor de vida del lector; cuando un lector descubre al autor y queda cautivado, adquiere el resto de sus títulos.',
        difficulty: 'medium',
        psychometricAxis: 'synthesis'
      }
    ]
  }
];

// Helper to convert QUIERO_SER_ESCRITOR_BLOCKS into the application's AcademicBlock format
export function getAcademicBlocksForCourse(): AcademicBlock[] {
  return QUIERO_SER_ESCRITOR_BLOCKS.map(block => {
    const resources: MediaResource[] = block.slides.map((slide, idx) => ({
      id: `res_${block.id}_slide_${slide.slideNumber}`,
      title: `Diapositiva ${slide.slideNumber}: ${slide.title}`,
      type: 'slide_audio',
      storageUrl: slide.imageUrl,
      signedTokenExpiresAt: Date.now() + 60 * 60 * 1000,
      durationMinutes: slide.estimatedMinutes,
      transcript: `${slide.title}\n${slide.subtitle}\n\n${slide.expandedText}\n\nMichael Pen narra: "${slide.michaelPenNarration}"\n\nAxioma Clave: ${slide.keyAxiom}\nEjercicio Práctico: ${slide.writingExercise}`,
      audioTrackUrl: 'https://actions.google.com/sounds/v1/ambiences/hum_indoor.ogg',
      fileSizeBytes: 8500000 + idx * 500000,
      order: slide.slideNumber
    }));

    return {
      id: block.id,
      blockNumber: block.blockNumber,
      title: block.title,
      subtitle: block.subtitle,
      description: block.description,
      isLockedForStudent: block.blockNumber > 1,
      passingScoreRequired: 100,
      questionPoolSize: 20,
      resources
    };
  });
}
