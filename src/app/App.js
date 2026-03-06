import { Game } from "../core/Game.js";
import { Settings } from "../core/Settings.js";
import { GameScreen } from "../screens/GameScreen.js";
import { SettingsScreen } from "../screens/SettingsScreen.js";
import { TitleScreen } from "../screens/TitleScreen.js";

export class App {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.settings = new Settings();
    this.game = new Game();
    this.score = {
      X: 0,
      O: 0,
    };
    this.activeScreen = null;
  }

  start() {
    this.showTitleScreen();
  }

  showTitleScreen() {
    this.renderScreen(
      new TitleScreen({
        settings: this.settings.getState(),
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

  startGame() {
    this.game.start(this.settings.getState());

    this.renderScreen(
      new GameScreen({
        game: this.game,
        settings: this.settings.getState(),
        score: this.score,
        onRoundComplete: (winner) => {
          if (winner) {
            this.score[winner] += 1;
          }
        },
        onRestart: () => this.startGame(),
        onOpenMenu: () => this.showTitleScreen(),
      }),
    );
  }

  renderScreen(screen) {
    this.activeScreen = screen;
    this.rootElement.innerHTML = "";
    this.rootElement.append(screen.render());
  }
}
