export class GameScreen {
  constructor({ game, settings, aiPlayer, score, onRoundComplete, onRestart, onOpenMenu }) {
    this.game = game;
    this.settings = settings;
    this.aiPlayer = aiPlayer;
    this.score = score;
    this.onRoundComplete = onRoundComplete;
    this.onRestart = onRestart;
    this.onOpenMenu = onOpenMenu;
    this.roundFinished = false;
    this.aiMoveTimeout = null;
    this.isAiThinking = false;
  }

  render() {
    const screen = document.createElement("main");
    screen.className = "screen shell";
    screen.append(this.buildLayout(screen));
    this.maybePlayAiTurn(screen);
    return screen;
  }

  buildLayout(screen) {
    const wrapper = document.createElement("section");
    wrapper.className = "game-layout";

    const sidebar = document.createElement("aside");
    sidebar.className = "panel side-panel";
    sidebar.innerHTML = `
      <p class="eyebrow">Live Match</p>
      <h2>${this.game.getPlayerName("X")} vs ${this.game.getPlayerName("O")}</h2>
      <p class="mode-pill">${this.getModeLabel()}</p>
      <p class="status-text">${this.game.getStatus()}</p>
      <div class="action-stack">
        <button class="button button-primary" type="button" data-action="restart">Restart</button>
        <button class="button button-secondary" type="button" data-action="menu">Main Menu</button>
      </div>
    `;

    if (this.settings.showScoreboard) {
      const scoreCard = document.createElement("div");
      scoreCard.className = "score-card";
      scoreCard.innerHTML = `
        <p class="info-label">Scoreboard</p>
        <div class="score-row">
          <span>${this.game.getPlayerName("X")}</span>
          <strong data-score="X">${this.score.X}</strong>
        </div>
        <div class="score-row">
          <span>${this.game.getPlayerName("O")}</span>
          <strong data-score="O">${this.score.O}</strong>
        </div>
      `;
      sidebar.append(scoreCard);
    }

    const boardPanel = document.createElement("section");
    boardPanel.className = "panel board-panel";

    const board = document.createElement("div");
    board.className = "board";
    board.setAttribute("role", "grid");
    board.setAttribute("aria-label", "Tic Tac Toe board");

    this.cells = [];

    this.game.board.forEach((cellValue, index) => {
      const button = document.createElement("button");
      button.className = "cell";
      button.type = "button";
      button.setAttribute("role", "gridcell");
      button.dataset.index = String(index);
      button.textContent = cellValue || "";
      button.addEventListener("click", () => this.handleMove(index, screen));
      this.cells.push(button);
      board.append(button);
    });

    boardPanel.append(board);
    wrapper.append(sidebar, boardPanel);

    sidebar
      .querySelector('[data-action="restart"]')
      ?.addEventListener("click", this.onRestart);
    sidebar
      .querySelector('[data-action="menu"]')
      ?.addEventListener("click", this.onOpenMenu);

    return wrapper;
  }

  handleMove(index, screen) {
    if (this.isAiTurn()) {
      return;
    }

    const moved = this.game.makeMove(index);

    if (!moved) {
      return;
    }

    this.refreshBoard(screen);
    this.completeRoundIfNeeded(screen);
    this.maybePlayAiTurn(screen);
  }

  refreshBoard(screen) {
    this.cells.forEach((cell, index) => {
      cell.textContent = this.game.board[index] || "";
      cell.disabled =
        Boolean(this.game.board[index]) || this.game.isFinished() || this.isAiThinking;
      cell.classList.toggle("winning-cell", this.game.winningLine.includes(index));
    });

    const status = screen.querySelector(".status-text");
    if (status) {
      status.textContent = this.game.getStatus();
    }
  }

  refreshScore(screen, symbol) {
    const scoreElement = screen.querySelector(`[data-score="${symbol}"]`);
    if (scoreElement) {
      scoreElement.textContent = String(this.score[symbol]);
    }
  }

  completeRoundIfNeeded(screen) {
    if ((this.game.winner || this.game.isDraw()) && !this.roundFinished) {
      this.roundFinished = true;
      this.onRoundComplete(this.game.winner);
      if (this.game.winner) {
        this.refreshScore(screen, this.game.winner);
      }
    }
  }

  maybePlayAiTurn(screen) {
    if (!this.isAiTurn() || this.game.isFinished()) {
      return;
    }

    this.isAiThinking = true;
    this.updateStatusText(screen, "Computer is thinking...");
    this.refreshBoard(screen);

    this.aiMoveTimeout = window.setTimeout(() => {
      const move = this.aiPlayer.chooseMove(this.game, this.settings.aiDifficulty);
      this.isAiThinking = false;

      if (move !== null) {
        this.game.makeMove(move);
      }

      this.refreshBoard(screen);
      this.completeRoundIfNeeded(screen);
    }, 450);
  }

  isAiTurn() {
    return (
      this.settings.opponentType === "computer" &&
      this.game.currentPlayer === this.aiPlayer.symbol &&
      !this.roundFinished
    );
  }

  getModeLabel() {
    if (this.settings.opponentType === "computer") {
      return `Computer · ${this.settings.aiDifficulty}`;
    }

    return "Local Versus";
  }

  updateStatusText(screen, message) {
    const status = screen.querySelector(".status-text");
    if (status) {
      status.textContent = message;
    }
  }

  destroy() {
    if (this.aiMoveTimeout) {
      window.clearTimeout(this.aiMoveTimeout);
    }
  }
}
