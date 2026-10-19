// Master Pen Training - Curso: "Escritura Creativa"
// Autor: Anthony Small
// Configuración oficial y banco de reactivos para Módulo M1 según ASSESSMENT_SCHEMA_v1

import { AssessmentSchemaConfig, AssessmentItemInternal } from '../types/assessmentSchemaV1';

export interface CourseSlideV1 {
  id: string;
  slideNumber: number;
  moduleId: string;
  title: string;
  subtitle: string;
  expandedText: string;
  michaelPenNarration: string;
  keyAxiom: string;
  writingExercise: string;
  thematicGroup: string;
  imageUrl: string;
  estimatedMinutes: number;
}

export const ESCRITURA_CREATIVA_CONFIG_M1: AssessmentSchemaConfig = {
  schema_version: 'ASSESSMENT_SCHEMA_v1',
  module_id: 'M1',
  course_id: 'curso_escritura_creativa_anthony_small',
  course_title: 'Escritura Creativa',
  instructor_name: 'Anthony Small',
  bank_size: 20,
  items_per_attempt: 10,
  sampling: {
    method: 'stratified_without_replacement',
    rule: '1 ítem por grupo temático (7 grupos) + 3 ítems adicionales del resto del banco'
  },
  scoring: {
    points_per_item: 1,
    pass_threshold: 0.8
  },
  attempts: {
    max_before_cooldown: 3,
    cooldown_hours: 24,
    require_review_before_retry: true
  },
  state_machine: {
    module_states: ['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'ASSESSMENT_PENDING', 'PASSED'],
    transitions: [
      { from: 'AVAILABLE', to: 'IN_PROGRESS', on: 'user_opens_module' },
      { from: 'IN_PROGRESS', to: 'ASSESSMENT_PENDING', on: 'all_slides_completed' },
      { from: 'ASSESSMENT_PENDING', to: 'PASSED', on: 'score >= pass_threshold', side_effect: 'emit unlock_event(next_module)' },
      { from: 'ASSESSMENT_PENDING', to: 'IN_PROGRESS', on: 'score < pass_threshold', side_effect: 'return result_summary with review_pointers' }
    ]
  },
  server_only_fields: ['correct_option_id', 'explanation_internal', 'session_seed', 'permutation_log'],
  client_visible_fields: ['stem', 'option_text', 'label', 'result_summary', 'review_pointer']
};

export const ESCRITURA_CREATIVA_M1_SLIDES: CourseSlideV1[] = [
  {
    id: 'm1_s1',
    slideNumber: 1,
    moduleId: 'M1',
    title: 'Disparadores Creativos vs. Ideas Desarrolladas',
    subtitle: 'La chispa mínima que enciende el motor narrativo',
    expandedText: 'En el método de Anthony Small, un disparador creativo no es una novela condensada ni una escena terminada: es un estímulo mínimo, una colisión inesperada de percepciones que activa la red de asociaciones de la mente. Confundir el disparador con la idea desarrollada conduce al bloqueo, porque el escritor exige perfección a lo que apenas es un rumor embrionario. Trabajar el disparador consiste en atraparlo en el aire y dejar que el oficio lo convierta en arquitectura dramática.',
    michaelPenNarration: 'Estimado discípulo, soy Michael Pen, anfitrión de Master Pen Training. Le doy la bienvenida a la cátedra de Escritura Creativa del distinguido autor Anthony Small. Grábese este principio desde el primer instante: no espere que la inspiración le entregue una obra terminada. Aprenda a reconocer la chispa diminuta y trátela con la reverencia que merece el fuego.',
    keyAxiom: 'El disparador no explica la historia; enciende la pregunta que el autor deberá responder escribiendo.',
    writingExercise: 'Anota en tu libreta tres estímulos breves percibidos en las últimas 24 horas que hayan provocado en ti una reacción involuntaria.',
    thematicGroup: 'G1_DISPARADORES',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
    estimatedMinutes: 3.5
  },
  {
    id: 'm1_s2',
    slideNumber: 2,
    moduleId: 'M1',
    title: 'Las Cinco Familias de Disparadores',
    subtitle: 'Sensorial, Conceptual, Emocional, Conversacional y Contradictoria',
    expandedText: 'Para dominar la captura, Anthony Small clasifica los disparadores en cinco naturalezas: 1) Sensoriales (un olor a hojalata quemada, una luz rasante); 2) Conceptuales (una paradoja filosófica o dilema moral); 3) Emocionales (una vibración visceral que busca forma); 4) Conversacionales (frases captadas al vuelo entre extraños); y 5) Contradictorias (dos hechos reales que no deberían coexistir, como una biblioteca desierta que aumenta préstamos). Identificar la familia permite aplicar la técnica de incubación adecuada.',
    michaelPenNarration: 'Como Michael Pen, le comparto esta enseñanza cardinal de Anthony Small: cada familia de disparadores habla un dialecto diferente. Si usted identifica de qué familia proviene su chispa, sabrá de inmediato si debe interrogarla con los sentidos, con la dialéctica o con la emoción.',
    keyAxiom: 'Clasificar la chispa no es burocracia; es el diagnóstico que determina su tratamiento literario.',
    writingExercise: 'Busca una frase oída en la calle y determina si su fuerza reside en lo conversacional, lo contradictorio o lo emocional.',
    thematicGroup: 'G1_DISPARADORES',
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=1200&auto=format&fit=crop&q=80',
    estimatedMinutes: 4.0
  },
  {
    id: 'm1_s3',
    slideNumber: 3,
    moduleId: 'M1',
    title: 'El Principio de Fricción Cero',
    subtitle: 'La regla de los diez segundos y el único punto de entrada',
    expandedText: 'El cerebro humano olvida el 90% de los matices de una chispa creativa en menos de diez minutos si no se anota. Por ello, la regla de oro de Anthony Small es la Fricción Cero: capturar en menos de diez segundos sin organizar carpetas, sin corregir ortografía y sin emitir juicios de valor. Toda decisión previa de guardado compite con la chispa y la apaga. Se requiere un ÚNICO punto de entrada (una sola libreta física o una sola app de captura rápida) para erradicar la duda de "¿dónde lo guardo?".',
    michaelPenNarration: 'Atienda bien a esta advertencia: si duda cinco segundos sobre en qué libreta o carpeta archivar una idea, ya perdió la emoción original que la hizo brillar. Un solo lugar, diez segundos y cero juicio, tal como estipula el método de Anthony Small.',
    keyAxiom: 'Durante la captura, el crítico interno debe estar amordazado en el sótano.',
    writingExercise: 'Configura hoy tu único punto de entrada: ten a mano una libreta de bolsillo o una nota fijada en tu móvil lista para abrirse en un toque.',
    thematicGroup: 'G2_FRICCION_CERO',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&auto=format&fit=crop&q=80',
    estimatedMinutes: 3.8
  },
  {
    id: 'm1_s4',
    slideNumber: 4,
    moduleId: 'M1',
    title: 'El Registro de Cuatro Campos',
    subtitle: 'Chispa, Entorno, Mecanismo y Proyección',
    expandedText: 'Para no perder el hilo magnético de la idea cuando se revise semanas después, el protocolo Small exige registrar cuatro coordenadas: 1) Chispa (la frase o imagen desnuda); 2) Entorno (dónde estabas, la hora y tu estado anímico, lo que recrea el contexto psicofísico); 3) Mecanismo (por qué te llamó la atención, la tensión oculta que distingue una anécdota vacía de un motor dramático); y 4) Proyección (hacia qué formato o género intuyes que podría expandirse). Si el tiempo apremia, el campo no negociable es la Chispa.',
    michaelPenNarration: 'El campo Mecanismo es el alma del registro de cuatro campos de Anthony Small. No basta con anotar lo que usted presenció; debe registrar con precisión quirúrgica por qué le sacudió. Eso es lo que le permitirá reencender el motor dramático meses más tarde.',
    keyAxiom: 'El entorno guarda la temperatura de la idea; el mecanismo guarda su veneno.',
    writingExercise: 'Toma la última idea que tuviste y aplícale los cuatro campos: Chispa, Entorno, Mecanismo y Proyección.',
    thematicGroup: 'G3_REGISTRO_4_CAMPOS',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
    estimatedMinutes: 4.2
  },
  {
    id: 'm1_s5',
    slideNumber: 5,
    moduleId: 'M1',
    title: 'Incubación, Filtrado y Archivo Maestro',
    subtitle: 'El reposo de 24 a 72 horas y la transmutación en obra',
    expandedText: 'Una idea recién capturada está rodeada por la euforia química de la novedad. Anthony Small prohíbe desarrollarla de inmediato: debe someterse a un reposo obligatorio de 24 a 72 horas. Durante este enfriamiento, el subconsciente continúa asociando conexiones sin esfuerzo voluntario. Pasado ese tiempo, se revisa con mirada fría: lo que sigue palpitando se promueve al Archivo Maestro clasificado; lo que se desvaneció se descarta sin culpa o se envía a la cantera de fragmentos. Así nace una disciplina de autor indestructible.',
    michaelPenNarration: 'El reposo sagrado es el filtro supremo de la verdad. Una ocurrencia vana se enfría y muere sola en dos días; una idea de verdadero calibre literario adquiere raíces mientras usted duerme. Respete el reposo de veinticuatro a setenta y dos horas.',
    keyAxiom: 'El verdadero escritor no se define por las ideas que acumula, sino por las que tiene el coraje de descartar.',
    writingExercise: 'Revisa notas que escribiste hace un mes: separa sin piedad las que aún conservan tensión de aquellas que ya están muertas.',
    thematicGroup: 'G4_INCUBACION_REPOSO',
    imageUrl: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=1200&auto=format&fit=crop&q=80',
    estimatedMinutes: 4.5
  }
];

export const ESCRITURA_CREATIVA_M1_BANK: AssessmentItemInternal[] = [
  // --- G1_DISPARADORES ---
  {
    item_id: 'M1_Q01',
    group: 'G1_DISPARADORES',
    stem: '¿Qué afirmación distingue con mayor precisión un disparador creativo de una idea desarrollada?',
    options: [
      { option_id: 'M1_Q01.1', option_text: 'El disparador es una idea completa que solo necesita ser transcrita.' },
      { option_id: 'M1_Q01.2', option_text: 'El disparador es una técnica de edición aplicada tras terminar el borrador.' },
      { option_id: 'M1_Q01.3', option_text: 'El disparador es un estímulo mínimo que activa asociaciones; la idea surge después, al trabajarlo.' },
      { option_id: 'M1_Q01.4', option_text: 'El disparador es cualquier idea que se conserva en la memoria más de una semana.' }
    ],
    correct_option_id: 'M1_Q01.3',
    explanation_internal: 'El disparador actúa como chispa inicial mínima que detona asociaciones subconscientes; la idea desarrollada es producto del oficio y la elaboración posterior.',
    review_pointer: 'Revisar Diapositiva 1: Disparadores Creativos vs Ideas Desarrolladas.'
  },
  {
    item_id: 'M1_Q02',
    group: 'G1_DISPARADORES',
    stem: 'Un escritor decide recordar una chispa mentalmente y anotarla por la noche. ¿Qué riesgo principal ignora?',
    options: [
      { option_id: 'M1_Q02.1', option_text: 'Que el disparador caduca en minutos y su matiz original se degrada antes de quedar registrado.' },
      { option_id: 'M1_Q02.2', option_text: 'Que escribir de noche invalida la titularidad de la idea.' },
      { option_id: 'M1_Q02.3', option_text: 'Que la memoria solo retiene disparadores de origen sensorial.' },
      { option_id: 'M1_Q02.4', option_text: 'Que anotar tarde obliga a completar los cuatro campos del registro.' }
    ],
    correct_option_id: 'M1_Q02.1',
    explanation_internal: 'La memoria a corto plazo degrada los detalles sensibles y la temperatura emocional del disparador en minutos si no hay captura inmediata.',
    review_pointer: 'Revisar la degradación de la memoria y el principio de captura en Diapositivas 1 y 3.'
  },
  {
    item_id: 'M1_Q03',
    group: 'G1_DISPARADORES',
    stem: 'Una escritora oye de pasada a dos desconocidos discutir sobre quién heredará un reloj roto, y no deja de pensar en ello. ¿A qué familia de disparadores corresponde principalmente?',
    options: [
      { option_id: 'M1_Q03.1', option_text: 'Sensorial, porque el hecho llegó a ella a través del oído.' },
      { option_id: 'M1_Q03.2', option_text: 'Conceptual, porque toda conversación plantea una pregunta teórica.' },
      { option_id: 'M1_Q03.3', option_text: 'Emocional, porque cualquier discusión genera una sensación que pide forma.' },
      { option_id: 'M1_Q03.4', option_text: 'Conversacional, porque nació de lo que otras personas dijeron, aun sin proponérselo.' }
    ],
    correct_option_id: 'M1_Q03.4',
    explanation_internal: 'La familia conversacional agrupa fragmentos lingüísticos escuchados al vuelo entre terceros que despiertan curiosidad dramática.',
    review_pointer: 'Revisar Diapositiva 2: Las Cinco Familias de Disparadores.'
  },
  {
    item_id: 'M1_Q04',
    group: 'G1_DISPARADORES',
    stem: 'Un escritor descubre una biblioteca que nadie visita pero cuyo préstamo de libros aumenta cada mes. ¿A qué familia corresponde principalmente y por qué?',
    options: [
      { option_id: 'M1_Q04.1', option_text: 'Sensorial, porque se trata de un lugar con textura y olor característicos.' },
      { option_id: 'M1_Q04.2', option_text: 'Contradictoria, porque presenta dos hechos que no deberían coexistir y cuya tensión sugiere un conflicto narrativo.' },
      { option_id: 'M1_Q04.3', option_text: 'Conversacional, porque toda información sobre bibliotecas proviene de terceros.' },
      { option_id: 'M1_Q04.4', option_text: 'Emocional, porque cualquier dato numérico produce una sensación que pide forma.' }
    ],
    correct_option_id: 'M1_Q04.2',
    explanation_internal: 'La familia contradictoria se basa en la fricción entre dos realidades incompatibles que fuerzan una pregunta narrativa inmediata.',
    review_pointer: 'Revisar Diapositiva 2: Familias de Disparadores y Tensión Contradictoria.'
  },
  {
    item_id: 'M1_Q05',
    group: 'G1_DISPARADORES',
    stem: '¿Por qué conviene identificar la familia de un disparador al capturarlo o revisarlo?',
    options: [
      { option_id: 'M1_Q05.1', option_text: 'Porque cada familia exige un género literario obligatorio.' },
      { option_id: 'M1_Q05.2', option_text: 'Porque permite elegir después la técnica de desarrollo más adecuada para esa chispa.' },
      { option_id: 'M1_Q05.3', option_text: 'Porque solo las familias sensorial y emocional pueden convertirse en narrativa.' },
      { option_id: 'M1_Q05.4', option_text: 'Porque la familia determina cuántos días debe reposar la idea.' }
    ],
    correct_option_id: 'M1_Q05.2',
    explanation_internal: 'Identificar la familia orienta las preguntas de profundización y el abordaje técnico durante la fase de desarrollo.',
    review_pointer: 'Revisar Diapositiva 2: Clasificación de Disparadores.'
  },

  // --- G2_FRICCION_CERO ---
  {
    item_id: 'M1_Q06',
    group: 'G2_FRICCION_CERO',
    stem: '¿Por qué el principio de fricción cero prohíbe organizar o juzgar durante la captura?',
    options: [
      { option_id: 'M1_Q06.1', option_text: 'Porque la organización inmediata genera archivos que ocupan demasiado espacio.' },
      { option_id: 'M1_Q06.2', option_text: 'Porque juzgar una idea la vuelve irrecuperable en etapas posteriores.' },
      { option_id: 'M1_Q06.3', option_text: 'Porque ambas operaciones compiten con el acto de registrar, reducen la frecuencia de captura y sofocan la asociación espontánea.' },
      { option_id: 'M1_Q06.4', option_text: 'Porque el orden temático es incompatible con la clasificación cronológica.' }
    ],
    correct_option_id: 'M1_Q06.3',
    explanation_internal: 'El juicio analítico activa el hemisferio crítico y frena en seco el flujo asociativo libre.',
    review_pointer: 'Revisar Diapositiva 3: Principio de Fricción Cero.'
  },
  {
    item_id: 'M1_Q07',
    group: 'G2_FRICCION_CERO',
    stem: 'Un escritor reparte sus ideas entre una libreta, mensajes a sí mismo y papeles sueltos, y debe decidir cada vez dónde guardarlas. ¿Qué regla incumple?',
    options: [
      { option_id: 'M1_Q07.1', option_text: 'La del único punto de entrada, que elimina la decisión de dónde guardar.' },
      { option_id: 'M1_Q07.2', option_text: 'La del reposo de 24 a 72 horas.' },
      { option_id: 'M1_Q07.3', option_text: 'La de promover ideas al archivo maestro.' },
      { option_id: 'M1_Q07.4', option_text: 'La de completar el campo Proyección.' }
    ],
    correct_option_id: 'M1_Q07.1',
    explanation_internal: 'Tener múltiples bandejas fragmenta la atención y eleva la fricción; un único punto de entrada canaliza todo sin vacilar.',
    review_pointer: 'Revisar Diapositiva 3: Regla del Único Punto de Entrada.'
  },
  {
    item_id: 'M1_Q08',
    group: 'G2_FRICCION_CERO',
    stem: '¿Cuál es el propósito del límite de diez segundos para capturar?',
    options: [
      { option_id: 'M1_Q08.1', option_text: 'Obligar a escribir ideas breves, porque las extensas carecen de valor.' },
      { option_id: 'M1_Q08.2', option_text: 'Dejar la idea clasificada por tema desde el primer momento.' },
      { option_id: 'M1_Q08.3', option_text: 'Medir la velocidad de escritura del autor para ajustar su rendimiento.' },
      { option_id: 'M1_Q08.4', option_text: 'Mantener el costo de capturar tan bajo que registrar sea más probable que olvidar.' }
    ],
    correct_option_id: 'M1_Q08.4',
    explanation_internal: 'Reducir el umbral de esfuerzo a diez segundos hace que registrar se convierta en un reflejo instantáneo antes de que la chispa se disipe.',
    review_pointer: 'Revisar Diapositiva 3: La Regla de los Diez Segundos.'
  },

  // --- G3_REGISTRO_4_CAMPOS ---
  {
    item_id: 'M1_Q09',
    group: 'G3_REGISTRO_4_CAMPOS',
    stem: 'Dentro del Registro de Cuatro Campos, ¿qué función cumple específicamente el campo Mecanismo?',
    options: [
      { option_id: 'M1_Q09.1', option_text: 'Describir el lugar físico y la hora de la captura.' },
      { option_id: 'M1_Q09.2', option_text: 'Enumerar los recursos necesarios para presentar el texto resultante.' },
      { option_id: 'M1_Q09.3', option_text: 'Explicar por qué la chispa llamó la atención del escritor, lo que distingue una curiosidad pasajera de un motor narrativo.' },
      { option_id: 'M1_Q09.4', option_text: 'Calcular la extensión de la obra terminada.' }
    ],
    correct_option_id: 'M1_Q09.3',
    explanation_internal: 'El mecanismo formula la hipótesis de tracción: qué resorte psicológico o dramático hizo saltar la chispa.',
    review_pointer: 'Revisar Diapositiva 4: El Registro de Cuatro Campos y el Mecanismo.'
  },
  {
    item_id: 'M1_Q10',
    group: 'G3_REGISTRO_4_CAMPOS',
    stem: 'Si el tiempo apremia al registrar una idea, ¿qué campo debe completarse como mínimo?',
    options: [
      { option_id: 'M1_Q10.1', option_text: 'Chispa, porque los demás campos pueden reconstruirse durante la revisión.' },
      { option_id: 'M1_Q10.2', option_text: 'Proyección, porque define el destino de la idea y sin él no hay archivo posible.' },
      { option_id: 'M1_Q10.3', option_text: 'Entorno, porque el contexto se pierde antes que la idea.' },
      { option_id: 'M1_Q10.4', option_text: 'Mecanismo, porque sin él la idea no puede ser reposada.' }
    ],
    correct_option_id: 'M1_Q10.1',
    explanation_internal: 'La chispa desnuda es el núcleo irreemplazable; los campos complementarios pueden inferirse o completarse posteriormente.',
    review_pointer: 'Revisar Diapositiva 4: Prioridad Operativa del Registro de Cuatro Campos.'
  },
  {
    item_id: 'M1_Q11',
    group: 'G3_REGISTRO_4_CAMPOS',
    stem: '¿Por qué el campo Entorno incluye el estado de ánimo y el contexto de la captura?',
    options: [
      { option_id: 'M1_Q11.1', option_text: 'Para validar legalmente los derechos de autor de la anotación.' },
      { option_id: 'M1_Q11.2', option_text: 'Porque el estado psicofísico permite revivir la resonancia original de la chispa al revisarla semanas después.' },
      { option_id: 'M1_Q11.3', option_text: 'Para calcular la productividad del escritor según las horas del día.' },
      { option_id: 'M1_Q11.4', option_text: 'Para descartar automáticamente las ideas anotadas en momentos de fatiga.' }
    ],
    correct_option_id: 'M1_Q11.2',
    explanation_internal: 'El entorno preserva las coordenadas emocionales que reactivan la memoria sensorial cuando se abre el cuaderno en frío.',
    review_pointer: 'Revisar Diapositiva 4: El Campo Entorno y la Resonancia Sensorial.'
  },

  // --- G4_INCUBACION_REPOSO ---
  {
    item_id: 'M1_Q12',
    group: 'G4_INCUBACION_REPOSO',
    stem: '¿Por qué Anthony Small prescribe un período de reposo de 24 a 72 horas antes de procesar una chispa?',
    options: [
      { option_id: 'M1_Q12.1', option_text: 'Para enfriar la euforia inicial y permitir que el subconsciente trabaje sin la presión del juicio inmediato.' },
      { option_id: 'M1_Q12.2', option_text: 'Porque las leyes editoriales exigen dejar constancia fehaciente de la fecha.' },
      { option_id: 'M1_Q12.3', option_text: 'Para asegurar que el texto sea leído previamente por un editor profesional.' },
      { option_id: 'M1_Q12.4', option_text: 'Para que la idea pierda todo vínculo con la experiencia real del autor.' }
    ],
    correct_option_id: 'M1_Q12.1',
    explanation_internal: 'El reposo disuelve la trampa de la novedad artificial y permite que solo las ideas con verdadera fuerza dramática mantengan su magnetismo.',
    review_pointer: 'Revisar Diapositiva 5: Incubación y Reposo Sagrado.'
  },
  {
    item_id: 'M1_Q13',
    group: 'G4_INCUBACION_REPOSO',
    stem: '¿Qué síntoma inequívoco demuestra que una chispa ha superado con éxito la fase de incubación?',
    options: [
      { option_id: 'M1_Q13.1', option_text: 'Que el autor ha olvidado por completo el contexto en que la anotó.' },
      { option_id: 'M1_Q13.2', option_text: 'Que al releerla en frío sigue generando preguntas, imágenes y deseo de escribir sobre ella.' },
      { option_id: 'M1_Q13.3', option_text: 'Que ya cuenta con un número exacto de páginas planificadas.' },
      { option_id: 'M1_Q13.4', option_text: 'Que ha sido aprobada por un lector beta externo.' }
    ],
    correct_option_id: 'M1_Q13.2',
    explanation_internal: 'Si la chispa sobrevive al enfriamiento y detona nuevas preguntas e impulsos plásticos, califica como candidata al desarrollo.',
    review_pointer: 'Revisar Diapositiva 5: Síntomas de Supervivencia de una Idea.'
  },

  // --- G5_FILTRADO_SELECCION ---
  {
    item_id: 'M1_Q14',
    group: 'G5_FILTRADO_SELECCION',
    stem: 'Al revisar las notas tras el período de reposo, el autor descubre que una idea ya no le despierta emoción alguna. ¿Cuál es la conducta recomendada?',
    options: [
      { option_id: 'M1_Q14.1', option_text: 'Obligarse a escribir una novela completa sobre ella para no desperdiciar el esfuerzo.' },
      { option_id: 'M1_Q14.2', option_text: 'Descartarla o enviarla a la cantera de fragmentos sin culpa, liberando ancho de banda mental.' },
      { option_id: 'M1_Q14.3', option_text: 'Reescribirla inmediatamente en un formato más extenso para forzar el interés.' },
      { option_id: 'M1_Q14.4', option_text: 'Consultar de inmediato a tres colegas para que decidan por el autor.' }
    ],
    correct_option_id: 'M1_Q14.2',
    explanation_internal: 'El descarte higiénico es parte vital del oficio: acumular ideas muertas por apego egoico bloquea la entrada de nuevas chispas fértiles.',
    review_pointer: 'Revisar Diapositiva 5: El Arte del Descarte y la Cantera de Fragmentos.'
  },
  {
    item_id: 'M1_Q15',
    group: 'G5_FILTRADO_SELECCION',
    stem: '¿Qué criterio separa una simple ocurrencia cotidiana de una idea digna de ser promovida al Archivo Maestro?',
    options: [
      { option_id: 'M1_Q15.1', option_text: 'Que contenga un conflicto no resuelto que desafía la cosmovisión del autor o del lector.' },
      { option_id: 'M1_Q15.2', option_text: 'Que pueda resumirse exactamente en tres palabras clave.' },
      { option_id: 'M1_Q15.3', option_text: 'Que pertenezca exclusivamente al género de ciencia ficción o misterio.' },
      { option_id: 'M1_Q15.4', option_text: 'Que haya sido anotada en una libreta de piel italiana.' }
    ],
    correct_option_id: 'M1_Q15.1',
    explanation_internal: 'La presencia de una contradicción o tensión irresuelta es la materia prima de la literatura duradera.',
    review_pointer: 'Revisar Diapositiva 5: Criterios de Promoción al Archivo Maestro.'
  },

  // --- G6_ARCHIVO_MAESTRO ---
  {
    item_id: 'M1_Q16',
    group: 'G6_ARCHIVO_MAESTRO',
    stem: '¿Cuál es la función arquitectónica del Archivo Maestro en el método de Anthony Small?',
    options: [
      { option_id: 'M1_Q16.1', option_text: 'Servir de repositorio estructurado y clasificado donde las chispas maduras aguardan su fase de desarrollo.' },
      { option_id: 'M1_Q16.2', option_text: 'Publicar automáticamente los manuscritos en plataformas de autopublicación.' },
      { option_id: 'M1_Q16.3', option_text: 'Sustituir la escritura diaria por la catalogación interminable de fichas.' },
      { option_id: 'M1_Q16.4', option_text: 'Guardar exclusivamente correcciones gramaticales y de estilo.' }
    ],
    correct_option_id: 'M1_Q16.1',
    explanation_internal: 'El Archivo Maestro no es un cementerio de notas sino una despensa organizada de ingredientes probados listos para el ensamblaje.',
    review_pointer: 'Revisar Diapositiva 5: El Archivo Maestro como Despensa Activa.'
  },
  {
    item_id: 'M1_Q17',
    group: 'G6_ARCHIVO_MAESTRO',
    stem: '¿Por qué se aconseja fechar e indexar por etiquetas temáticas las entradas del Archivo Maestro?',
    options: [
      { option_id: 'M1_Q17.1', option_text: 'Para facilitar la colisión cruzada de ideas dispares cuando se busca destrabar un proyecto.' },
      { option_id: 'M1_Q17.2', option_text: 'Para cumplir con los estándares ISO de gestión documental corporativa.' },
      { option_id: 'M1_Q17.3', option_text: 'Para borrar automáticamente las notas que superen los doce meses.' },
      { option_id: 'M1_Q17.4', option_text: 'Para impedir que otros autores consulten los manuscritos.' }
    ],
    correct_option_id: 'M1_Q17.1',
    explanation_internal: 'Las etiquetas permiten cruzar chispas nacidas en momentos distintos para generar combinaciones narrativas inéditas.',
    review_pointer: 'Revisar Diapositiva 5: Indexación Cruzada y Polinización de Ideas.'
  },

  // --- G7_DESARROLLO_EXPANSION ---
  {
    item_id: 'M1_Q18',
    group: 'G7_DESARROLLO_EXPANSION',
    stem: '¿En qué consiste la técnica de "Preguntas Generativas" al expandir una chispa aprobada?',
    options: [
      { option_id: 'M1_Q18.1', option_text: 'Someter la chispa a preguntas de causa, consecuencia y peor escenario posible para desplegar la trama.' },
      { option_id: 'M1_Q18.2', option_text: 'Hacer encuestas en redes sociales antes de escribir la primera línea.' },
      { option_id: 'M1_Q18.3', option_text: 'Cuestionar si el autor tiene derecho moral a escribir ficción.' },
      { option_id: 'M1_Q18.4', option_text: 'Pedir al lector que elija el final de la historia en cada capítulo.' }
    ],
    correct_option_id: 'M1_Q18.1',
    explanation_internal: 'Preguntas como "¿Qué pasaría si...?", "¿Qué es lo peor que podría suceder a continuación?" y "¿Quién tiene más que perder?" abren el mapa dramático.',
    review_pointer: 'Revisar Diapositiva 5: Técnicas de Expansión y Preguntas Generativas.'
  },
  {
    item_id: 'M1_Q19',
    group: 'G7_DESARROLLO_EXPANSION',
    stem: '¿Qué sucede cuando se fuerza el desarrollo de un disparador antes de que defina su conflicto central?',
    options: [
      { option_id: 'M1_Q19.1', option_text: 'El autor suele caer en la divagación descriptiva y el abandono del borrador a mitad del camino.' },
      { option_id: 'M1_Q19.2', option_text: 'La obra se publica automáticamente con mayor éxito comercial.' },
      { option_id: 'M1_Q19.3', option_text: 'Los personajes resuelven el conflicto sin intervención del narrador.' },
      { option_id: 'M1_Q19.4', option_text: 'Se acelera el ritmo narrativo sin costo alguno.' }
    ],
    correct_option_id: 'M1_Q19.1',
    explanation_internal: 'Escribir sin un vector de conflicto claro agota la energía del autor en decorados estériles y conduce a la parálisis narrativa.',
    review_pointer: 'Revisar Diapositiva 1 y 5: Maduración del Conflicto Central.'
  },
  {
    item_id: 'M1_Q20',
    group: 'G7_DESARROLLO_EXPANSION',
    stem: '¿Cuál es la relación definitiva entre la captura rigurosa de disparadores y la libertad creativa del autor?',
    options: [
      { option_id: 'M1_Q20.1', option_text: 'La captura metódica nutre un pozo constante de recursos que libera al autor de la tiranía de la página en blanco.' },
      { option_id: 'M1_Q20.2', option_text: 'El método ahoga la inspiración genuina y debe reemplazarse por el azar absoluto.' },
      { option_id: 'M1_Q20.3', option_text: 'Solo los escritores principiantes necesitan capturar disparadores con método.' },
      { option_id: 'M1_Q20.4', option_text: 'La libertad creativa prohíbe todo registro escrito antes de la publicación.' }
    ],
    correct_option_id: 'M1_Q20.1',
    explanation_internal: 'La estructura y el hábito sistemático son el andamiaje que permite a la imaginación operar con audacia y serenidad.',
    review_pointer: 'Revisar Diapositiva 1 y Axioma Central del Módulo 1.'
  }
];
