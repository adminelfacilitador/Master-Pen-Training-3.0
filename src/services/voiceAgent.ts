// Michael Pen Agent & Course Narrator Voice Synthesis (TTS)
// Warm, gentlemanly, polite, patient, human-cadence Latin American Spanish male voice without loops or repetition

export class VoiceAgent {
  private static isSpeaking = false;
  private static activeUtterance: SpeechSynthesisUtterance | null = null;
  private static cachedVoices: SpeechSynthesisVoice[] = [];
  private static currentAudio: HTMLAudioElement | null = null;

  static {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  public static cleanTextForNarration(text: string): string {
    return text
      .replace(/[*_#`~\[\]\(\)\{\}]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[•–—]/g, '-')
      .replace(/[^\w\s.,;:?!¡¿áéíóúÁÉÍÓÚñÑüÜ$€-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Select the best, deep mature Latin American Spanish male voice, strictly excluding female voices and Spain (es-ES)
  public static getBestSpanishMaleVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

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
      'esperanza', 'es-es-x-ana', 'es-us-x-sfb', 'es-us-x-esf', 'google español'
    ];

    const MALE_NAMES_AND_TOKENS = [
      'jorge', 'raul', 'diego', 'carlos', 'alonso', 'miguel', 'pablo',
      'mateo', 'gonzalo', 'andres', 'juan', 'enrique', 'luis', 'hombre',
      'male', 'varon', 'caballero', 'baritone', '#male', 'male_1', 'male_2',
      'david', 'federico', 'gabriel', 'alberto', 'mario', 'roberto', 'hector',
      'manuel', 'francisco', 'javier', 'jose', 'antonio', 'alvaro', 'alejandro',
      'fernando', 'gerardo', 'pedro', 'arturo', 'armando', 'sergio', 'ignacio',
      'rodrigo', 'guillermo', 'cesar', 'julio', 'marcos', 'ramon', 'tomas',
      'felipe', 'gustavo', 'adolfo', 'victor', 'hugo', 'eduardo', 'emilio',
      'esteban', 'sebastian', 'valentin', 'dario', 'lucas', 'nicolas', 'santiago',
      'martin', 'matias', 'joaquin', 'cristian', 'damian', 'ernesto', 'humberto',
      'orlando', 'ricardo', 'salvador', 'natural - spanish', 'es-us-x-sfd', 'es-us-x-esd'
    ];

    // Refrescar lista de voces en tiempo real si el navegador las cargó de forma asíncrona
    const liveVoices = window.speechSynthesis.getVoices();
    const allVoices = (liveVoices && liveVoices.length > 0) ? liveVoices : this.cachedVoices;
    if (!allVoices || allVoices.length === 0) return null;

    // 1. Filtrar todas las voces en español
    const allSpanishVoices = allVoices.filter(v => {
      const langLower = (v.lang || '').toLowerCase();
      return langLower.startsWith('es') || langLower.includes('419');
    });

    // Descartar categóricamente cualquier voz con indicadores femeninos
    const nonFemaleVoices = allSpanishVoices.filter(v => {
      const nameLower = (v.name || '').toLowerCase();
      const uriLower = (v.voiceURI || '').toLowerCase();
      const isFemale = FEMALE_INDICATORS.some(f => nameLower.includes(f) || uriLower.includes(f));
      return !isFemale;
    });

    // 2. Prioridad A: Voces masculinas confirmadas en Español Latinoamericano (es-419, es-MX, es-US, es-CO, etc.)
    const latinAmericanNonFemale = nonFemaleVoices.filter(v => {
      const langLower = (v.lang || '').toLowerCase();
      const uriLower = (v.voiceURI || '').toLowerCase();
      const isPeninsular = langLower.includes('es-es') || uriLower.includes('spain');
      return !isPeninsular;
    });

    for (const maleToken of MALE_NAMES_AND_TOKENS) {
      const maleMatch = latinAmericanNonFemale.find(v => {
        const nameLower = (v.name || '').toLowerCase();
        const uriLower = (v.voiceURI || '').toLowerCase();
        return nameLower.includes(maleToken) || uriLower.includes(maleToken);
      });
      if (maleMatch) {
        return maleMatch;
      }
    }

    // 3. Prioridad B: Cualquier voz masculina confirmada en español
    for (const maleToken of MALE_NAMES_AND_TOKENS) {
      const maleMatch = nonFemaleVoices.find(v => {
        const nameLower = (v.name || '').toLowerCase();
        const uriLower = (v.voiceURI || '').toLowerCase();
        return nameLower.includes(maleToken) || uriLower.includes(maleToken);
      });
      if (maleMatch) {
        return maleMatch;
      }
    }

    // 4. Prioridad C: Voz no femenina latinoamericana
    if (latinAmericanNonFemale.length > 0) {
      return latinAmericanNonFemale[0];
    }

    // 5. Prioridad D: Cualquier voz en español no femenina
    if (nonFemaleVoices.length > 0) {
      return nonFemaleVoices[0];
    }

    // 6. Si no hay voces en español masculinas, buscar cualquier voz masculina del sistema
    const allNonFemale = allVoices.filter(v => {
      const nameLower = (v.name || '').toLowerCase();
      const uriLower = (v.voiceURI || '').toLowerCase();
      return !FEMALE_INDICATORS.some(f => nameLower.includes(f) || uriLower.includes(f));
    });
    for (const maleToken of MALE_NAMES_AND_TOKENS) {
      const match = allNonFemale.find(v => {
        const nameLower = (v.name || '').toLowerCase();
        const uriLower = (v.voiceURI || '').toLowerCase();
        return nameLower.includes(maleToken) || uriLower.includes(maleToken);
      });
      if (match) return match;
    }

    return null;
  }

  /**
   * Speaks using Michael Pen's professional Latin American masculine voice.
   * Prioritizes high-definition Gemini TTS (Charon voice) to ensure 100% masculine baritone tone,
   * with seamless fallback to Web Speech API.
   */
  public static speakMichaelPen(
    text: string, 
    onStart?: () => void, 
    onEnd?: () => void,
    onProgressSentence?: (sentence: string, index: number, total: number) => void
  ): void {
    // Single Voice Sentinel: Apagar de inmediato cualquier voz anterior
    this.stopSpeaking();

    const cleaned = this.cleanTextForNarration(text);
    if (!cleaned) {
      if (onEnd) onEnd();
      return;
    }

    this.isSpeaking = true;
    if (onStart) onStart();

    // 1. Intento de voz de alta fidelidad masculina vía backend Gemini TTS (Charon)
    fetch('/api/tts/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleaned, voice: 'Charon' })
    })
      .then(res => {
        if (!res.ok) throw new Error('TTS server status ' + res.status);
        return res.json();
      })
      .then(data => {
        if (!this.isSpeaking) return;
        if (data && data.audioBase64) {
          const audio = new Audio('data:audio/wav;base64,' + data.audioBase64);
          this.currentAudio = audio;
          audio.onended = () => {
            this.isSpeaking = false;
            this.currentAudio = null;
            if (onEnd) onEnd();
          };
          audio.onerror = () => {
            this.currentAudio = null;
            this.speakWithWebSpeechFallback(cleaned, onStart, onEnd, onProgressSentence);
          };
          audio.play().catch(() => {
            this.speakWithWebSpeechFallback(cleaned, onStart, onEnd, onProgressSentence);
          });
        } else {
          this.speakWithWebSpeechFallback(cleaned, onStart, onEnd, onProgressSentence);
        }
      })
      .catch(() => {
        this.speakWithWebSpeechFallback(cleaned, onStart, onEnd, onProgressSentence);
      });
  }

  private static speakWithWebSpeechFallback(
    cleaned: string,
    onStart?: () => void,
    onEnd?: () => void,
    onProgressSentence?: (sentence: string, index: number, total: number) => void
  ): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      return;
    }

    const rawSentences = cleaned.match(/[^.!?¡¿]+[.!?¡¿]+|[^.!?¡¿]+$/g) || [cleaned];
    const sentences = rawSentences.map(s => s.trim()).filter(s => s.length > 0);

    if (sentences.length === 0) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      return;
    }

    const selectedVoice = this.getBestSpanishMaleVoice();
    let currentIndex = 0;

    const speakNextSentence = () => {
      if (!this.isSpeaking || currentIndex >= sentences.length) {
        this.isSpeaking = false;
        this.activeUtterance = null;
        if (onEnd) onEnd();
        return;
      }

      const sentenceText = sentences[currentIndex];
      if (onProgressSentence) {
        onProgressSentence(sentenceText, currentIndex, sentences.length);
      }

      const utterance = new SpeechSynthesisUtterance(sentenceText);
      utterance.lang = 'es-419';
      utterance.rate = 0.90;
      utterance.pitch = selectedVoice ? 0.45 : 0.35;
      utterance.volume = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        currentIndex++;
        setTimeout(() => {
          if (this.isSpeaking) {
            speakNextSentence();
          }
        }, 40);
      };

      utterance.onerror = (e) => {
        console.warn('[VoiceAgent] Fallback speech error notice:', e);
        this.isSpeaking = false;
        this.activeUtterance = null;
        if (onEnd) onEnd();
      };

      this.activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakNextSentence();
  }

  public static stopSpeaking(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.activeUtterance = null;
    }
    this.isSpeaking = false;
  }

  public static pauseSpeaking(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    if (typeof window !== 'undefined' && window.speechSynthesis && this.isSpeaking) {
      window.speechSynthesis.pause();
    }
  }

  public static resumeSpeaking(): void {
    if (this.currentAudio) {
      this.currentAudio.play();
    }
    if (typeof window !== 'undefined' && window.speechSynthesis && this.isSpeaking) {
      window.speechSynthesis.resume();
    }
  }

  public static getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }
}
