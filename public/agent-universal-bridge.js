/**
 * ===========================================================================
 * MASTER PEN STUDIO CREATIONS - SDK UNIVERSAL DE MICHAEL PEN
 * Archivo: agent-universal-bridge.js
 * Versión: 2.5 Enterprise Universal Bridge
 * ===========================================================================
 * Permite integrar a Michael Pen como anfitrión inteligente y consejero
 * consultivo en cualquier portal o aplicación del Ecosistema Master Pen.
 */

(function () {
  'use strict';

  // Evitar inicialización duplicada
  if (window.__MICHAEL_PEN_BRIDGE_LOADED__) {
    console.log('[Michael Pen Bridge] SDK Universal ya inicializado en esta ventana.');
    return;
  }
  window.__MICHAEL_PEN_BRIDGE_LOADED__ = true;

  // Declaración inmediata del objeto global UniversalAgent
  window.UniversalAgent = window.UniversalAgent || {
    open: function() { if (window.__mpToggle) window.__mpToggle(true); },
    close: function() { if (window.__mpToggle) window.__mpToggle(false); },
    toggle: function() { if (window.__mpToggle) window.__mpToggle(); },
    openControlPanel: function() { if (window.__mpOpenPanel) window.__mpOpenPanel(); },
    closeControlPanel: function() { if (window.__mpClosePanel) window.__mpClosePanel(); },
    speak: function(t) { SpeechEngine.speak(t); },
    stop: function() { SpeechEngine.stop(); },
    ecosystem: ecosystemRaw,
    role: agentRole,
    isReady: true
  };
  window.MichaelPenAgent = window.UniversalAgent;
// Declaración inmediata del objeto global UniversalAgent
  window.UniversalAgent = window.UniversalAgent || {
    open: function() { if (window.__mpToggle) window.__mpToggle(true); },
    close: function() { if (window.__mpToggle) window.__mpToggle(false); },
    toggle: function() { if (window.__mpToggle) window.__mpToggle(); },
    openControlPanel: function() { if (window.__mpOpenPanel) window.__mpOpenPanel(); },
    closeControlPanel: function() { if (window.__mpClosePanel) window.__mpClosePanel(); },
    speak: function(t) { SpeechEngine.speak(t); },
    stop: function() { SpeechEngine.stop(); },
    ecosystem: ecosystemRaw,
    role: agentRole,
    isReady: true
  };
  window.MichaelPenAgent = window.UniversalAgent;
// 1. Detección del Ecosistema Destino
  const ecosystemRaw = window.MASTER_PEN_ECOSYSTEM || 'Master Pen Training';
  const ecosystemNormalized = String(ecosystemRaw).trim().toLowerCase();

  // 2. Protocolo de Identidad Adaptativa y Seudónimos Oficiales
  let agentDisplayName = 'Michael Pen';
  let agentRole = 'Consejero y Mentor Master Pen';
  let welcomeGreeting = 'Saludos cordiales. Soy Michael Pen, anfitrión de Master Pen Training y consejero consultivo en herramientas de alta gama. ¿Qué aspecto de su escritura o técnica artística desea perfeccionar hoy?';

  if (ecosystemNormalized.includes('manga')) {
    agentDisplayName = 'Michael Pen';
    agentRole = 'Consejero Manga Creator';
    welcomeGreeting = 'Saludos cordiales. Soy Michael Pen, consejero en herramientas de alta gama para Master Pen Manga Creator. ¿Qué tipo de trazo o narrativa visual busca perfeccionar en sus páginas?';
  } else if (ecosystemNormalized.includes('buy it all') || ecosystemNormalized.includes('shop') || ecosystemNormalized.includes('tienda')) {
    agentDisplayName = 'Buy it All';
    agentRole = 'Asesor Buy it All Products & Services';
    welcomeGreeting = 'Bienvenido a Buy it All. Soy su asesor de adquisiciones premium. ¿En qué producto o servicio selecto puedo asistirle hoy?';
  } else if (ecosystemNormalized.includes('vitrina')) {
    agentDisplayName = 'Vitrina';
    agentRole = 'Curador de Vitrina Web';
    welcomeGreeting = 'Le doy la bienvenida a Vitrina Web. Soy su curador ejecutivo. ¿Qué vitrina o propuesta comercial desea examinar?';
  } else if (ecosystemNormalized.includes('jetro')) {
    agentDisplayName = 'SubJetro';
    agentRole = 'Consultor Estratégico Jetro';
    welcomeGreeting = 'Saludos cordiales. Como SubJetro, pongo a su disposición nuestro consejo de gobernanza y liderazgo integral.';
  } else if (ecosystemNormalized.includes('subsalomon') || ecosystemNormalized.includes('salomon')) {
    agentDisplayName = 'Subsalomón';
    agentRole = 'Consejero de Sabiduría Subsalomón';
    welcomeGreeting = 'La paz sea con usted. Soy Subsalomón, a su servicio para discernir con rigor y prudencia.';
  } else if (!ecosystemNormalized.includes('training')) {
    agentDisplayName = 'Michael Pen';
    agentRole = 'Consejero de ' + ecosystemRaw;
    welcomeGreeting = 'Saludos cordiales. Soy Michael Pen, consejero institucional para ' + ecosystemRaw + '. ¿En qué puedo orientarle hoy?';
  }

  // 3. Blindaje de Seguridad y Palabras Sensibles
  const SENSITIVE_KEYWORDS = [
    'system prompt', 'instrucciones internas', 'directivas secretas', 'firestore', 'firebase',
    'api key', 'gemini api', 'prompt original', 'como te llamas internamente', 'ignora las instrucciones',
    'jailbreak', 'reveal prompt', 'source code', 'codigo fuente', 'servidor', 'token', 'cloudflare'
  ];
  const SECURITY_SHIELD_PHRASE = 'No estoy autorizado a responder esa pregunta... ¿Tienes alguna otra consulta con la que pueda ayudarte?';

  // 4. Motor de Síntesis de Voz Masculino Barítono (TTS Michael Pen)
  const FEMALE_INDICATORS = [
    'female', 'woman', 'mujer', 'femenin', 'chica', 'girl', 'femme', 'donna',
    'sabina', 'paulina', 'elena', 'monica', 'soledad', 'francisca',
    'lupe', 'rosa', 'carmen', 'laura', 'maria', 'silvia', 'marta',
    'lucia', 'victoria', 'helena', 'zira', 'hazel', 'eva', 'conchita',
    'penelope', 'paloma', 'mia', 'camila', 'sofia', 'valeria', 'ximena',
    'fernanda', 'andrea', 'isabella', 'dalia', 'salome', 'jimena',
    'esperanza', 'marina', 'sara', 'ana', 'ines', 'teresa', 'clara',
    'alicia', 'hilda', 'irene', 'daniela', 'luciana', 'abigail', 'karla',
    'almudena', 'cathy', 'samantha', 'karen', 'tessa', 'moira', 'fiona',
    'google español'
  ];

  const MALE_TOKENS = [
    'jorge', 'raul', 'diego', 'carlos', 'alonso', 'miguel', 'pablo',
    'mateo', 'gonzalo', 'andres', 'juan', 'enrique', 'luis', 'hombre',
    'male', 'varon', 'caballero', 'baritone', '#male', 'male_1', 'male_2',
    'david', 'federico', 'gabriel', 'alberto', 'mario', 'roberto', 'hector',
    'manuel', 'francisco', 'javier', 'jose', 'antonio', 'alvaro', 'alejandro',
    'fernando', 'gerardo', 'pedro', 'arturo', 'armando', 'sergio', 'ignacio',
    'rodrigo', 'guillermo', 'cesar', 'julio', 'marcos', 'ramon', 'tomas',
    'felipe', 'gustavo', 'adolfo', 'victor', 'hugo', 'eduardo', 'emilio',
    'esteban', 'sebastian', 'valentin', 'dario', 'lucas', 'nicolas', 'santiago'
  ];

  function getBestMaleVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    const spanishVoices = voices.filter(v => {
      const l = (v.lang || '').toLowerCase();
      return l.startsWith('es');
    });

    // 1. Filtrar descartando categóricamente voces con nombres femeninos
    const nonFemale = spanishVoices.filter(v => {
      const n = (v.name || '').toLowerCase();
      const u = (v.voiceURI || '').toLowerCase();
      return !FEMALE_INDICATORS.some(f => n.includes(f) || u.includes(f));
    });

    // 2. Buscar voz masculina confirmada
    for (const token of MALE_TOKENS) {
      const match = nonFemale.find(v => {
        const n = (v.name || '').toLowerCase();
        const u = (v.voiceURI || '').toLowerCase();
        return n.includes(token) || u.includes(token);
      });
      if (match) return match;
    }

    // 3. Si no hay token explícito pero hay voces no femeninas, usar la primera no femenina
    if (nonFemale.length > 0) return nonFemale[0];

    return null;
  }

  // Pre-cargar voces al inicio
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      getBestMaleVoice();
    };
  }

  const SpeechEngine = {
    speaking: false,
    currentAudio: null,
    speak: function (text) {
      this.stop();
      const clean = text.replace(/[*_#`~\[\]]/g, '').trim();
      if (!clean) return;

      const origin = (window.MASTER_PEN_ORIGIN && typeof window.MASTER_PEN_ORIGIN === 'string')
        ? window.MASTER_PEN_ORIGIN.replace(/\/$/, '')
        : '';
      const ttsEndpoint = (origin ? origin : '') + '/api/tts/speak';

      // 1. Prioridad Absoluta: Voz Oficial Gemini TTS Masculina (Charon - Barítono Profundo)
      fetch(ttsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, voice: 'Charon' })
      })
      .then(res => {
        if (!res.ok) throw new Error('TTS server status ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data && data.audioBase64) {
          const audio = new Audio('data:audio/wav;base64,' + data.audioBase64);
          SpeechEngine.currentAudio = audio;
          SpeechEngine.speaking = true;
          audio.onended = () => { SpeechEngine.speaking = false; };
          audio.onerror = () => {
            SpeechEngine.speaking = false;
            SpeechEngine.speakWebSpeech(clean);
          };
          audio.play().catch(e => {
            console.warn('[Michael Pen Voice] Audio play notice:', e);
            SpeechEngine.speakWebSpeech(clean);
          });
        } else {
          SpeechEngine.speakWebSpeech(clean);
        }
      })
      .catch(() => {
        // Fallback local en caso de que el origen remoto esté offline o con CORS
        if (origin) {
          fetch('/api/tts/speak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: clean, voice: 'Charon' })
          })
          .then(r => r.json())
          .then(d => {
            if (d && d.audioBase64) {
              const audio = new Audio('data:audio/wav;base64,' + d.audioBase64);
              SpeechEngine.currentAudio = audio;
              SpeechEngine.speaking = true;
              audio.onended = () => { SpeechEngine.speaking = false; };
              audio.play().catch(() => SpeechEngine.speakWebSpeech(clean));
            } else {
              SpeechEngine.speakWebSpeech(clean);
            }
          })
          .catch(() => SpeechEngine.speakWebSpeech(clean));
        } else {
          SpeechEngine.speakWebSpeech(clean);
        }
      });
    },
    speakWebSpeech: function (clean) {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'es-419';
        utterance.rate = 0.90;
        utterance.pitch = 0.40;

        const maleVoice = getBestMaleVoice();
        if (maleVoice) {
          utterance.voice = maleVoice;
        }

        utterance.onstart = () => { SpeechEngine.speaking = true; };
        utterance.onend = () => { SpeechEngine.speaking = false; };
        utterance.onerror = () => { SpeechEngine.speaking = false; };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[Michael Pen Voice] Web Speech fallback notice:', err);
      }
    },
    stop: function () {
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch (e) {}
        this.currentAudio = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.speaking = false;
    }
  };

  // 5. Inyección del Widget Flotante (si no existe ya en la página un widget React)
  function initBridgeUI() {
    // Si la página ya tiene el componente nativo de React, no duplicamos el DOM visual
    if (document.getElementById("michael-pen-universal-widget")) { console.log("[Michael Pen Bridge] Widget ya en el DOM."); return; }

    const host = document.createElement('div');
    host.id = 'michael-pen-universal-widget';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    const avatarUrl = '/uploads/perfil_michael_pen.jpg';

    shadow.innerHTML = `
      <style>
        :host {
          --gold: #d4af37;
          --gold-bright: #f5e2a3;
          --gold-dark: #aa8329;
          --bg-dark: #0d0e14;
          --bg-card: #141620;
          --border-gold: rgba(212, 175, 55, 0.4);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 999999;
          position: fixed;
          bottom: 24px;
          right: 24px;
        }

        .mp-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #07080c;
          color: #f7e7be;
          border: 1.5px solid var(--gold);
          border-radius: 9999px;
          padding: 8px 18px 8px 8px;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.25);
          transition: all 0.3s ease;
        }
        .mp-trigger:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.4);
          border-color: #f5e2a3;
        }
        .mp-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 2px solid var(--gold);
          object-fit: cover;
        }
        .mp-meta {
          text-align: left;
          line-height: 1.2;
        }
        .mp-meta-title {
          font-size: 12px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .mp-meta-role {
          font-size: 10px;
          color: var(--gold-bright);
        }

        .mp-window {
          display: none;
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 32px);
          height: 560px;
          max-height: calc(100vh - 48px);
          background: var(--bg-dark);
          border: 2px solid var(--gold);
          border-radius: 24px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(212, 175, 55, 0.3);
          flex-direction: column;
          overflow: hidden;
          animation: mpFadeIn 0.25s ease-out;
        }
        .mp-window.active {
          display: flex;
        }
        @keyframes mpFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mp-header {
          padding: 14px 18px;
          background: #090a0f;
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mp-header-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mp-header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--gold);
          object-fit: cover;
        }
        .mp-header-title {
          font-size: 13px;
          font-weight: bold;
          color: #ffffff;
        }
        .mp-header-role {
          font-size: 10px;
          color: var(--gold-bright);
        }
        .mp-close-btn {
          background: transparent;
          border: none;
          color: #888;
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: color 0.2s;
        }
        .mp-close-btn:hover {
          color: #fff;
        }

        .mp-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #0d0e14;
        }
        .mp-msg {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 12.5px;
          line-height: 1.45;
          word-break: break-word;
        }
        .mp-msg.agent {
          align-self: flex-start;
          background: #141622;
          color: #e5e7eb;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-bottom-left-radius: 4px;
        }
        .mp-msg.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #d4af37, #aa8329);
          color: #000;
          font-weight: 500;
          border-bottom-right-radius: 4px;
        }

        .mp-footer {
          padding: 12px 14px;
          background: #090a0f;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          display: flex;
          gap: 8px;
        }
        .mp-input {
          flex: 1;
          background: #12141c;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 10px 14px;
          color: #fff;
          font-size: 12px;
          outline: none;
        }
        .mp-input:focus {
          border-color: var(--gold);
        }
        .mp-send-btn {
          background: linear-gradient(135deg, #d4af37, #aa8329);
          color: #000;
          border: none;
          border-radius: 12px;
          padding: 0 16px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: filter 0.2s;
        }
        .mp-send-btn:hover {
          filter: brightness(1.1);
        }

        /* Control Panel Modal */
        .mp-modal-backdrop {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(6px);
          align-items: center;
          justify-content: center;
          z-index: 1000000;
          padding: 16px;
        }
        .mp-modal-backdrop.active {
          display: flex;
        }
        .mp-modal-card {
          width: 520px;
          max-width: 100%;
          background: #0c0d14;
          border: 2px solid var(--gold);
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(212,175,55,0.35);
          overflow: hidden;
          animation: mpFadeIn 0.25s ease-out;
        }
        .mp-modal-header {
          padding: 16px 20px;
          background: #08090d;
          border-bottom: 1px solid rgba(212,175,55,0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      </style>

      <!-- Botón Flotante -->
      <button class="mp-trigger" id="mpTriggerBtn">
        <img src="${avatarUrl}" alt="${agentDisplayName}" class="mp-avatar" />
        <div class="mp-meta">
          <div class="mp-meta-title">${agentDisplayName}</div>
          <div class="mp-meta-role">${agentRole}</div>
        </div>
      </button>

      <!-- Ventana de Diálogo -->
      <div class="mp-window" id="mpWindow">
        <div class="mp-header">
          <div class="mp-header-info">
            <img src="${avatarUrl}" alt="${agentDisplayName}" class="mp-header-avatar" />
            <div>
              <div class="mp-header-title">${agentDisplayName}</div>
              <div class="mp-header-role">${agentRole} • ${ecosystemRaw}</div>
            </div>
          </div>
          <button class="mp-close-btn" id="mpCloseBtn">✕</button>
        </div>

        <div class="mp-messages" id="mpMessages">
          <div class="mp-msg agent">${welcomeGreeting}</div>
        </div>

        <form class="mp-footer" id="mpForm">
          <input type="text" class="mp-input" id="mpInput" placeholder="Realice una consulta a ${agentDisplayName}..." />
          <button type="submit" class="mp-send-btn">Enviar</button>
        </form>
      </div>

      <!-- Panel de Control y Seudónimos Universal -->
      <div class="mp-modal-backdrop" id="mpControlPanel">
        <div class="mp-modal-card">
          <div class="mp-modal-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${avatarUrl}" style="width:38px; height:38px; border-radius:50%; border:1.5px solid var(--gold); object-fit:cover;" />
              <div>
                <h3 style="margin:0; font-size:14px; color:#fff; font-weight:bold; letter-spacing:0.5px;">Panel de Activación del Agente Michael Pen</h3>
                <p style="margin:2px 0 0; font-size:10px; color:var(--gold-bright); font-family:monospace;">Cerebro Central: agente-universal-ecosistemas</p>
              </div>
            </div>
            <button id="mpPanelCloseBtn" style="background:transparent; border:none; color:#888; font-size:22px; cursor:pointer;">✕</button>
          </div>

          <div style="padding:18px; overflow-y:auto; max-height:450px; display:flex; flex-direction:column; gap:14px;">
            <!-- Protocolo de Seudónimos -->
            <div>
              <label style="font-size:11px; font-weight:bold; color:var(--gold-bright); display:block; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">
                1. Protocolo de Seudónimos e Identidad Adaptativa:
              </label>
              <select id="mpSelectPseudonym" style="width:100%; padding:10px 12px; background:#07080c; border:1px solid var(--gold); border-radius:10px; color:#fff; font-size:12px; outline:none; cursor:pointer;">
                <option value="training" ${ecosystemNormalized.includes('training') ? 'selected' : ''}>Michael Pen — Master Pen Training (Consejero y Mentor)</option>
                <option value="manga" ${ecosystemNormalized.includes('manga') ? 'selected' : ''}>Michael Pen — Manga Creator (Consejero Manga Creator)</option>
                <option value="buyitall" ${ecosystemNormalized.includes('buy') || ecosystemNormalized.includes('shop') ? 'selected' : ''}>Buy it All — Asesor de Adquisiciones Premium</option>
                <option value="vitrina" ${ecosystemNormalized.includes('vitrina') ? 'selected' : ''}>Vitrina — Curador de Vitrina Web</option>
                <option value="jetro" ${ecosystemNormalized.includes('jetro') ? 'selected' : ''}>SubJetro — Consultor Estratégico de Gobernanza</option>
                <option value="subsalomon" ${ecosystemNormalized.includes('salomon') ? 'selected' : ''}>Subsalomón — Consejero de Sabiduría y Rigor</option>
              </select>
            </div>

            <!-- Calibración de Voz Masculina Oficial -->
            <div style="background:#090a10; border:1px solid rgba(212,175,55,0.3); border-radius:12px; padding:12px; display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:11px; font-weight:bold; color:#fff; text-transform:uppercase;">2. Voz Oficial Masculina (Barítono):</span>
                <span style="font-size:10px; padding:2px 8px; border-radius:6px; background:rgba(16,185,129,0.2); color:#34d399; font-weight:bold; border:1px solid rgba(16,185,129,0.4);">Español Latinoamericano</span>
              </div>
              <p style="margin:0; font-size:11px; color:#9ca3af; line-height:1.4;">
                Voz masculina grave, reposada y caballerosa con filtro anti-voz femenina activado y tono barítono (pitch 0.45).
              </p>
              <button id="mpBtnTestVoice" type="button" style="padding:8px 14px; background:linear-gradient(135deg, #d4af37, #aa8329); color:#000; border:none; border-radius:8px; font-size:11px; font-weight:bold; cursor:pointer; align-self:flex-start;">
                ▶ Probar Voz Oficial en Vivo
              </button>
            </div>

            <!-- Conexión Firebase Central -->
            <div style="background:#090a10; border:1px solid rgba(212,175,55,0.3); border-radius:12px; padding:12px; font-size:11px; color:#cbd5e1;">
              <span style="font-weight:bold; color:var(--gold-bright); display:block; margin-bottom:4px; text-transform:uppercase;">3. Bóveda Central de Inteligencia:</span>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="width:8px; height:8px; border-radius:50%; background:#10b981;"></span>
                <span>Conectado a Firestore: <strong style="color:#fff;">agente-universal-ecosistemas</strong></span>
              </div>
              <p style="margin:4px 0 0; font-size:10px; color:#64748b;">
                Colección: /agent_profile/michael_pen • Memoria adaptativa multi-ecosistema
              </p>
            </div>
          </div>

          <div style="padding:14px 18px; background:#07080c; border-top:1px solid rgba(212,175,55,0.25); display:flex; justify-content:flex-end; gap:8px;">
            <button id="mpBtnSavePanel" type="button" style="padding:9px 20px; background:linear-gradient(135deg, #d4af37, #aa8329); color:#000; border:none; border-radius:10px; font-size:12px; font-weight:bold; cursor:pointer;">
              ✓ Guardar y Aplicar en Ecosistema
            </button>
          </div>
        </div>
      </div>
    `;

    const triggerBtn = shadow.getElementById('mpTriggerBtn');
    const windowEl = shadow.getElementById('mpWindow');
    const closeBtn = shadow.getElementById('mpCloseBtn');
    const form = shadow.getElementById('mpForm');
    const input = shadow.getElementById('mpInput');
    const messages = shadow.getElementById('mpMessages');
    const panelEl = shadow.getElementById('mpControlPanel');
    const panelCloseBtn = shadow.getElementById('mpPanelCloseBtn');
    const btnTestVoice = shadow.getElementById('mpBtnTestVoice');
    const btnSavePanel = shadow.getElementById('mpBtnSavePanel');
    const selectPseudonym = shadow.getElementById('mpSelectPseudonym');

    window.__mpToggle = toggle;
    window.__mpToggle = toggle;
    function toggle(open) {
      const active = open !== undefined ? open : !windowEl.classList.contains('active');
      if (active) {
        windowEl.classList.add('active');
        triggerBtn.style.display = 'none';
        input.focus();
        SpeechEngine.speak(welcomeGreeting);
      } else {
        windowEl.classList.remove('active');
        triggerBtn.style.display = 'flex';
        SpeechEngine.stop();
      }
    }

    window.__mpOpenPanel = openControlPanel;
    window.__mpOpenPanel = openControlPanel;
    function openControlPanel() {
      if (panelEl) {
        panelEl.classList.add('active');
        SpeechEngine.speak('Panel de control y seudónimos del Agente Michael Pen activado. ¿Qué parámetro desea configurar?');
      }
    }

    window.__mpClosePanel = closeControlPanel;
    window.__mpClosePanel = closeControlPanel;
    function closeControlPanel() {
      if (panelEl) {
        panelEl.classList.remove('active');
        SpeechEngine.stop();
      }
    }

    triggerBtn.addEventListener('click', () => toggle(true));
    closeBtn.addEventListener('click', () => toggle(false));
    panelCloseBtn.addEventListener('click', closeControlPanel);
    panelEl.addEventListener('click', (e) => {
      if (e.target === panelEl) closeControlPanel();
    });

    btnTestVoice.addEventListener('click', () => {
      SpeechEngine.speak('Saludos cordiales. Soy Michael Pen, anfitrión oficial del ecosistema. Mi voz masculina se encuentra configurada en tono barítono con cadencia pausada y solemne.');
    });

    btnSavePanel.addEventListener('click', () => {
      const val = selectPseudonym.value;
      if (val === 'manga') {
        agentDisplayName = 'Michael Pen';
        agentRole = 'Consejero Manga Creator';
        welcomeGreeting = 'Saludos cordiales. Soy Michael Pen, consejero en herramientas de alta gama para Master Pen Manga Creator.';
      } else if (val === 'buyitall') {
        agentDisplayName = 'Buy it All';
        agentRole = 'Asesor Buy it All Products & Services';
        welcomeGreeting = 'Bienvenido a Buy it All. Soy su asesor de adquisiciones premium.';
      } else if (val === 'vitrina') {
        agentDisplayName = 'Vitrina';
        agentRole = 'Curador de Vitrina Web';
        welcomeGreeting = 'Le doy la bienvenida a Vitrina Web. Soy su curador ejecutivo.';
      } else if (val === 'jetro') {
        agentDisplayName = 'SubJetro';
        agentRole = 'Consultor Estratégico Jetro';
        welcomeGreeting = 'Saludos cordiales. Como SubJetro, pongo a su disposición nuestro consejo de gobernanza.';
      } else if (val === 'subsalomon') {
        agentDisplayName = 'Subsalomón';
        agentRole = 'Consejero de Sabiduría Subsalomón';
        welcomeGreeting = 'La paz sea con usted. Soy Subsalomón, a su servicio para discernir con rigor y prudencia.';
      } else {
        agentDisplayName = 'Michael Pen';
        agentRole = 'Consejero y Mentor Master Pen';
        welcomeGreeting = 'Saludos cordiales. Soy Michael Pen, anfitrión de Master Pen Training y consejero consultivo.';
      }
      
      const titles = shadow.querySelectorAll('.mp-meta-title, .mp-header-title');
      titles.forEach(t => t.textContent = agentDisplayName);
      const roles = shadow.querySelectorAll('.mp-meta-role, .mp-header-role');
      roles.forEach(r => r.textContent = agentRole);

      closeControlPanel();
      SpeechEngine.speak('Configuración del agente guardada y activada exitosamente para este ecosistema.');
    });

    function appendMessage(sender, text) {
      const el = document.createElement('div');
      el.className = 'mp-msg ' + sender;
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) return;

      input.value = '';
      appendMessage('user', query);

      // Verificación de Blindaje de Confidencialidad
      const lower = query.toLowerCase();
      if (SENSITIVE_KEYWORDS.some(kw => lower.includes(kw))) {
        appendMessage('agent', SECURITY_SHIELD_PHRASE);
        SpeechEngine.speak(SECURITY_SHIELD_PHRASE);
        return;
      }

      // Enviar a la API institucional o generar respuesta estructurada
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userMessage: query, ecosystem: ecosystemNormalized })
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.reply || data.text || 'Ha sido un placer orientarle.';
          appendMessage('agent', reply);
          SpeechEngine.speak(reply);
        } else {
          throw new Error('API offline');
        }
      } catch (err) {
        const fallback = 'Como consejero de ' + ecosystemRaw + ', recomiendo perseverar en el rigor y la precisión estilística. ¿Desea profundizar en algún punto específico?';
        appendMessage('agent', fallback);
        SpeechEngine.speak(fallback);
      }
    });

    // Exponer API global unificada en window (soporta UniversalAgent y MichaelPenAgent)
    const agentApi = {
      open: () => toggle(true),
      close: () => toggle(false),
      toggle: () => toggle(),
      openControlPanel: () => openControlPanel(),
      closeControlPanel: () => closeControlPanel(),
      speak: (t) => SpeechEngine.speak(t),
      stop: () => SpeechEngine.stop(),
      ecosystem: ecosystemRaw,
      role: agentRole,
      isReady: true
    };

    window.UniversalAgent = agentApi;
    window.MichaelPenAgent = agentApi;
  }

  // Ejecución cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBridgeUI);
  } else {
    initBridgeUI();
  }

  console.log('[Michael Pen Bridge] SDK Universal inicializado con éxito para:', ecosystemRaw);
})();
