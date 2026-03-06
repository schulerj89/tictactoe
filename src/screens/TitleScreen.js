export class TitleScreen {
  constructor({ settings, onStart, onOpenSettings }) {
    this.settings = settings;
    this.onStart = onStart;
    this.onOpenSettings = onOpenSettings;
  }

  render() {
    const modeLabel =
      this.settings.opponentType === "computer"
        ? `Computer · ${this.settings.aiDifficulty}`
        : "Local Versus";

    const screen = document.createElement("main");
    screen.className = "screen shell";

    screen.innerHTML = `
      <section class="panel hero-panel">
        <p class="eyebrow">Arcade Mode</p>
        <h1 class="hero-title">Tic Tac Toe</h1>
        <p class="hero-copy">
          A small strategy game with a clean OOP core, a title screen, and settings
          that can grow with the project.
        </p>
        <div class="hero-actions">
          <button class="button button-primary" data-action="start">Start Game</button>
          <button class="button button-secondary" data-action="settings">Settings</button>
        </div>
      </section>
      <section class="panel info-grid">
        <article>
          <p class="info-label">Player X</p>
          <p class="info-value">${this.settings.playerXName}</p>
        </article>
        <article>
          <p class="info-label">Player O</p>
          <p class="info-value">${this.settings.playerOName}</p>
        </article>
        <article>
          <p class="info-label">Mode</p>
          <p class="info-value">${modeLabel}</p>
        </article>
        <article>
          <p class="info-label">Opener</p>
          <p class="info-value">${this.settings.startingPlayer}</p>
        </article>
      </section>
    `;

    screen
      .querySelector('[data-action="start"]')
      ?.addEventListener("click", this.onStart);
    screen
      .querySelector('[data-action="settings"]')
      ?.addEventListener("click", this.onOpenSettings);

    return screen;
  }
}
