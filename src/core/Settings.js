const STORAGE_KEY = "tictactoe-settings";

const DEFAULT_SETTINGS = {
  playerXName: "Nova",
  playerOName: "Pixel",
  startingPlayer: "X",
  showScoreboard: true,
  opponentType: "computer",
  aiDifficulty: "medium",
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

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  getState() {
    return { ...this.state };
  }
}
