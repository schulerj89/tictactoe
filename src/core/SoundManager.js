export class SoundManager {
  constructor() {
    this.audioContext = null;
  }

  playMove(symbol, enabled) {
    if (!enabled) {
      return;
    }

    const frequency = symbol === "X" ? 420 : 320;
    this.playTone(frequency, 0.07, "triangle", 0.03);
  }

  playWin(enabled) {
    if (!enabled) {
      return;
    }

    this.playTone(523.25, 0.08, "sine", 0.035, 0);
    this.playTone(659.25, 0.1, "sine", 0.035, 0.08);
    this.playTone(783.99, 0.12, "sine", 0.035, 0.16);
  }

  playDraw(enabled) {
    if (!enabled) {
      return;
    }

    this.playTone(280, 0.08, "square", 0.025, 0);
    this.playTone(240, 0.08, "square", 0.025, 0.08);
  }

  playTone(frequency, duration, type, gainValue, delay = 0) {
    try {
      const context = this.getContext();
      const startAt = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startAt);

      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.02);
    } catch {
      // Ignore autoplay or audio-context startup failures.
    }
  }

  getContext() {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        throw new Error("Web Audio API is unavailable in this browser.");
      }

      this.audioContext = new AudioContextClass();
    }

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    return this.audioContext;
  }
}
