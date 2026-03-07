export class SoundManager {
  constructor({ baseUrl = import.meta.env?.BASE_URL || "/" } = {}) {
    this.audioContext = null;
    this.musicAudio = null;
    this.musicEnabled = true;
    this.soundEffectsEnabled = true;
    this.currentTrackId = "ode-to-joy";
    this.baseUrl = this.resolveBaseUrl(baseUrl);
    this.trackMap = {
      "ode-to-joy": {
        id: "ode-to-joy",
        label: "Ode to Joy",
        source: this.resolveTrackSource("ode-to-joy-8bit.wav"),
        credit: "Ludwig van Beethoven",
      },
      "fur-elise": {
        id: "fur-elise",
        label: "Fur Elise",
        source: this.resolveTrackSource("fur-elise-8bit.wav"),
        credit: "Ludwig van Beethoven",
      },
      "minuet-in-g": {
        id: "minuet-in-g",
        label: "Minuet in G",
        source: this.resolveTrackSource("minuet-in-g-8bit.wav"),
        credit: "Christian Petzold / J.S. Bach notebook",
      },
    };
  }

  normalizeBaseUrl(baseUrl) {
    if (!baseUrl) {
      return "/";
    }

    return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  }

  resolveBaseUrl(baseUrl) {
    const normalizedBaseUrl = this.normalizeBaseUrl(baseUrl);

    if (normalizedBaseUrl !== "/" || typeof window === "undefined") {
      return normalizedBaseUrl;
    }

    if (typeof document !== "undefined" && document.baseURI) {
      try {
        const basePath = new URL(document.baseURI).pathname;
        const normalizedDocumentBase = this.normalizeBaseUrl(basePath);

        if (normalizedDocumentBase !== "/") {
          return normalizedDocumentBase;
        }
      } catch {
        // Ignore invalid base URIs and fall back to location heuristics.
      }
    }

    const { hostname = "", pathname = "/" } = window.location;
    const pathSegments = pathname.split("/").filter(Boolean);

    if (hostname.endsWith("github.io") && pathSegments.length > 0) {
      return `/${pathSegments[0]}/`;
    }

    return normalizedBaseUrl;
  }

  resolveTrackSource(fileName) {
    return `${this.baseUrl}audio/${fileName}`;
  }

  getAvailableTracks() {
    return Object.values(this.trackMap).map((track) => ({ ...track }));
  }

  getTrack(trackId) {
    return this.trackMap[trackId] || this.trackMap[this.currentTrackId] || this.trackMap["ode-to-joy"];
  }

  applySettings({ musicEnabled = true, soundEffectsEnabled = true, musicTrackId = "ode-to-joy" } = {}) {
    this.musicEnabled = musicEnabled;
    this.soundEffectsEnabled = soundEffectsEnabled;

    if (this.currentTrackId !== musicTrackId) {
      this.currentTrackId = this.trackMap[musicTrackId] ? musicTrackId : "ode-to-joy";
      this.stopMusic();
    } else {
      this.currentTrackId = this.trackMap[musicTrackId] ? musicTrackId : this.currentTrackId;
    }

    if (this.musicEnabled) {
      this.playMusic();
      return;
    }

    this.stopMusic();
  }

  playMove(symbol) {
    if (!this.soundEffectsEnabled) {
      return;
    }

    const frequency = symbol === "X" ? 420 : 320;
    this.playTone(frequency, 0.07, "triangle", 0.03);
  }

  playWin() {
    if (!this.soundEffectsEnabled) {
      return;
    }

    this.playTone(523.25, 0.08, "sine", 0.035, 0);
    this.playTone(659.25, 0.1, "sine", 0.035, 0.08);
    this.playTone(783.99, 0.12, "sine", 0.035, 0.16);
  }

  playDraw() {
    if (!this.soundEffectsEnabled) {
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

  playMusic() {
    const track = this.getTrack(this.currentTrackId);
    const audio = this.ensureMusicAudio(track.source);

    if (!audio.paused && audio.dataset.trackId === track.id) {
      return;
    }

    audio.dataset.trackId = track.id;
    if (audio.src !== track.source && audio.src !== `${window.location.origin}${track.source}`) {
      audio.src = track.source;
    }

    audio.currentTime = 0;
    const playback = audio.play();
    if (playback?.catch) {
      playback.catch(() => {
        // Ignore autoplay rejections until the next user gesture.
      });
    }
  }

  stopMusic() {
    if (!this.musicAudio) {
      return;
    }

    this.musicAudio.pause();
    this.musicAudio.currentTime = 0;
  }

  ensureMusicAudio(source) {
    if (!this.musicAudio) {
      this.musicAudio = new Audio(source);
      this.musicAudio.loop = true;
      this.musicAudio.volume = 0.32;
      this.musicAudio.preload = "auto";
      return this.musicAudio;
    }

    return this.musicAudio;
  }
}
