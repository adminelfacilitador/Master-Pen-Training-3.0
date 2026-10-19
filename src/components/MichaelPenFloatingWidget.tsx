import React, { useState, useEffect, useRef } from 'react';
import { BRANDING } from '../assets/branding';
import { michaelPenSpeech } from '../services/michaelPenSpeech';
import { cloudState } from '../services/cloudState';
import { agentDb } from './../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface MichaelPenFloatingWidgetProps {
  ecosystemId?: 'manga' | 'training' | 'shop' | 'creative' | 'buyitall' | 'vitrina' | 'jetro' | 'subsalomon';
}

const MANGA_CATALOG = [
  { id: '1', name: 'Suite Kurogane G-Pen (Titanio)', price: '$89.00 USD', desc: 'Plumillas de acero templado con aleación de titanio para trazos orgánicos y máxima durabilidad.' },
  { id: '2', name: 'Tinta Sumi "Kyoto Obsidian"', price: '$34.00 USD', desc: 'Negro carbón mate absoluto de 60ml, resistente al agua y a marcadores de alcohol.' },
  { id: '3', name: 'Palillero de Cerezo de Kioto', price: '$48.00 USD', desc: 'Equilibrio de peso anatómico para jornadas intensivas de dibujo sin fatiga muscular.' },
  { id: '4', name: 'Estación de Entintado "Sensei Master"', price: '$320.00 USD', desc: 'Mesa ergonómica de roble con iluminación regulable y soportes magnéticos para palilleros.' }
];

const SECURITY_SHIELD_PHRASE = 'No estoy autorizado a responder esa pregunta... ¿Tienes alguna otra consulta con la que pueda ayudarte?';

const SENSITIVE_KEYWORDS = [
  'system prompt', 'instrucciones internas', 'directivas secretas', 'firestore', 'firebase',
  'api key', 'gemini api', 'prompt original', 'como te llamas internamente', 'ignora las instrucciones',
  'jailbreak', 'reveal prompt', 'source code', 'codigo fuente', 'servidor', 'token', 'cloudflare'
];

export const MichaelPenFloatingWidget: React.FC<MichaelPenFloatingWidgetProps> = ({
  ecosystemId = 'training'
}) => {
  // Protocolo de Seudónimos e Identidad Adaptativa
  let agentDisplayName = 'Michael Pen';
  let agentRole = 'Consejero y Mentor Master Pen';
  let welcomeGreeting = 'Saludos cordiales. Soy Michael Pen, anfitrión de Master Pen Training y consejero consultivo en herramientas de alta gama. ¿Qué aspecto de su escritura o técnica artística desea perfeccionar hoy?';

  if (ecosystemId === 'manga') {
    agentDisplayName = 'Michael Pen';
    agentRole = 'Consejero Manga Creator';
    welcomeGreeting = 'Saludos cordiales. Soy Michael Pen, consejero en herramientas de alta gama para Master Pen Manga Creator. ¿Qué tipo de trazo o narrativa visual busca perfeccionar en sus páginas?';
  } else if (ecosystemId === 'buyitall') {
    agentDisplayName = 'Buy it All';
    agentRole = 'Asesor Buy it All Products & Services';
    welcomeGreeting = 'Bienvenido a Buy it All. Soy su asesor de adquisiciones premium. ¿En qué producto o servicio selecto puedo asistirle hoy?';
  } else if (ecosystemId === 'vitrina') {
    agentDisplayName = 'Vitrina';
    agentRole = 'Curador de Vitrina Web';
    welcomeGreeting = 'Le doy la bienvenida a Vitrina Web. Soy su curador ejecutivo. ¿Qué vitrina o propuesta comercial desea examinar?';
  } else if (ecosystemId === 'jetro') {
    agentDisplayName = 'SubJetro';
    agentRole = 'Consultor Estratégico Jetro';
    welcomeGreeting = 'Saludos cordiales. Como SubJetro, pongo a su disposición nuestro consejo de gobernanza y liderazgo integral.';
  } else if (ecosystemId === 'subsalomon') {
    agentDisplayName = 'Subsalomón';
    agentRole = 'Consejero de Sabiduría Subsalomón';
    welcomeGreeting = 'La paz sea con usted. Soy Subsalomón, a su servicio para discernir con rigor y prudencia.';
  }

  const [branding, setBranding] = useState(cloudState.getBrandingImages());
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: welcomeGreeting
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return cloudState.subscribe(() => {
      setBranding(cloudState.getBrandingImages());
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    const userText = textToSend.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    const messageLower = userText.toLowerCase();

    // 1. Blindaje de Confidencialidad Inexpugnable en el Cliente
    if (SENSITIVE_KEYWORDS.some(kw => messageLower.includes(kw))) {
      const shieldReply = SECURITY_SHIELD_PHRASE;
      setMessages(prev => [...prev, { sender: 'agent', text: shieldReply }]);
      if (isVoiceActive) michaelPenSpeech.speak(shieldReply);
      setIsLoading(false);
      return;
    }

    try {
      // Intento con backend /api/chat o /api/agent/chat
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: userText, ecosystem: ecosystemId })
      });
      
      let reply = '';
      if (res.ok) {
        const data = await res.json();
        reply = data.reply || data.text || 'Ha sido un honor. ¿Tiene otra consulta?';
      } else {
        throw new Error('Fallback local');
      }

      setMessages(prev => [...prev, { sender: 'agent', text: reply }]);
      if (isVoiceActive) michaelPenSpeech.speak(reply);

      // Persistencia en Firebase Cloud Externo (agente-universal-ecosistemas)
      try {
        await addDoc(collection(agentDb, 'universal_agent_conversations'), {
          agent: agentDisplayName,
          ecosystem: ecosystemId,
          userPrompt: userText,
          agentReply: reply,
          timestamp: serverTimestamp()
        });
      } catch (dbErr) {
        // Silencioso para no revelar detalles técnicos
      }

    } catch (err) {
      // Fallback autónomo de alta elocuencia
      let fallback = `Como ${agentDisplayName}, he registrado con atención su inquietud sobre "${userText}". En nuestro catálogo oficial de herramientas maestras y cátedras disponemos de las mejores soluciones. ¿Desea que profundicemos en las características de nuestras plumillas, tintas o métodos de redacción?`;

      if (userText.includes('G-Pen') || userText.includes('plumilla') || userText.includes('titanio')) {
        fallback = 'La Suite Kurogane G-Pen está forjada con acero templado y baño de aleación de titanio. Ofrece una flexibilidad controlada ideal para alternar entre líneas capilares de extrema finura y trazos potentes con total precisión.';
      } else if (userText.includes('tinta') || userText.includes('Obsidian') || userText.includes('Kyoto')) {
        fallback = 'La Tinta Sumi Kyoto Obsidian ofrece un negro carbón absoluto con acabado mate antirreflejos. Es 100% impermeable una vez seca y totalmente compatible con marcadores a base de alcohol como Copic.';
      } else if (userText.includes('palillero') || userText.includes('cerezo') || userText.includes('madera')) {
        fallback = 'El Palillero de Cerezo de Kioto cuenta con un equilibrio de peso anatómico diseñado artesanalmente para sesiones intensivas de dibujo de más de 10 horas sin provocar tensión en el túnel carpiano.';
      } else if (userText.includes('mesa') || userText.includes('estacion') || userText.includes('estación') || userText.includes('Sensei')) {
        fallback = 'La Estación Sensei Master es la cima del mobiliario para dibujantes: construida en roble macizo con iluminación perimetral regulable y fijación magnética para sus instrumentos.';
      }

      setMessages(prev => [...prev, { sender: 'agent', text: fallback }]);
      if (isVoiceActive) michaelPenSpeech.speak(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (isVoiceActive && messages.length > 0) {
              michaelPenSpeech.speak(messages[messages.length - 1].text);
            }
          }}
          className="flex items-center gap-3 bg-slate-950 text-amber-300 border border-amber-500/50 hover:border-amber-400 p-3 px-5 rounded-full shadow-2xl transition hover:scale-105 cursor-pointer group"
          title={`Consultar a ${agentDisplayName}`}
        >
          <img
            src={branding.portrait || BRANDING.portrait}
            alt={agentDisplayName}
            className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover group-hover:border-amber-300"
          />
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-100">{agentDisplayName}</p>
            <p className="text-[10px] text-amber-400">{agentRole}</p>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="w-96 max-w-[95vw] h-[580px] bg-slate-950 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={branding.portrait || BRANDING.portrait}
                alt={agentDisplayName}
                className="w-9 h-9 rounded-full border border-amber-400 object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-amber-300">{agentDisplayName}</h4>
                <p className="text-[10px] text-slate-400">{agentRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const muted = michaelPenSpeech.toggleMute();
                  setIsVoiceActive(muted);
                }}
                className={`p-1.5 rounded-lg text-xs border transition cursor-pointer ${
                  isVoiceActive ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-700 text-slate-500'
                }`}
                title="Locución Barítono (0.70 / 0.90)"
              >
                {isVoiceActive ? '🔊' : '🔇'}
              </button>
              <button 
                onClick={() => { 
                  setIsOpen(false); 
                  michaelPenSpeech.stop(); 
                }} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Cerrar panel de consulta"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Catalog Bar */}
          <div className="p-2 bg-slate-900/60 border-b border-slate-800 flex gap-2 overflow-x-auto text-[11px] scrollbar-thin">
            {MANGA_CATALOG.map(item => (
              <button
                key={item.id}
                onClick={() => sendMessage(`Estimado ${agentDisplayName}, ¿podría explicarme las ventajas del producto "${item.name}" para mis trabajos?`)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-700 transition cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-amber-600 text-slate-950 font-medium' 
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-amber-400 text-xs italic flex items-center gap-1.5 animate-pulse">
                <span>{agentDisplayName} está reflexionando su recomendación...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-900/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Consulte sobre herramientas, cátedras o técnicas..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-md"
            >
              Consultar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
