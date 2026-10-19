import { VoiceAgent } from './voiceAgent';

class MichaelPenSpeechService {
  private isMuted: boolean = false;

  public speak(text: string): void {
    if (this.isMuted) return;
    VoiceAgent.speakMichaelPen(text);
  }

  public stop(): void {
    VoiceAgent.stopSpeaking();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) this.stop();
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const michaelPenSpeech = new MichaelPenSpeechService();

