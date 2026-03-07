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
  soundEnabled: true,
};

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

      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
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
