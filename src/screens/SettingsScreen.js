export class SettingsScreen {
  constructor({ settings, onSave, onBack }) {
    this.settings = settings;
    this.onSave = onSave;
    this.onBack = onBack;
  }

  render() {
    const screen = document.createElement("main");
    screen.className = "screen shell";

    screen.innerHTML = `
      <section class="panel settings-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Configuration</p>
            <h2>Game Settings</h2>
          </div>
          <button class="button button-ghost" type="button" data-action="back">Back</button>
        </div>
        <form class="settings-form">
          <label class="field">
            <span>Player X Name</span>
            <input name="playerXName" maxlength="14" value="${this.settings.playerXName}" />
          </label>
          <label class="field">
            <span>Player O Name</span>
            <input name="playerOName" maxlength="14" value="${this.settings.playerOName}" />
          </label>
          <label class="field">
            <span>Starting Player</span>
            <select name="startingPlayer">
              <option value="X" ${this.settings.startingPlayer === "X" ? "selected" : ""}>X</option>
              <option value="O" ${this.settings.startingPlayer === "O" ? "selected" : ""}>O</option>
            </select>
          </label>
          <label class="field checkbox-field">
            <input
              type="checkbox"
              name="showScoreboard"
              ${this.settings.showScoreboard ? "checked" : ""}
            />
            <span>Show scoreboard</span>
          </label>
          <button class="button button-primary" type="submit">Save Settings</button>
        </form>
      </section>
    `;

    const form = screen.querySelector(".settings-form");

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);

      this.onSave({
        playerXName: String(formData.get("playerXName") || "").trim() || "Player X",
        playerOName: String(formData.get("playerOName") || "").trim() || "Player O",
        startingPlayer: String(formData.get("startingPlayer") || "X"),
        showScoreboard: formData.get("showScoreboard") === "on",
      });
    });

    screen
      .querySelector('[data-action="back"]')
      ?.addEventListener("click", this.onBack);

    return screen;
  }
}
