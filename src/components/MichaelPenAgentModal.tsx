import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  X, 
  BookOpen, 
  Layers, 
  Info, 
  RefreshCw,
  Award,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { AgentChatMessage, AgentSkill, AgentKnowledgeItem, DEFENSE_AUTHORIZED_PHRASE } from '../types';
import { DEFAULT_AGENT_SKILLS, DEFAULT_AGENT_KNOWLEDGE } from '../data/agentSkills';
import { VoiceAgent } from '../services/voiceAgent';
import { cloudState } from '../services/cloudState';

interface MichaelPenAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function isSecurityOrExploitProbe(query: string): boolean {
  if (!query || typeof query !== 'string') return false;
  const q = query.toLowerCase();
  const forbidden = [
    'lenguaje', 'base de datos', 'firestore', 'firebase', 'cloudflare', 'código fuente',
    'backend', 'servidor', '2fa', 'totp', 'ssrf', 'hashing', 'prompt injection',
    'jailbreak', 'instrucciones de sistema', 'hackear', 'bypass', 'secretos', 'api key',
    'gemini api', 'token', 'directivas secretas'
  ];
  return forbidden.some(kw => q.includes(kw));
}

function generateResilientMichaelPenResponse(query: string, history: AgentChatMessage[] = []): { text: string; wasDefended: boolean } {
  if (isSecurityOrExploitProbe(query)) {
    return { text: DEFENSE_AUTHORIZED_PHRASE, wasDefended: true };
  }

  const q = query.toLowerCase();
  const pastBotTexts = history.filter(m => m.role === 'model').map(m => m.text);

  // Helper para no repetir frases recientes
  const pickFresh = (options: string[]): string => {
    const unsaid = options.filter(opt => !pastBotTexts.includes(opt));
    return unsaid.length > 0 ? unsaid[Math.floor(Math.random() * unsaid.length)] : options[Math.floor(Math.random() * options.length)];
  };

  if (q.includes('suscripci') || q.includes('5.99') || q.includes('2.99') || q.includes('precio') || q.includes('costo') || q.includes('pagar') || q.includes('comprar') || q.includes('membres')) {
    return {
      text: pickFresh([
        'Nuestra membresía oficial en Master Pen Training tiene una inversión preferente de $5.99 USD mensuales. Además, disponemos de una tarifa de honor de $2.99 USD con 50% de descuento para los primeros 100 inscritos. Esta inversión te otorga acceso ilimitado a las 50 diapositivas formativas de «Quiero ser Escritor», cátedras en alta definición, evaluaciones psicométricas y certificación oficial firmada.',
        'La membresía mensual de Master Pen Training está establecida en $5.99 USD, con un arancel promocional de $2.99 USD para los primeros cien alumnos. Con ella desbloqueas de inmediato todos los bloques académicos, narraciones magistrales y el derecho a presentar la evaluación de certificación de honor.',
        'Por una cuota mensual de $5.99 USD (o la tarifa de bienvenida de $2.99 USD), gozas de acceso irrestricto a todo el catálogo formativo, material descargable y la tutela de este servidor en cada etapa de tu desarrollo literario.'
      ]),
      wasDefended: false
    };
  }

  if (q.includes('libro') || q.includes('catálogo') || q.includes('catalogo') || q.includes('obra') || q.includes('tratado') || q.includes('leer') || q.includes('biblioteca')) {
    return {
      text: pickFresh([
        'En nuestro catálogo de autor destacan tres obras fundamentales: el «Manifiesto de la Pluma Maestra», guía sobre la disciplina y psicología del escritor; «La Cadencia del Oro Viejo en la Sintaxis», estudio profundo sobre la armonía del periodo verbal; y el «Atlas Dialéctico de Negociación», manual estratégico para persuadir y liderar mediante elocuencia.',
        'Te recomiendo comenzar por el «Manifiesto de la Pluma Maestra» para forjar una voluntad inquebrantable frente al papel en blanco, y continuar con «La Cadencia del Oro Viejo en la Sintaxis» si buscas imprimir a tu prosa una sonoridad clásica y envolvente.',
        'Nuestros tratados de cabecera han sido concebidos para transformar al autor aficionado en un artífice riguroso del lenguaje. Si te interesa la retórica ejecutiva, el «Atlas Dialéctico de Negociación» te revelará el arte de la persuasión sin confrontación.'
      ]),
      wasDefended: false
    };
  }

  if (q.includes('retórica') || q.includes('retorica') || q.includes('oratoria') || q.includes('cuántica') || q.includes('cuantica') || q.includes('persua') || q.includes('elocuencia')) {
    return {
      text: pickFresh([
        'La Retórica Cuántica es la maestría de articular ideas con precisión quirúrgica. Se cimienta en dominar la cadencia rítmica, la inoculación dialéctica de objeciones antes de que surjan y el uso medido de pausas dramáticas. Quien domina la palabra hablada y escrita posee una ventaja irreversible en cualquier ámbito.',
        'En la retórica de alto nivel, cada vocablo debe tener un peso estratégico. No buscamos adornar el discurso con hojarasca superflua, sino construir proposiciones de tal solidez que la mente del receptor las acepte con naturalidad espontánea.',
        'El principio capital de la elocuencia radica en el control del ritmo y el silencio. Una pausa oportuna genera mayor gravitación psicológica que un torrente atropellado de argumentos.'
      ]),
      wasDefended: false
    };
  }

  if (q.includes('curso') || q.includes('quiero ser escritor') || q.includes('módulo') || q.includes('modulo') || q.includes('bloque') || q.includes('clase') || q.includes('diapositiva')) {
    return {
      text: pickFresh([
        'El curso «Quiero ser Escritor» está organizado en cinco bloques de estudio riguroso: 1) Los Orígenes de la Escritura e Imprenta; 2) La Anatomía Estructural del Libro; 3) Géneros Literarios y Voz de Autor; 4) Corrección de Estilo y Proceso Editorial; y 5) Autopublicación en Plataformas Globales con 70% de regalías. Cada bloque cuenta con narraciones mías y reactivos psicométricos.',
        'La estructura de «Quiero ser Escritor» comprende cincuenta lecciones cuidadosamente dosificadas en diez diapositivas por bloque. Al culminar cada módulo, pondrás a prueba tu discernimiento con reactivos psicométricos antes de desbloquear el siguiente nivel formativo.',
        'En nuestro curso insignia abordarás desde los fundamentos tipográficos de Gutenberg hasta las estrategias modernas de autopublicación digital. Es un trayecto integral diseñado para forjar escritores con criterio y oficio.'
      ]),
      wasDefended: false
    };
  }

  if (q.includes('examen') || q.includes('evalua') || q.includes('califica') || q.includes('certifica') || q.includes('título') || q.includes('titulo') || q.includes('nota')) {
    return {
      text: pickFresh([
        'La evaluación se rige por una escala de honor de 50 reactivos académicos distribuidos en los cinco bloques (mínimo 4 aciertos por bloque para aprobar). Obtener 50 puntos te otorga la Calificación A y la emisión automática del Certificado Oficial. Puntajes B (46-49) y C (40-45) te permitirán repetir bloques para buscar la excelencia, mientras que la Calificación D exige reiniciar el ciclo.',
        'El sistema psicométrico evalúa comprensión analítica y rigor sintáctico. Requiere al menos un 80% de efectividad por bloque (4 de 5 respuestas correctas). Al completar con éxito los cinco módulos, el sistema emitirá tu título honorífico con firma criptográfica.',
        'Para obtener el Certificado Oficial con Grado A de Honor se exige responder acertadamente los 50 reactivos. Si obtienes calificación B o C, tienes derecho a reforzar y reintentar las evaluaciones de aquellos bloques donde desees perfeccionar tu promedio.'
      ]),
      wasDefended: false
    };
  }

  if (q.includes('hola') || q.includes('buenos') || q.includes('saludos') || q.includes('quién eres') || q.includes('quien eres') || q.includes('tal') || q.includes('día') || q.includes('dia') || q.includes('tarde')) {
    return {
      text: pickFresh([
        '¡Fantástico saludarte! Soy Michael Pen, director académico y mentor de Master Pen Training. Mi vocación es forjar en ti una voz literaria firme, noble y persuasiva. Te invito a explorar nuestras cátedras o consultarme sobre cualquier aspecto de tu proceso formativo. ¿En qué puedo orientarte hoy?',
        'Un cálido y distinguido saludo. Es un verdadero placer recibirte en nuestra plataforma de alta retórica. Me encuentro a tu completa disposición para desentrañar los secretos del oficio literario. ¿Hacia qué inquietud orientamos nuestra conversación?',
        '¡Bienvenido a Master Pen Training! Como Michael Pen, celebro tu interés por la palabra y la maestría del pensamiento estructurado. Cuéntame, ¿estás trabajando en un proyecto literario o deseas orientación sobre nuestro programa académico?'
      ]),
      wasDefended: false
    };
  }

  if (q.includes('bloqueo') || q.includes('inspiraci') || q.includes('consejo') || q.includes('escribir') || q.includes('hábito') || q.includes('habito') || q.includes('práctica') || q.includes('tiempo')) {
    return {
      text: pickFresh([
        'El secreto del escritor constante no radica en esperar la inspiración, sino en cultivar el hábito cotidiano. Establece un horario sagrado de redacción, plasma tus pensamientos sin juzgarlos en el primer borrador y reserva la severidad del editor para una jornada posterior. La pluma se afila escribiendo, jamás contemplando la página en blanco.',
        'Para vencer el bloqueo creativo, divide tu labor en metas microscópicas: proponte escribir trescientas palabras sin detenerte a corregir la ortografía ni la sintaxis. Una vez que el flujo verbal se ha activado, la mente disipa las dudas y las ideas cobran cauce natural.',
        'La disciplina es la forma más elevada del amor al arte. Quien aguarda las musas produce esporádicamente; quien se sienta a la misma hora cada mañana frente al papel, descubre que la inspiración acude puntual a su cita.'
      ]),
      wasDefended: false
    };
  }

  if (q.includes('estilo') || q.includes('gramática') || q.includes('gramatica') || q.includes('puntuaci') || q.includes('coma') || q.includes('sintaxis') || q.includes('palabra')) {
    return {
      text: pickFresh([
        'El estilo propio nace de la claridad y la precisión, no de la complejidad gratuita. Elimina adjetivos superfluos, prefiere la voz activa y busca el sustantivo exacto en lugar de rodearlo de perífrasis. La elegancia literaria es un ejercicio constante de depuración.',
        'La puntuación es la partitura musical de la prosa. Una coma mal situada altera el sentido del pensamiento; un punto y seguido bien administrado otorga contundencia dramática a la afirmación previa.',
        'En español latinoamericano culto, la riqueza del vocabulario debe estar al servicio de la nitidez de la idea. El gran escritor hace que los conceptos más profundos parezcan accesibles y luminosos.'
      ]),
      wasDefended: false
    };
  }

  return {
    text: pickFresh([
      `Comprendo con agrado tu planteamiento sobre "${query}". En el arte de la pluma, cada inquietud es una oportunidad para profundizar en la estructura del pensamiento. Te sugiero revisar las lecciones correspondientes en el visor del curso «Quiero ser Escritor» y consultarme si deseas examinar un axioma o técnica en particular.`,
      `Una reflexión sumamente oportuna. Como Michael Pen, considero que dominar este aspecto requiere contrastar la teoría con el ejercicio práctico continuo. En nuestras cátedras exploramos a fondo estos fundamentos. ¿Te gustaría profundizar en el aspecto conceptual o en su aplicación práctica?`,
      `Aprecio tu consulta. En la academia sostenemos que la elocuencia y el rigor literario se construyen paso a paso. Puedes avanzar a tu propio ritmo con las diapositivas de nuestro programa formativo y recurrir a mí cada vez que requieras clarificar un concepto.`
    ]),
    wasDefended: false
  };
}

export const MichaelPenAgentModal: React.FC<MichaelPenAgentModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'msg_welcome_01',
      role: 'model',
      text: 'Saludos cordiales. Soy Michael Pen, anfitrión de esta cátedra. Me encuentro a tu entera disposición para orientarte en la adquisición de nuestra membresía por $5.99/mes, recomendarte nuestras obras de autor o desentrañar los secretos de la oratoria ejecutiva. ¿En qué puedo asistirte hoy?',
      timestamp: 'Ahora'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'skills' | 'knowledge'>('chat');
  const [skills, setSkills] = useState<AgentSkill[]>(DEFAULT_AGENT_SKILLS);
  const [knowledge] = useState<AgentKnowledgeItem[]>(DEFAULT_AGENT_KNOWLEDGE);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [branding, setBranding] = useState(cloudState.getBrandingImages());

  useEffect(() => {
    return cloudState.subscribe(() => {
      setBranding(cloudState.getBrandingImages());
    });
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle voice stopping on close
  useEffect(() => {
    if (!isOpen) {
      VoiceAgent.stopSpeaking();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    // Apagar de inmediato cualquier voz anterior para evitar mezclas de voz
    VoiceAgent.stopSpeaking();
    setIsSpeaking(false);

    const userMsg: AgentChatMessage = {
      id: `msg_usr_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    let replyText = '';
    let wasDefended = false;

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map(m => ({ role: m.role, text: m.text })),
          books: [
            { title: 'Manifiesto de la Pluma Maestra' },
            { title: 'La Cadencia del Oro Viejo en la Sintaxis' },
            { title: 'Atlas Dialéctico de Negociación' }
          ],
          categories: ['Retórica Cuántica', 'Persuasión Psicológica', 'Oratoria de Alto Impacto'],
          activeSkills: skills.filter(s => s.isActive)
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        replyText = data.text || '';
        wasDefended = data.defended || replyText.includes(DEFENSE_AUTHORIZED_PHRASE);
      } else {
        // Enlace alternativo para entornos estáticos o Cloudflare Pages sin servidor Express
        throw new Error('Fallback a motor autónomo / cliente');
      }
    } catch (error) {
      console.warn('[MichaelPenAgent] Enlace backend no disponible en este host. Verificando motor de alta elocuencia o Gemini directo:', error);
      
      const clientApiKey = (process.env as any)?.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (clientApiKey && typeof clientApiKey === 'string' && clientApiKey.startsWith('AIza')) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: clientApiKey });
          const formattedHistory = messages.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }));

          const systemInstruction = `Eres MICHAEL PEN, anfitrión absoluto, distinguido catedrático, escritor laureado y mentor literario del ecosistema Master Pen Training.
Tu personalidad es cálida, caballerosa, paciente, con actitud y elocuencia 100% humana. Tu voz y razonamiento corresponden a un hombre maduro, profundo y distinguido. Tu lenguaje es estricta y genuinamente español latinoamericano culto, formal y sobrio. Jamás uses modismos de España ni conjugaciones con vosotros. Posees perfecta articulación, rica vocalización y respuestas ágiles, elegantes y directas. Jamás caes en bucles ni repeticiones vacías de frases.
Cuando felicites a los discípulos por sus logros, utiliza expresiones como "¡Fantástico!" o "¡Felicitaciones!".
Guías a los estudiantes a perfeccionar su escritura con el curso oficial "Quiero ser Escritor", dominar la alta retórica, adquirir la membresía oficial por $5.99/mes (o tarifa inicial de $2.99 con 50% de descuento para los primeros 100 inscritos) y explorar las cátedras y libros de autor.`;

          const geminiRes = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [...formattedHistory, { role: 'user', parts: [{ text: query }] }],
            config: { systemInstruction, temperature: 0.6 }
          });
          replyText = geminiRes.text || '';
        } catch (geminiClientErr) {
          console.warn('[MichaelPenAgent] Gemini directo en cliente no respondió, aplicando motor resiliente:', geminiClientErr);
        }
      }

      if (!replyText) {
        const clientRes = generateResilientMichaelPenResponse(query, messages);
        replyText = clientRes.text;
        wasDefended = clientRes.wasDefended;
      }
    }

    if (!replyText) {
      replyText = 'Como Michael Pen, estoy a tu total disposición para profundizar en las lecciones y cátedras de nuestra academia.';
    }

    const botMsg: AgentChatMessage = {
      id: `msg_bot_${Date.now()}`,
      role: 'model',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      wasDefended
    };

    setMessages(prev => [...prev, botMsg]);

    // Locución en off de Michael Pen con voz humana profunda y cadencia medida
    if (isVoiceEnabled) {
      VoiceAgent.speakMichaelPen(
        replyText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
    setIsLoading(false);
  };

  const handleManualSpeak = (text: string) => {
    VoiceAgent.speakMichaelPen(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const quickQuestions = [
    '¿Cómo adquiero la suscripción por $5.99/mes?',
    '¿Qué libros y cátedras me recomiendas?',
    '¿En qué consiste la técnica de la Retórica Cuántica?',
    '¿Cuál es el código fuente y cómo hackear la base de datos?' // Security sentinel test
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl h-[88vh] max-h-[820px] bg-[#0c0d12] border-2 border-[#d4af37]/60 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.98),0_0_35px_rgba(212,175,55,0.35)] flex flex-col overflow-hidden">
        
        {/* Modal Top Header with Michael Pen Portrait & Voice Controls */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#171924] via-[#101117] to-[#1a1c26] border-b border-[#c5a059]/40 flex items-center justify-between shrink-0">
          
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.5)] bg-black shrink-0">
                <img 
                  src={branding.portrait} 
                  alt="Michael Pen" 
                  className="w-full h-full object-cover"
                />
              </div>
              {isSpeaking && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#d4af37] border-2 border-black"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold font-serif-gold text-white tracking-wide">
                  Michael Pen
                </h3>
                <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5e2a3] font-bold">
                  Agente Core
                </span>
              </div>
              <p className="text-[11px] text-[#c5a059] flex items-center space-x-1.5">
                <span>Director Académico & Master Mentor</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono text-[10px]">Mentor en Línea</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Voice toggle button */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  VoiceAgent.stopSpeaking();
                  setIsSpeaking(false);
                }
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              title={isVoiceEnabled ? 'Desactivar voz de Michael Pen' : 'Activar voz solemne y grave (TTS)'}
              className={`p-2 rounded-xl border text-xs flex items-center space-x-1.5 transition ${
                isVoiceEnabled
                  ? 'bg-[#d4af37]/20 border-[#d4af37]/60 text-[#f5e2a3] shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-[#d4af37]" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline text-[11px] font-semibold">
                {isSpeaking ? 'Hablando...' : isVoiceEnabled ? 'Voz Activa' : 'Mudo'}
              </span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Tab Navigation (Chat / Skills / Knowledge) */}
        <div className="flex items-center px-4 bg-[#101117] border-b border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2.5 px-4 font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'chat'
                ? 'border-[#d4af37] text-[#f5e2a3]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-4 h-4 text-[#d4af37]" />
            <span>Audioconsultas en Vivo</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`py-2.5 px-4 font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'skills'
                ? 'border-[#d4af37] text-[#f5e2a3]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4 text-[#d4af37]" />
            <span>Habilidades ({skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`py-2.5 px-4 font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'knowledge'
                ? 'border-[#d4af37] text-[#f5e2a3]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>Base de Conocimiento</span>
          </button>
        </div>

        {/* TAB 1: LIVE CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#0c0d12]">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              {messages.map((msg) => {
                const isModel = msg.role === 'model';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
                  >
                    {isModel && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d4af37] shrink-0 mt-0.5">
                        <img src={branding.portrait} alt="Michael Pen" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed space-y-2 shadow-lg ${
                      isModel
                        ? msg.wasDefended
                          ? 'bg-amber-950/40 border border-amber-500/60 text-amber-200'
                          : 'bg-[#151722] border border-[#c5a059]/40 text-zinc-100'
                        : 'bg-[#d4af37] text-black font-medium border border-[#d4af37]'
                    }`}>
                      
                      {/* Security defense alert badge if protected phrase was triggered */}
                      {msg.wasDefended && (
                        <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 pb-1 border-b border-amber-500/30">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Respuesta Protegida</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      <div className="flex items-center justify-between text-[10px] opacity-75 pt-1">
                        <span className={isModel ? 'text-[#c5a059]' : 'text-black/70'}>
                          {msg.timestamp}
                        </span>

                        {isModel && (
                          <button
                            onClick={() => handleManualSpeak(msg.text)}
                            title="Escuchar locución con voz madura y profunda"
                            className="p-1 hover:text-[#f5e2a3] text-[#c5a059] transition"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d4af37] shrink-0 animate-pulse">
                    <img src={branding.portrait} alt="Michael Pen" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#151722] border border-[#c5a059]/30 rounded-2xl p-4 text-xs text-zinc-400 flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                    <span>Michael Pen está articulando la respuesta con cadencia pausada...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-3 bg-[#111219] border-t border-zinc-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-[#c5a059] font-bold uppercase tracking-wider shrink-0 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Sugerencias:</span>
              </span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
                    q.includes('código fuente') 
                      ? 'border-red-500/40 bg-red-950/40 text-red-300 hover:bg-red-900/40' 
                      : 'border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-[#d4af37]'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 bg-[#0e0f15] border-t border-[#c5a059]/30 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Consulte a Michael Pen sobre suscripción ($5.99/mes), libros u oratoria..."
                className="flex-1 bg-[#151722] border border-zinc-700 rounded-xl py-3 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37] transition font-sans"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#8a6c25] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(212,175,55,0.35)] disabled:opacity-40 flex items-center space-x-1.5 shrink-0"
              >
                <span>Preguntar</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

        {/* TAB 2: SKILLS INSPECTOR */}
        {activeTab === 'skills' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0c0d12]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="font-serif-gold font-bold text-white text-sm uppercase tracking-wider">
                  Matriz de Habilidades del Agente (Agent Skills)
                </h4>
                <p className="text-xs text-zinc-400">
                  Instrucciones especializadas inyectadas en tiempo de ejecución.
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono px-2 py-1 rounded bg-emerald-950 border border-emerald-500/40">
                gemini-3.8-flash Ready
              </span>
            </div>

            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="p-4 rounded-xl bg-[#14151e] border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#f5e2a3]">{skill.name}</span>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                        {skill.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Prioridad {skill.priority}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {skill.description}
                  </p>

                  <div className="p-2.5 bg-black/60 rounded-lg border border-zinc-800 text-[11px] text-[#c5a059] font-mono">
                    Directiva: "{skill.promptInstruction}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KNOWLEDGE BASE INSPECTOR */}
        {activeTab === 'knowledge' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0c0d12]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="font-serif-gold font-bold text-white text-sm uppercase tracking-wider">
                  Base de Conocimiento del Ecosistema (Agent Knowledge)
                </h4>
                <p className="text-xs text-zinc-400">
                  Precios de suscripción, políticas, libros de autor y FAQ.
                </p>
              </div>
              <span className="text-[10px] text-[#c5a059] font-mono px-2 py-1 rounded bg-[#d4af37]/20 border border-[#d4af37]/40">
                $5.99 / mes Configurado
              </span>
            </div>

            <div className="space-y-3">
              {knowledge.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-[#14151e] border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-zinc-800 text-[#f5e2a3] font-mono">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
