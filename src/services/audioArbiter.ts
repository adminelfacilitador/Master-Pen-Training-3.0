/**
 * MASTER PEN STUDIO CREATIONS - ÁRBITRO MAESTRO DE AUDIO (SINGLE-CHANNEL SENTINEL)
 * Garantiza de forma irrevocable la exclusión mutua de audio en todo el navegador.
 * Nunca, bajo ninguna circunstancia, se permiten dos canales de audio o voz simultáneos
 * entre la "voz en off" (narrador de diapositivas/cátedras/evaluaciones) y la "voz del chat" (Michael Pen Widget).
 */

export interface MasterAudioTrack {
  epoch: number;
  signal?: AbortSignal;
}

export class MasterAudioArbiter {
  private static epoch = 0;
  private static activeSource: 'voice_over' | 'chat_agent' | null = null;
  private static activeAudio: HTMLAudioElement | null = null;
  private static activeAbortCtrl: AbortController | null = null;
  private static isInitialized = false;

  public static initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    // Registrar en el objeto global de ventana para comunicación con scripts externos como agent-universal-bridge.js
    (window as any).__MP_MASTER_AUDIO_ARBITER__ = {
      killAllAudio: (reason: string) => MasterAudioArbiter.killAllAudio(reason),
      startTrack: (source: 'voice_over' | 'chat_agent') => MasterAudioArbiter.startTrack(source),
      setActiveAudio: (audio: HTMLAudioElement, epoch: number) => MasterAudioArbiter.setActiveAudio(audio, epoch),
      isEpochActive: (epoch: number) => MasterAudioArbiter.isEpochActive(epoch),
      isChatOpen: () => MasterAudioArbiter.isChatOpen(),
      getCurrentEpoch: () => MasterAudioArbiter.epoch
    };

    // Escuchar eventos globales de solicitud de silencio
    window.addEventListener('mp-silence-all-narration', (e: any) => {
      const source = e?.detail?.source || 'external_event';
      if (source !== 'arbiter_internal') {
        MasterAudioArbiter.killAllAudio(source);
      }
    });

    window.addEventListener('mp-master-audio-silence', (e: any) => {
      const source = e?.detail?.source || 'master_silence';
      if (source !== 'arbiter_internal') {
        MasterAudioArbiter.killAllAudio(source);
      }
    });
  }

  private static isKilling = false;

  public static isKillingActive(): boolean {
    return this.isKilling;
  }

  /**
   * Silencia y extermina instantáneamente cualquier flujo de audio, síntesis o petición de voz en curso.
   * Cuenta con bloqueo atómico contra re-entrancia para evitar bucles recursivos entre agentes.
   */
  public static killAllAudio(sourceReason: string): void {
    if (this.isKilling) return;
    this.isKilling = true;

    try {
      this.epoch++;
      this.activeSource = null;

      // 1. Cancelar cualquier petición HTTP /api/tts/speak en curso
      if (this.activeAbortCtrl) {
        try {
          this.activeAbortCtrl.abort();
        } catch (_) {}
        this.activeAbortCtrl = null;
      }

      // 2. Detener y destruir el elemento HTMLAudio activo
      if (this.activeAudio) {
        try {
          this.activeAudio.pause();
          this.activeAudio.currentTime = 0;
          this.activeAudio.src = '';
          this.activeAudio.onended = null;
          this.activeAudio.onerror = null;
        } catch (_) {}
        this.activeAudio = null;
      }

      // 3. Pausar todos los tags <audio> en el DOM
      if (typeof document !== 'undefined') {
        try {
          document.querySelectorAll('audio').forEach((el) => {
            try {
              el.pause();
              el.currentTime = 0;
            } catch (_) {}
          });
        } catch (_) {}

        // Retirar clase visual animada de Michael Pen
        try {
          document.querySelectorAll('.mp-avatar-container').forEach((el) => {
            el.classList.remove('mp-speaking');
          });
        } catch (_) {}
      }

      // 4. Cancelar agresivamente Web Speech API
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          // Segundo pase asíncrono para navegadores con buffer de síntesis atascado
          setTimeout(() => {
            try {
              if (window.speechSynthesis && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
              }
            } catch (_) {}
          }, 60);
        } catch (_) {}
      }

      // 5. Notificar a VoiceAgent y SpeechEngine explícitamente sin re-notificar al árbitro
      if (typeof window !== 'undefined') {
        if ((window as any).VoiceAgent && typeof (window as any).VoiceAgent.stopSpeaking === 'function') {
          try {
            (window as any).VoiceAgent.stopSpeaking(false);
          } catch (_) {}
        }
        if ((window as any).SpeechEngine && typeof (window as any).SpeechEngine.stop === 'function') {
          try {
            (window as any).SpeechEngine.stop(false);
          } catch (_) {}
        }
        if ((window as any).UniversalAgent && typeof (window as any).UniversalAgent.stop === 'function') {
          try {
            (window as any).UniversalAgent.stop();
          } catch (_) {}
        }

        // 6. Emitir evento sincronizado para componentes React
        try {
          window.dispatchEvent(new CustomEvent('mp-master-audio-silence', {
            detail: { source: 'arbiter_internal', reason: sourceReason, epoch: this.epoch }
          }));
        } catch (_) {}
      }
    } finally {
      this.isKilling = false;
    }
  }

  /**
   * Inicia un nuevo turno exclusivo de reproducción.
   * Cancela todo sonido anterior y provee un token único de época y señal de cancelación.
   */
  public static startTrack(source: 'voice_over' | 'chat_agent'): MasterAudioTrack {
    this.killAllAudio(source);
    this.activeSource = source;
    this.activeAbortCtrl = typeof AbortController !== 'undefined' ? new AbortController() : null;

    return {
      epoch: this.epoch,
      signal: this.activeAbortCtrl ? this.activeAbortCtrl.signal : undefined
    };
  }

  /**
   * Registra el elemento Audio actual. Si la época expiró (se emitió otra orden), lo pausa de inmediato.
   */
  public static setActiveAudio(audio: HTMLAudioElement, epoch: number): boolean {
    if (epoch !== this.epoch) {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
      } catch (_) {}
      return false;
    }
    this.activeAudio = audio;
    return true;
  }

  public static isEpochActive(epoch: number): boolean {
    return epoch === this.epoch;
  }

  public static isChatOpen(): boolean {
    if (typeof document === 'undefined') return false;
    const chatWin = document.getElementById('mp-chat-window');
    return !!(chatWin && chatWin.style.display === 'flex');
  }

  public static getActiveSource(): 'voice_over' | 'chat_agent' | null {
    return this.activeSource;
  }

  public static getCurrentEpoch(): number {
    return this.epoch;
  }
}

// Auto-inicializar en el navegador
if (typeof window !== 'undefined') {
  MasterAudioArbiter.initialize();
}
