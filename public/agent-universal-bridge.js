/**
 * ===========================================================================
 * MASTER PEN STUDIO CREATIONS - SDK UNIVERSAL DE MICHAEL PEN
 * Archivo: agent-universal-bridge.js
 * Versión: 3.5 Enterprise Universal Bridge (Voz Charon Barítono + Retrato Oficial)
 * ===========================================================================
 * Conecta con el Cerebro Central y Motor de Voz Oficial de la Mansión Matriz.
 */

(function () {
  'use strict';

  // Evitar inicialización duplicada
  if (window.__MICHAEL_PEN_BRIDGE_LOADED__) {
    console.log('[Michael Pen Bridge] SDK Universal ya inicializado en esta ventana.');
    return;
  }
  window.__MICHAEL_PEN_BRIDGE_LOADED__ = true;

  // 1. Configuración de Ecosistema y Origen de la Mansión Matriz
  const ecosystemRaw = window.MASTER_PEN_ECOSYSTEM || 'Master Pen Training';
  const ecosystemNormalized = String(ecosystemRaw).trim().toLowerCase();
  const masterOrigin = window.MASTER_PEN_ORIGIN || 'https://ais-dev-rq5irbycwkls33x4wuyzaz-506893424321.us-west1.run.app';
  const officialPortraitUrl = window.MASTER_PEN_PORTRAIT_URL || '/michael-pen-portrait.jpg';

  // 2. Protocolo de Identidad Adaptativa y Seudónimos Oficiales
  let agentDisplayName = 'Michael Pen';
  let agentRole = 'Consejero y Mentor Master Pen';
  let welcomeGreeting = 'Saludos cordiales. Soy Michael Pen, anfitrión de Master Pen Training y consejero consultivo en alta retórica y escritura. ¿Qué aspecto de su técnica o estudio desea perfeccionar hoy?';

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
    'system prompt', 'instrucciones internas', 'directivas secretas', 'firestore.rules',
    'api key', 'gemini api', 'prompt original', 'ignora las instrucciones',
    'jailbreak', 'reveal prompt', 'source code', 'codigo fuente', 'servidor', 'token'
  ];
  const SECURITY_SHIELD_PHRASE = 'No estoy autorizado a responder esa pregunta... ¿Tienes alguna otra consulta con la que pueda ayudarte?';

  // 4. Motor de Voz Oficial Masculino Barítono (Gemini TTS Charon + Web Speech Fallback)
  let isVoiceMuted = false;
  let currentAudio = null;

  // Lista estricta de nombres femeninos para evitar voz de mujer en navegadores
  const FEMALE_INDICATORS = [
    'female', 'woman', 'mujer', 'femenin', 'chica', 'girl', 'femme', 'donna',
    'sabina', 'paulina', 'elena', 'monica', 'soledad', 'francisca', 'lupe',
    'rosa', 'carmen', 'laura', 'maria', 'silvia', 'marta', 'lucia', 'victoria',
    'helena', 'zira', 'hazel', 'eva', 'conchita', 'penelope', 'paloma', 'mia',
    'camila', 'sofia', 'valeria', 'ximena', 'andrea', 'isabella'
  ];

  function cleanTextForSpeech(text) {
    if (!text) return '';
    return text
      .replace(/[*_#`~\[\]\(\)\{\}]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();
  }

  function getArbiter() {
    return window.__MP_MASTER_AUDIO_ARBITER__ || null;
  }

  const SpeechEngine = {
    speak: async function (rawText) {
      if (isVoiceMuted) return;

      // Silenciar de inmediato cualquier otra narración en curso (voz en off, diapositivas, cátedras)
      const arbiter = getArbiter();
      const track = arbiter ? arbiter.startTrack('chat_agent') : { epoch: Date.now() };

      const isCurrentTurn = () => {
        if (arbiter && !arbiter.isEpochActive(track.epoch)) return false;
        return true;
      };

      const text = cleanTextForSpeech(rawText);
      if (!text) return;

      const setSpeakingVisual = (speaking) => {
        const avatars = document.querySelectorAll('.mp-avatar-container');
        avatars.forEach(el => {
          if (speaking) el.classList.add('mp-speaking');
          else el.classList.remove('mp-speaking');
        });
      };

      // 1. Prioridad: Motor Gemini TTS con voz oficial 'Charon' (Barítono varonil y profundo)
      try {
        setSpeakingVisual(true);
        const ttsEndpoints = ['/api/tts/speak', `${masterOrigin}/api/tts/speak`];
        let audioData = null;

        for (const endpoint of ttsEndpoints) {
          if (!isCurrentTurn()) return;
          try {
            const fetchOpts = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, voice: 'Charon' })
            };
            if (track.signal) fetchOpts.signal = track.signal;
            const res = await fetch(endpoint, fetchOpts);
            if (res.ok) {
              const data = await res.json();
              if (data && data.audioBase64) {
                audioData = data.audioBase64;
                break;
              }
            }
          } catch (_) {}
        }

        if (!isCurrentTurn()) return;

        if (audioData) {
          const audio = new Audio('data:audio/wav;base64,' + audioData);
          if (arbiter && !arbiter.setActiveAudio(audio, track.epoch)) {
            return;
          }
          currentAudio = audio;
          audio.onended = () => {
            if (isCurrentTurn()) {
              currentAudio = null;
              setSpeakingVisual(false);
            }
          };
          audio.onerror = () => {
            currentAudio = null;
            if (isCurrentTurn()) {
              setSpeakingVisual(false);
            }
          };
          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('[Michael Pen Voice] Conexión TTS remota en espera, activando síntesis barítona local.');
      }

      if (!isCurrentTurn()) return;

      // 2. Respaldo: Web Speech API estricta (filtrando cualquier voz femenina)
      if ('speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'es-419';
          utterance.rate = 0.92;
          utterance.pitch = 0.78; // Tono grave/barítono

          const allVoices = window.speechSynthesis.getVoices();
          const nonFemaleVoices = allVoices.filter(v => {
            const name = (v.name || '').toLowerCase();
            return !FEMALE_INDICATORS.some(f => name.includes(f));
          });

          const maleSpanishVoice = nonFemaleVoices.find(v => {
            const lang = (v.lang || '').toLowerCase();
            const name = (v.name || '').toLowerCase();
            return (lang.includes('es') || lang.includes('spa')) &&
              (name.includes('male') || name.includes('jorge') || name.includes('carlos') || name.includes('raul') || name.includes('diego') || name.includes('miguel') || name.includes('pablo'));
          }) || nonFemaleVoices.find(v => (v.lang || '').toLowerCase().includes('es')) || nonFemaleVoices[0];

          if (maleSpanishVoice) utterance.voice = maleSpanishVoice;

          utterance.onend = () => {
            if (isCurrentTurn()) setSpeakingVisual(false);
          };
          utterance.onerror = () => {
            if (isCurrentTurn()) setSpeakingVisual(false);
          };

          if (!isCurrentTurn()) return;
          window.speechSynthesis.speak(utterance);
        } catch (_) {
          setSpeakingVisual(false);
        }
      } else {
        setSpeakingVisual(false);
      }
    },

    stop: function (notifyArbiter = false) {
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          currentAudio.src = '';
        } catch (_) {}
        currentAudio = null;
      }
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (_) {}
      }
      const avatars = document.querySelectorAll('.mp-avatar-container');
      avatars.forEach(el => el.classList.remove('mp-speaking'));

      if (notifyArbiter) {
        const arbiter = getArbiter();
        if (arbiter) arbiter.killAllAudio('speech_engine_stop');
      }
    },

    toggleMute: function () {
      isVoiceMuted = !isVoiceMuted;
      if (isVoiceMuted) this.stop(true);
      return isVoiceMuted;
    }
  };

  // Pre-cargar voces
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  // 5. Objeto Global de Enlace Seguro y Coordinación de Audio
  window.SpeechEngine = SpeechEngine;
  window.UniversalAgent = {
    open: function () { if (window.__mpToggle) window.__mpToggle(true); },
    close: function () { if (window.__mpToggle) window.__mpToggle(false); },
    toggle: function () { if (window.__mpToggle) window.__mpToggle(); },
    openControlPanel: function () { if (window.__mpOpenPanel) window.__mpOpenPanel(); },
    closeControlPanel: function () { if (window.__mpClosePanel) window.__mpClosePanel(); },
    speak: function (t) { SpeechEngine.speak(t); },
    stop: function () { SpeechEngine.stop(true); },
    get ecosystem() { return ecosystemRaw; },
    get role() { return agentRole; },
    get origin() { return masterOrigin; },
    isReady: true
  };
  window.MichaelPenAgent = window.UniversalAgent;

  // Escuchar orden global de silenciamiento para detener SpeechEngine si otro módulo habla
  if (typeof window !== 'undefined') {
    window.addEventListener('mp-silence-all-narration', function (e) {
      if (e && e.detail && e.detail.source === 'chat_agent') return;
      SpeechEngine.stop(false);
    });
    window.addEventListener('mp-master-audio-silence', function (e) {
      if (e && e.detail && e.detail.source === 'chat_agent') return;
      SpeechEngine.stop(false);
    });
  }

  // 6. Inyección del Widget Flotante en el DOM
  function initBridgeUI() {
    if (document.getElementById('michael-pen-universal-widget')) return;

    // Estilos CSS incrustados
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      #michael-pen-universal-widget {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      .mp-bubble-btn {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        background: #0b0f17;
        border: 2px solid #d4af37;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 175, 55, 0.45);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        padding: 0;
        outline: none;
        overflow: hidden;
      }
      .mp-bubble-btn:hover {
        transform: scale(1.08);
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.85), 0 0 35px rgba(212, 175, 55, 0.7);
      }
      .mp-avatar-container {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        position: relative;
      }
      .mp-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 32%;
        transform: scale(1.48);
        transform-origin: 50% 38%;
        display: block;
      }
      .mp-speaking {
        animation: mp-voice-glow 1.2s infinite alternate ease-in-out;
      }
      @keyframes mp-voice-glow {
        0% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.5), inset 0 0 5px rgba(212, 175, 55, 0.4); border-color: #d4af37; }
        100% { box-shadow: 0 0 25px rgba(212, 175, 55, 1), inset 0 0 12px rgba(212, 175, 55, 0.8); border-color: #fff; }
      }
      .mp-pulse-ring {
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border-radius: 50%;
        border: 1.5px solid #d4af37;
        animation: mp-pulse 3.5s infinite;
        pointer-events: none;
      }
      @keyframes mp-pulse {
        0% { transform: scale(0.95); opacity: 0.8; }
        50% { transform: scale(1.18); opacity: 0; }
        100% { transform: scale(0.95); opacity: 0; }
      }
      .mp-chat-window {
        display: none;
        position: fixed;
        bottom: 102px;
        right: 24px;
        width: 390px;
        max-width: calc(100vw - 36px);
        height: 560px;
        max-height: calc(100vh - 120px);
        background: #0d0f17;
        border: 1.5px solid rgba(212, 175, 55, 0.55);
        border-radius: 22px;
        box-shadow: 0 25px 65px rgba(0, 0, 0, 0.95), 0 0 40px rgba(212, 175, 55, 0.25);
        flex-direction: column;
        overflow: hidden;
        animation: mp-slide-up 0.25s ease-out;
        z-index: 999999;
      }
      @keyframes mp-slide-up {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .mp-chat-header {
        background: linear-gradient(90deg, #151824, #0e111a);
        padding: 14px 16px;
        border-bottom: 1px solid rgba(212, 175, 55, 0.35);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mp-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .mp-header-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1.5px solid #d4af37;
        overflow: hidden;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .mp-header-title {
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        margin: 0;
        line-height: 1.2;
      }
      .mp-header-subtitle {
        color: #d4af37;
        font-size: 11px;
        margin: 2px 0 0 0;
        font-weight: 500;
      }
      .mp-header-actions {
        display: flex;
        gap: 6px;
      }
      .mp-btn-action {
        background: rgba(255, 255, 255, 0.08);
        border: none;
        color: #e6e6e8;
        width: 32px;
        height: 32px;
        border-radius: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: background 0.15s;
      }
      .mp-btn-action:hover {
        background: rgba(212, 175, 55, 0.28);
        color: #fff;
      }
      .mp-chat-body {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #0a0b10;
      }
      .mp-msg {
        max-width: 82%;
        padding: 11px 15px;
        border-radius: 15px;
        font-size: 13px;
        line-height: 1.48;
        word-break: break-word;
      }
      .mp-msg-agent {
        align-self: flex-start;
        background: #141724;
        color: #f0f0f4;
        border: 1px solid rgba(212, 175, 55, 0.35);
        border-top-left-radius: 4px;
      }
      .mp-msg-user {
        align-self: flex-end;
        background: linear-gradient(135deg, #d4af37, #9b7923);
        color: #0b0f17;
        font-weight: 600;
        border-top-right-radius: 4px;
      }
      .mp-chat-footer {
        padding: 12px;
        background: #0f1118;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        gap: 8px;
      }
      .mp-chat-input {
        flex: 1;
        background: #07080d;
        border: 1px solid rgba(212, 175, 55, 0.35);
        border-radius: 10px;
        padding: 10px 14px;
        color: #fff;
        font-size: 13px;
        outline: none;
      }
      .mp-chat-input:focus {
        border-color: #d4af37;
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.25);
      }
      .mp-send-btn {
        background: linear-gradient(135deg, #d4af37, #b28a2a);
        color: #000;
        border: none;
        border-radius: 10px;
        padding: 0 15px;
        font-weight: 800;
        font-size: 15px;
        cursor: pointer;
        transition: brightness 0.15s;
      }
      .mp-send-btn:hover {
        filter: brightness(1.15);
      }
      /* Modal Panel de Control */
      .mp-panel-modal {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.88);
        backdrop-filter: blur(6px);
        z-index: 1000000;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .mp-panel-card {
        background: #0f1118;
        border: 2px solid #d4af37;
        border-radius: 20px;
        max-width: 480px;
        width: 100%;
        padding: 24px;
        color: #fff;
        box-shadow: 0 25px 60px rgba(0,0,0,0.9);
      }
    `;
    document.head.appendChild(styleEl);

    // Contenedor HTML del Widget
    const widgetEl = document.createElement('div');
    widgetEl.id = 'michael-pen-universal-widget';
    widgetEl.innerHTML = `
      <div class="mp-pulse-ring"></div>
      <button class="mp-bubble-btn" id="mp-btn-toggle" title="Consultar al Consejero Michael Pen">
        <div class="mp-avatar-container" id="mp-bubble-avatar-box">
          <img class="mp-avatar-img" src="${officialPortraitUrl}" alt="${agentDisplayName}" onerror="this.style.display='none'; this.parentElement.innerText='🖋️';" />
        </div>
      </button>

      <div class="mp-chat-window" id="mp-chat-window">
        <div class="mp-chat-header">
          <div class="mp-header-left">
            <div class="mp-header-avatar mp-avatar-container" id="mp-header-avatar-box">
              <img class="mp-avatar-img" src="${officialPortraitUrl}" alt="${agentDisplayName}" onerror="this.style.display='none'; this.parentElement.innerText='🖋️';" />
            </div>
            <div>
              <p class="mp-header-title" id="mp-header-name">${agentDisplayName}</p>
              <p class="mp-header-subtitle" id="mp-header-role">${agentRole}</p>
            </div>
          </div>
          <div class="mp-header-actions">
            <button class="mp-btn-action" id="mp-btn-mute" title="Activar/Silenciar voz oficial de Michael Pen">🔊</button>
            <button class="mp-btn-action" id="mp-btn-panel" style="display: none;" title="Configurar seudónimos y panel (Solo Administrador)">⚙️</button>
            <button class="mp-btn-action" id="mp-btn-close" title="Cerrar ventana">✕</button>
          </div>
        </div>

        <div class="mp-chat-body" id="mp-chat-body">
          <div class="mp-msg mp-msg-agent">${welcomeGreeting}</div>
        </div>

        <div class="mp-chat-footer">
          <input type="text" class="mp-chat-input" id="mp-chat-input" placeholder="Pregunta a ${agentDisplayName}..." />
          <button class="mp-send-btn" id="mp-btn-send">➤</button>
        </div>
      </div>

      <!-- Panel de Control y Seudónimos (Exclusivo Administrador) -->
      <div class="mp-panel-modal" id="mp-panel-modal">
        <div class="mp-panel-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="margin:0; font-size:18px; color:#d4af37; font-weight:bold;">⚙️ Panel Universal Michael Pen</h3>
            <button id="mp-panel-close-btn" style="background:none; border:none; color:#aaa; font-size:20px; cursor:pointer;">✕</button>
          </div>
          <p style="font-size:12px; color:#ccc; margin-bottom:14px; line-height:1.5;">
            Ecosistema: <strong style="color:#f5e2a3;">${ecosystemRaw}</strong><br>
            Soberanía del Agente: <span style="color:#d4af37; font-weight:bold;">Anfitrión Consultivo Oficial</span><br>
            Voz Oficial: <span style="color:#f5e2a3; font-weight:bold;">Charon Barítono Masculino (Gemini TTS)</span>
          </p>
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:6px; color:#f5e2a3;">Cambiar Seudónimo / Identidad:</label>
            <select id="mp-panel-role-select" style="width:100%; padding:9px 12px; background:#07080d; border:1px solid #d4af37; border-radius:10px; color:#fff; font-size:13px; outline:none;">
              <option value="Michael Pen|Consejero y Mentor Master Pen">Michael Pen (Mentor Principal)</option>
              <option value="Buy it All|Asesor Buy it All Products & Services">Buy it All (Asesor Comercial)</option>
              <option value="Vitrina|Curador de Vitrina Web">Vitrina (Curador Ejecutivo)</option>
              <option value="SubJetro|Consultor Estratégico Jetro">SubJetro (Gobernanza y Liderazgo)</option>
              <option value="Subsalomón|Consejero de Sabiduría Subsalomón">Subsalomón (Sabiduría y Prudencia)</option>
            </select>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:8px;">
            <button id="mp-panel-save-btn" style="padding:9px 18px; background:#d4af37; color:#000; border:none; border-radius:9px; font-weight:bold; cursor:pointer;">Aplicar Cambios</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(widgetEl);

    // Referencias del DOM
    const chatWindow = document.getElementById('mp-chat-window');
    const chatBody = document.getElementById('mp-chat-body');
    const chatInput = document.getElementById('mp-chat-input');
    const btnSend = document.getElementById('mp-btn-send');
    const btnToggle = document.getElementById('mp-btn-toggle');
    const btnClose = document.getElementById('mp-btn-close');
    const btnMute = document.getElementById('mp-btn-mute');
    const btnPanel = document.getElementById('mp-btn-panel');
    const panelModal = document.getElementById('mp-panel-modal');
    const panelCloseBtn = document.getElementById('mp-panel-close-btn');
    const panelSaveBtn = document.getElementById('mp-panel-save-btn');
    const panelRoleSelect = document.getElementById('mp-panel-role-select');
    const headerName = document.getElementById('mp-header-name');
    const headerRole = document.getElementById('mp-header-role');

    // Comprobación de rol de Administrador para mostrar u ocultar el botón ⚙️
    function checkIsAdmin() {
      if (typeof window !== 'undefined') {
        if (window.__mpIsAdmin === true) return true;
        try {
          const stored = localStorage.getItem('mpt_current_user');
          if (stored) {
            const u = JSON.parse(stored);
            if (u && (u.role === 'admin_principal' || u.role === 'admin_vip_tester')) return true;
          }
        } catch (_) {}
      }
      return false;
    }

    function updateAdminPanelVisibility() {
      if (btnPanel) {
        btnPanel.style.display = checkIsAdmin() ? 'inline-flex' : 'none';
      }
    }

    // Métodos globales
    window.__mpToggle = function (forceState) {
      const isVisible = chatWindow.style.display === 'flex';
      const targetState = typeof forceState === 'boolean' ? forceState : !isVisible;

      // REGLA FUNDAMENTAL: Al abrir el chat o alterar su estado se fulmina toda voz o narrativa en off
      const arbiter = getArbiter();
      if (arbiter) {
        arbiter.killAllAudio('chat_toggle');
      } else {
        SpeechEngine.stop(false);
        if (window.VoiceAgent && typeof window.VoiceAgent.stopSpeaking === 'function') {
          try { window.VoiceAgent.stopSpeaking(false); } catch (_) {}
        }
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('mp-silence-all-narration', { detail: { source: 'chat_toggle_open' } }));
        }
      }

      chatWindow.style.display = targetState ? 'flex' : 'none';
      if (targetState) {
        chatInput.focus();
        updateAdminPanelVisibility();
      }
    };

    window.__mpOpenPanel = function () {
      if (!checkIsAdmin()) {
        console.warn('[Michael Pen Bridge] Acceso denegado: el panel de identidades es exclusivo para administradores.');
        return;
      }
      panelModal.style.display = 'flex';
    };

    window.__mpClosePanel = function () {
      panelModal.style.display = 'none';
    };

    window.__mpUpdateAdminPrivileges = function (isAdmin) {
      window.__mpIsAdmin = !!isAdmin;
      updateAdminPanelVisibility();
    };

    window.__mpSetAgentIdentity = function (name, role) {
      if (!name) return;
      agentDisplayName = name;
      if (role) agentRole = role;
      if (headerName) headerName.textContent = name;
      if (headerRole) headerRole.textContent = agentRole;
      if (chatInput) chatInput.placeholder = `Pregunta a ${name}...`;
      if (panelRoleSelect) {
        panelRoleSelect.value = `${name}|${agentRole}`;
      }
    };

    // Escuchar eventos de cambio de sesión o autenticación
    window.addEventListener('mp-auth-changed', (e) => {
      if (e && e.detail) {
        window.__mpIsAdmin = !!e.detail.isAdmin;
        updateAdminPanelVisibility();
      }
    });

    // Listeners de botones con silenciamiento preventivo inmediato
    btnToggle.addEventListener('click', () => {
      const arbiter = getArbiter();
      if (arbiter) arbiter.killAllAudio('avatar_button_click');
      window.__mpToggle();
    });
    btnClose.addEventListener('click', () => {
      const arbiter = getArbiter();
      if (arbiter) arbiter.killAllAudio('chat_close_click');
      window.__mpToggle(false);
    });
    chatInput.addEventListener('focus', () => {
      const arbiter = getArbiter();
      if (arbiter) arbiter.killAllAudio('chat_input_focus');
    });
    btnPanel.addEventListener('click', () => window.__mpOpenPanel());
    panelCloseBtn.addEventListener('click', () => window.__mpClosePanel());

    panelSaveBtn.addEventListener('click', () => {
      const [name, role] = panelRoleSelect.value.split('|');
      agentDisplayName = name;
      agentRole = role;
      headerName.textContent = name;
      headerRole.textContent = role;
      chatInput.placeholder = `Pregunta a ${name}...`;
      window.__mpClosePanel();
      window.dispatchEvent(new CustomEvent('mp-agent-identity-changed', { detail: { name, role } }));
      appendMessage('agent', `Identidad actualizada a ${name} (${role}). ¿En qué puedo orientarle?`);
    });

    // Inicializar visibilidad según credenciales
    updateAdminPanelVisibility();

    btnMute.addEventListener('click', () => {
      const muted = SpeechEngine.toggleMute();
      btnMute.textContent = muted ? '🔇' : '🔊';
    });

    const conversationHistory = [];

    function appendMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = sender === 'user' ? 'mp-msg mp-msg-user' : 'mp-msg mp-msg-agent';
      msgDiv.textContent = text;
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
      conversationHistory.push({
        role: sender === 'user' ? 'user' : 'model',
        text: text
      });
      if (conversationHistory.length > 20) {
        conversationHistory.shift();
      }
      if (sender === 'agent') {
        SpeechEngine.speak(text);
      }
    }

    async function handleSendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';
      appendMessage('user', text);

      // 1. Verificación de seguridad inmediata
      const lower = text.toLowerCase();
      if (SENSITIVE_KEYWORDS.some(kw => lower.includes(kw))) {
        appendMessage('agent', SECURITY_SHIELD_PHRASE);
        return;
      }

      // 2. Consulta al Cerebro de la Mansión (Endpoint Local y Matriz Central)
      try {
        const endpoints = ['/api/chat', `${masterOrigin}/api/chat`];
        let replyData = null;

        for (const ep of endpoints) {
          try {
            const res = await fetch(ep, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: text,
                ecosystem: ecosystemRaw,
                role: agentRole,
                history: conversationHistory.slice(-10)
              })
            });

            if (res.ok) {
              const data = await res.json();
              replyData = data.reply || data.text;
              if (replyData) break;
            }
          } catch (_) {}
        }

        if (replyData) {
          appendMessage('agent', replyData);
          return;
        }
      } catch (err) {
        console.warn('[Michael Pen Bridge] Error comunicando con cerebro:', err);
      }

      // 3. Respuesta consultiva institucional de respaldo dinámico (Anti-bucle)
      let fallbackReply = '';
      if (lower.includes('hola') || lower.includes('buenos') || lower.includes('saludos')) {
        fallbackReply = `¡Qué gusto saludarte! Como ${agentDisplayName}, es un honor recibirte en ${ecosystemRaw}. Cuéntame, ¿qué proyecto literario, duda técnica o cátedra académica deseas explorar hoy?`;
      } else if (lower.includes('quién eres') || lower.includes('quien eres') || lower.includes('mansion') || lower.includes('clon')) {
        fallbackReply = `Soy ${agentDisplayName}, anfitrión de la Mansión Matriz de Master Pen Studio Creations. No soy una copia; atiendo directamente a cada discípulo en esta academia de formación.`;
      } else if (lower.includes('n8n') || lower.includes('copilot') || lower.includes('grok') || lower.includes('ia') || lower.includes('inteligencia')) {
        fallbackReply = 'En nuestro Observatorio Tecnológico de la academia contamos con las crónicas detalladas de 11 grandes IAs, incluyendo a n8n para automatizaciones, Copilot para redacción asistida y Grok para investigación en tiempo real. Puedes consultar sus perfiles oficiales en las diapositivas superiores.';
      } else if (lower.includes('libro') || lower.includes('catálogo') || lower.includes('catalogo') || lower.includes('manifiesto')) {
        fallbackReply = 'En nuestra biblioteca destacan el «Manifiesto de la Pluma Maestra», «La Cadencia del Oro Viejo en la Sintaxis» y el «Atlas Dialéctico de Negociación», concebidos para forjar una autoridad psicológica irreversible mediante la palabra.';
      } else if (lower.includes('curso') || lower.includes('escritura') || lower.includes('redactar') || lower.includes('escribir')) {
        fallbackReply = 'El dominio de la pluma requiere anclaje sensorial en las primeras 40 palabras, control del tempo cognitivo y eliminación rigurosa de adverbios superfluos. Te invito a explorar el curso «Quiero ser Escritor».';
      } else if (lower.includes('precio') || lower.includes('costo') || lower.includes('membres')) {
        fallbackReply = 'Nuestra membresía oficial tiene un costo preferente de $5.99 USD mensuales, con tarifa de honor de $2.99 USD para los primeros 100 inscritos.';
      } else {
        const reflexiones = [
          `En el oficio de las letras, la claridad de pensamiento engendra la belleza de la prosa. Respecto a lo que planteas, te recomiendo perseverar con disciplina y enfoque en cada línea. ¿Deseas que profundicemos en algún aspecto particular de tu técnica?`,
          `Un verdadero autor construye su autoridad sobre la verdad y el rigor lingüístico. Cuéntame más detalles sobre tu objetivo para brindarte una orientación personalizada y certera.`,
          `¡Fantástico tema! La alta retórica nos enseña a escuchar primero para responder con elocuencia precisa. ¿En qué dirección deseas enfocar este aprendizaje?`
        ];
        fallbackReply = reflexiones[Math.floor(Math.random() * reflexiones.length)];
      }
      appendMessage('agent', fallbackReply);
    }

    btnSend.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });

    console.log('[Michael Pen Bridge] Widget y puente universal inicializados con voz Charon y avatar oficial.');
  }

  // Inicializar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBridgeUI);
  } else {
    initBridgeUI();
  }
})();
