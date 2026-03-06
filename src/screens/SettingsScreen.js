export class SettingsScreen {
  constructor({ settings, onSave, onBack }) {
    this.settings = settings;
    this.onSave = onSave;
    this.onBack = onBack;
  }

  render() {
    const screen = document.createElement("main");
    screen.className = "screen shell";

    const isComputerOpponent = this.settings.opponentType === "computer";

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
            <span>Opponent</span>
            <select name="opponentType">
              <option value="computer" ${isComputerOpponent ? "selected" : ""}>Computer</option>
              <option value="local" ${!isComputerOpponent ? "selected" : ""}>Local Player</option>
            </select>
          </label>
          <label class="field">
            <span>Player X Name</span>
            <input name="playerXName" maxlength="14" value="${this.settings.playerXName}" />
          </label>
          <label class="field">
            <span>Player O Name</span>
            <input
              name="playerOName"
              maxlength="14"
              value="${this.settings.playerOName}"
              ${isComputerOpponent ? "disabled" : ""}
            />
          </label>
          <label class="field ai-field ${isComputerOpponent ? "" : "is-hidden"}">
            <span>AI Difficulty</span>
            <select name="aiDifficulty">
              <option value="easy" ${this.settings.aiDifficulty === "easy" ? "selected" : ""}>Easy</option>
              <option value="medium" ${this.settings.aiDifficulty === "medium" ? "selected" : ""}>Medium</option>
              <option value="hard" ${this.settings.aiDifficulty === "hard" ? "selected" : ""}>Hard</option>
            </select>
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
          <label class="field checkbox-field">
            <input
              type="checkbox"
              name="soundEnabled"
              ${this.settings.soundEnabled ? "checked" : ""}
            />
            <span>Enable sound effects</span>
          </label>
          <button class="button button-primary" type="submit">Save Settings</button>
        </form>
      </section>
    `;

    const form = screen.querySelector(".settings-form");
    const opponentSelect = form?.querySelector('[name="opponentType"]');
    const playerOInput = form?.querySelector('[name="playerOName"]');
    const aiField = form?.querySelector(".ai-field");

    opponentSelect?.addEventListener("change", () => {
      const isComputer = opponentSelect.value === "computer";

      if (playerOInput instanceof HTMLInputElement) {
        playerOInput.disabled = isComputer;
        if (isComputer && !playerOInput.value.trim()) {
          playerOInput.value = "CPU";
        }
      }

      aiField?.classList.toggle("is-hidden", !isComputer);
    });

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const opponentType = String(formData.get("opponentType") || "computer");

      this.onSave({
        playerXName: String(formData.get("playerXName") || "").trim() || "Player X",
        playerOName:
          opponentType === "computer"
            ? "CPU"
            : String(formData.get("playerOName") || "").trim() || "Player O",
        startingPlayer: String(formData.get("startingPlayer") || "X"),
        showScoreboard: formData.get("showScoreboard") === "on",
        opponentType,
        aiDifficulty: String(formData.get("aiDifficulty") || "medium"),
        soundEnabled: formData.get("soundEnabled") === "on",
      });
    });

    screen
      .querySelector('[data-action="back"]')
      ?.addEventListener("click", this.onBack);

    return screen;
  }
}
