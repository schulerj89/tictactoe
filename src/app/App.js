import { Game } from "../core/Game.js";
import { Settings } from "../core/Settings.js";
import { AIPlayer } from "../core/AIPlayer.js";
import { SoundManager } from "../core/SoundManager.js";
import { StatsStore } from "../core/StatsStore.js";
import { GameScreen } from "../screens/GameScreen.js";
import { SettingsScreen } from "../screens/SettingsScreen.js";
import { TitleScreen } from "../screens/TitleScreen.js";

export class App {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.settings = new Settings();
    this.game = new Game();
    this.aiPlayer = new AIPlayer("O");
    this.soundManager = new SoundManager();
    this.statsStore = new StatsStore();
    this.matchScore = {
      X: 0,
      O: 0,
    };
    this.lifetimeStats = this.statsStore.getState();
    this.activeScreen = null;
  }

  start() {
    this.showTitleScreen();
  }

  showTitleScreen() {
    const settings = this.resolveSettings();
    this.soundManager.applySettings(settings);

    this.renderScreen(
      new TitleScreen({
        settings,
        stats: this.lifetimeStats,
        tracks: this.soundManager.getAvailableTracks(),
        onStart: () => this.startGame(),
        onOpenSettings: () => this.showSettingsScreen(),
      }),
    );
  }

  showSettingsScreen() {
    const settings = this.settings.getState();
    this.soundManager.applySettings(settings);

    this.renderScreen(
      new SettingsScreen({
        settings,
        tracks: this.soundManager.getAvailableTracks(),
        onSave: (updates) => {
          this.settings.update(updates);
          this.soundManager.applySettings(this.settings.getState());
          this.showTitleScreen();
        },
        onBack: () => this.showTitleScreen(),
      }),
    );
  }

  startGame({ resetMatchScore = true } = {}) {
    const settings = this.resolveSettings();
    this.soundManager.applySettings(settings);

    if (resetMatchScore) {
      this.matchScore.X = 0;
      this.matchScore.O = 0;
    }

    this.aiPlayer.symbol = settings.aiSymbol;
    this.game.start(settings);

    this.renderScreen(
      new GameScreen({
        game: this.game,
        settings,
        aiPlayer: this.aiPlayer,
        soundManager: this.soundManager,
        score: this.matchScore,
        stats: this.lifetimeStats,
        onRoundComplete: (winner) => {
          const latestStats = this.statsStore.recordResult(winner);
          let matchWinner = null;

          if (winner) {
            this.matchScore[winner] += 1;
            if (this.matchScore[winner] >= this.getWinsNeeded(settings.bestOf)) {
              matchWinner = winner;
            }
          }

          Object.assign(this.lifetimeStats, latestStats);

          return {
            matchWinner,
            stats: this.lifetimeStats,
          };
        },
        onNextRound: () => this.startGame({ resetMatchScore: false }),
        onRestartMatch: () => this.startGame({ resetMatchScore: true }),
        onOpenMenu: () => this.showTitleScreen(),
      }),
    );
  }

  renderScreen(screen) {
    if (this.activeScreen?.destroy) {
      this.activeScreen.destroy();
    }

    this.activeScreen = screen;
    this.rootElement.innerHTML = "";
    this.rootElement.append(screen.render());
  }

  resolveSettings() {
    const settings = this.settings.getState();

    if (settings.opponentType !== "computer") {
      return settings;
    }

    const aiSymbol = settings.aiSymbol || "O";
    const humanSymbol = aiSymbol === "X" ? "O" : "X";

    return {
      ...settings,
      aiSymbol,
      playerXName: aiSymbol === "X" ? "CPU" : settings.playerXName,
      playerOName: aiSymbol === "O" ? "CPU" : settings.playerOName,
      humanSymbol,
    };
  }

  getWinsNeeded(bestOf) {
    return Math.floor(bestOf / 2) + 1;
  }
}
