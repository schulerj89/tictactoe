const STORAGE_KEY = "tictactoe-settings";

const DEFAULT_SETTINGS = {
  playerXName: "Nova",
  playerOName: "Pixel",
  startingPlayer: "X",
  showScoreboard: true,
  opponentType: "computer",
  aiSymbol: "O",
  aiDifficulty: "medium",
  bestOf: 3,
  musicEnabled: true,
  soundEffectsEnabled: true,
  musicTrackId: "ode-to-joy",
  musicVolume: 18,
  soundEffectsVolume: 45,
};

function normalizeVolume(value, fallback) {
  const normalizedValue = Number(value);

  if (!Number.isFinite(normalizedValue)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, Math.round(normalizedValue)));
}

export class Settings {
  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return { ...DEFAULT_SETTINGS };
      }

      const parsed = JSON.parse(saved);
      const hasLegacySoundFlag = typeof parsed.soundEnabled === "boolean";
      const musicEnabled =
        typeof parsed.musicEnabled === "boolean"
          ? parsed.musicEnabled
          : hasLegacySoundFlag
            ? parsed.soundEnabled
            : DEFAULT_SETTINGS.musicEnabled;
      const soundEffectsEnabled =
        typeof parsed.soundEffectsEnabled === "boolean"
          ? parsed.soundEffectsEnabled
          : hasLegacySoundFlag
            ? parsed.soundEnabled
            : DEFAULT_SETTINGS.soundEffectsEnabled;

      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        musicEnabled,
        soundEffectsEnabled,
        musicVolume: normalizeVolume(parsed.musicVolume, DEFAULT_SETTINGS.musicVolume),
        soundEffectsVolume: normalizeVolume(
          parsed.soundEffectsVolume,
          DEFAULT_SETTINGS.soundEffectsVolume,
        ),
      };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  update(updates) {
    this.state = {
      ...this.state,
      ...updates,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore persistence failures and keep the in-memory state usable.
    }
  }

  getState() {
    return { ...this.state };
  }
}
