export class TitleScreen {
  constructor({ settings, stats, tracks, onStart, onOpenSettings, onResetStats }) {
    this.settings = settings;
    this.stats = stats;
    this.tracks = tracks;
    this.onStart = onStart;
    this.onOpenSettings = onOpenSettings;
    this.onResetStats = onResetStats;
  }

  render() {
    const modeLabel =
      this.settings.opponentType === "computer"
        ? `Computer / ${this.settings.aiDifficulty} / ${this.settings.aiSymbol}`
        : "Local Versus";
    const matchLabel =
      Number(this.settings.bestOf) === 1 ? "Single Round" : `Best of ${this.settings.bestOf}`;
    const selectedTrack =
      this.tracks.find((track) => track.id === this.settings.musicTrackId) || this.tracks[0];
    const musicLabel = this.settings.musicEnabled ? selectedTrack?.label || "On" : "Off";
    const soundEffectsLabel = this.settings.soundEffectsEnabled ? "On" : "Off";

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
          <button class="button button-primary" type="button" data-action="start">Start Game</button>
          <button class="button button-secondary" type="button" data-action="settings">Settings</button>
        </div>
      </section>
      <section class="panel info-grid">
        <article>
          <p class="info-label">Player X</p>
          <p class="info-value" data-field="player-x"></p>
        </article>
        <article>
          <p class="info-label">Player O</p>
          <p class="info-value" data-field="player-o"></p>
        </article>
        <article>
          <p class="info-label">Mode</p>
          <p class="info-value" data-field="mode"></p>
        </article>
        <article>
          <p class="info-label">Opener</p>
          <p class="info-value" data-field="opener"></p>
        </article>
        <article>
          <p class="info-label">Match</p>
          <p class="info-value" data-field="match"></p>
        </article>
        <article>
          <p class="info-label">Music</p>
          <p class="info-value" data-field="music"></p>
        </article>
        <article>
          <p class="info-label">SFX</p>
          <p class="info-value" data-field="sfx"></p>
        </article>
      </section>
      <section class="panel stats-panel">
        <div class="stats-panel-header">
          <div>
            <p class="eyebrow">Lifetime Record</p>
            <h2>Saved Stats</h2>
          </div>
          <button class="button button-ghost" type="button" data-action="reset-stats">Clear Record</button>
        </div>
        <div class="stats-grid">
          <article>
            <p class="info-label">Rounds</p>
            <p class="info-value" data-stat="rounds"></p>
          </article>
          <article>
            <p class="info-label">X Wins</p>
            <p class="info-value" data-stat="wins-x"></p>
          </article>
          <article>
            <p class="info-label">O Wins</p>
            <p class="info-value" data-stat="wins-o"></p>
          </article>
          <article>
            <p class="info-label">Draws</p>
            <p class="info-value" data-stat="draws"></p>
          </article>
        </div>
      </section>
    `;

    screen.querySelector('[data-field="player-x"]').textContent = this.settings.playerXName;
    screen.querySelector('[data-field="player-o"]').textContent = this.settings.playerOName;
    screen.querySelector('[data-field="mode"]').textContent = modeLabel;
    screen.querySelector('[data-field="opener"]').textContent = this.settings.startingPlayer;
    screen.querySelector('[data-field="match"]').textContent = matchLabel;
    screen.querySelector('[data-field="music"]').textContent = musicLabel;
    screen.querySelector('[data-field="sfx"]').textContent = soundEffectsLabel;
    screen.querySelector('[data-stat="rounds"]').textContent = String(this.stats.totalRounds);
    screen.querySelector('[data-stat="wins-x"]').textContent = String(this.stats.wins.X);
    screen.querySelector('[data-stat="wins-o"]').textContent = String(this.stats.wins.O);
    screen.querySelector('[data-stat="draws"]').textContent = String(this.stats.draws);

    screen
      .querySelector('[data-action="start"]')
      ?.addEventListener("click", this.onStart);
    screen
      .querySelector('[data-action="settings"]')
      ?.addEventListener("click", this.onOpenSettings);
    screen
      .querySelector('[data-action="reset-stats"]')
      ?.addEventListener("click", this.onResetStats);

    return screen;
  }
}
