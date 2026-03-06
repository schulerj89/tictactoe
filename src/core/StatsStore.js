const STORAGE_KEY = "tictactoe-stats";

const DEFAULT_STATS = {
  totalRounds: 0,
  draws: 0,
  wins: {
    X: 0,
    O: 0,
  },
};

export class StatsStore {
  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return structuredClone(DEFAULT_STATS);
      }

      const parsed = JSON.parse(saved);

      return {
        ...structuredClone(DEFAULT_STATS),
        ...parsed,
        wins: {
          ...DEFAULT_STATS.wins,
          ...(parsed.wins || {}),
        },
      };
    } catch {
      return structuredClone(DEFAULT_STATS);
    }
  }

  save() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  recordResult(winner) {
    this.state.totalRounds += 1;

    if (winner === "X" || winner === "O") {
      this.state.wins[winner] += 1;
    } else {
      this.state.draws += 1;
    }

    this.save();
    return this.getState();
  }

  getState() {
    return structuredClone(this.state);
  }
}
