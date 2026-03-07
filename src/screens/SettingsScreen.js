export class SettingsScreen {
  constructor({ settings, tracks, onSave, onBack }) {
    this.settings = settings;
    this.tracks = tracks;
    this.onSave = onSave;
    this.onBack = onBack;
  }

  render() {
    const screen = document.createElement("main");
    screen.className = "screen shell";

    const isComputerOpponent = this.settings.opponentType === "computer";
    const aiSymbol = this.settings.aiSymbol || "O";
    const isXControlledByAi = isComputerOpponent && aiSymbol === "X";
    const isOControlledByAi = isComputerOpponent && aiSymbol === "O";
    const trackOptions = this.tracks
      .map(
        (track) =>
          `<option value="${track.id}" ${this.settings.musicTrackId === track.id ? "selected" : ""}>${track.label}</option>`,
      )
      .join("");

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
            <input
              name="playerXName"
              maxlength="14"
              ${isXControlledByAi ? "disabled" : ""}
            />
          </label>
          <label class="field">
            <span>Player O Name</span>
            <input
              name="playerOName"
              maxlength="14"
              ${isOControlledByAi ? "disabled" : ""}
            />
          </label>
          <label class="field ai-field ${isComputerOpponent ? "" : "is-hidden"}">
            <span>Computer Plays As</span>
            <select name="aiSymbol">
              <option value="O" ${aiSymbol === "O" ? "selected" : ""}>O</option>
              <option value="X" ${aiSymbol === "X" ? "selected" : ""}>X</option>
            </select>
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
          <label class="field">
            <span>Match Length</span>
            <select name="bestOf">
              <option value="1" ${Number(this.settings.bestOf) === 1 ? "selected" : ""}>Single Round</option>
              <option value="3" ${Number(this.settings.bestOf) === 3 ? "selected" : ""}>Best of 3</option>
              <option value="5" ${Number(this.settings.bestOf) === 5 ? "selected" : ""}>Best of 5</option>
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
          <label class="field">
            <span>Background Music</span>
            <select name="musicTrackId">
              ${trackOptions}
            </select>
          </label>
          <label class="field checkbox-field">
            <input
              type="checkbox"
              name="musicEnabled"
              ${this.settings.musicEnabled ? "checked" : ""}
            />
            <span>Enable music</span>
          </label>
          <label class="field volume-field">
            <span>Music Volume</span>
            <div class="range-field">
              <input
                type="range"
                name="musicVolume"
                min="0"
                max="100"
                step="1"
                value="${Number(this.settings.musicVolume ?? 18)}"
              />
              <output data-field="music-volume">${Number(this.settings.musicVolume ?? 18)}%</output>
            </div>
          </label>
          <label class="field checkbox-field">
            <input
              type="checkbox"
              name="soundEffectsEnabled"
              ${this.settings.soundEffectsEnabled ? "checked" : ""}
            />
            <span>Enable sound effects</span>
          </label>
          <label class="field volume-field">
            <span>Sound Effects Volume</span>
            <div class="range-field">
              <input
                type="range"
                name="soundEffectsVolume"
                min="0"
                max="100"
                step="1"
                value="${Number(this.settings.soundEffectsVolume ?? 45)}"
              />
              <output data-field="sound-effects-volume">${Number(this.settings.soundEffectsVolume ?? 45)}%</output>
            </div>
          </label>
          <button class="button button-primary" type="submit">Save Settings</button>
        </form>
      </section>
    `;

    const form = screen.querySelector(".settings-form");
    const opponentSelect = form?.querySelector('[name="opponentType"]');
    const aiSymbolSelect = form?.querySelector('[name="aiSymbol"]');
    const playerXInput = form?.querySelector('[name="playerXName"]');
    const playerOInput = form?.querySelector('[name="playerOName"]');
    const aiFields = form?.querySelectorAll(".ai-field");
    const musicVolumeInput = form?.querySelector('[name="musicVolume"]');
    const soundEffectsVolumeInput = form?.querySelector('[name="soundEffectsVolume"]');
    const musicVolumeOutput = form?.querySelector('[data-field="music-volume"]');
    const soundEffectsVolumeOutput = form?.querySelector('[data-field="sound-effects-volume"]');

    if (playerXInput instanceof HTMLInputElement) {
      playerXInput.value = this.settings.playerXName;
    }

    if (playerOInput instanceof HTMLInputElement) {
      playerOInput.value = this.settings.playerOName;
    }

    const syncComputerFields = () => {
      if (!opponentSelect || !form) {
        return;
      }

      const isComputer = opponentSelect.value === "computer";
      const selectedAiSymbol = aiSymbolSelect instanceof HTMLSelectElement ? aiSymbolSelect.value : "O";

      aiFields?.forEach((field) => field.classList.toggle("is-hidden", !isComputer));

      if (playerXInput instanceof HTMLInputElement) {
        const disableX = isComputer && selectedAiSymbol === "X";
        playerXInput.disabled = disableX;
        if (disableX) {
          playerXInput.value = "CPU";
        }
      }

      if (playerOInput instanceof HTMLInputElement) {
        const disableO = isComputer && selectedAiSymbol === "O";
        playerOInput.disabled = disableO;
        if (disableO) {
          playerOInput.value = "CPU";
        }
      }
    };

    opponentSelect?.addEventListener("change", () => {
      syncComputerFields();
    });
    aiSymbolSelect?.addEventListener("change", syncComputerFields);
    syncComputerFields();

    const syncVolumeLabel = (input, output) => {
      if (!(input instanceof HTMLInputElement) || !(output instanceof HTMLOutputElement)) {
        return;
      }

      output.value = `${input.value}%`;
      output.textContent = output.value;
    };

    syncVolumeLabel(musicVolumeInput, musicVolumeOutput);
    syncVolumeLabel(soundEffectsVolumeInput, soundEffectsVolumeOutput);
    musicVolumeInput?.addEventListener("input", () => syncVolumeLabel(musicVolumeInput, musicVolumeOutput));
    soundEffectsVolumeInput?.addEventListener("input", () =>
      syncVolumeLabel(soundEffectsVolumeInput, soundEffectsVolumeOutput),
    );

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const opponentType = String(formData.get("opponentType") || "computer");
      const selectedAiSymbol = String(formData.get("aiSymbol") || "O");

      const playerXName =
        opponentType === "computer" && selectedAiSymbol === "X"
          ? "CPU"
          : String(formData.get("playerXName") || "").trim() || "Player X";
      const playerOName =
        opponentType === "computer" && selectedAiSymbol === "O"
          ? "CPU"
          : String(formData.get("playerOName") || "").trim() || "Player O";

      this.onSave({
        playerXName,
        playerOName,
        startingPlayer: String(formData.get("startingPlayer") || "X"),
        showScoreboard: formData.get("showScoreboard") === "on",
        opponentType,
        aiSymbol: selectedAiSymbol,
        aiDifficulty: String(formData.get("aiDifficulty") || "medium"),
        bestOf: Number(formData.get("bestOf") || 3),
        musicTrackId: String(formData.get("musicTrackId") || "ode-to-joy"),
        musicEnabled: formData.get("musicEnabled") === "on",
        soundEffectsEnabled: formData.get("soundEffectsEnabled") === "on",
        musicVolume: Number(formData.get("musicVolume") || 18),
        soundEffectsVolume: Number(formData.get("soundEffectsVolume") || 45),
      });
    });

    screen
      .querySelector('[data-action="back"]')
      ?.addEventListener("click", this.onBack);

    return screen;
  }
}
