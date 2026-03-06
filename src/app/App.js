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
    this.renderScreen(
      new TitleScreen({
        settings: this.settings.getState(),
        stats: this.lifetimeStats,
        onStart: () => this.startGame(),
        onOpenSettings: () => this.showSettingsScreen(),
      }),
    );
  }

  showSettingsScreen() {
    this.renderScreen(
      new SettingsScreen({
        settings: this.settings.getState(),
        onSave: (updates) => {
          this.settings.update(updates);
          this.showTitleScreen();
        },
        onBack: () => this.showTitleScreen(),
      }),
    );
  }

  startGame({ resetMatchScore = true } = {}) {
    const settings = this.settings.getState();

    if (resetMatchScore) {
      this.matchScore.X = 0;
      this.matchScore.O = 0;
    }

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

          if (winner) {
            this.matchScore[winner] += 1;
          }

          Object.assign(this.lifetimeStats, latestStats);
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
}
