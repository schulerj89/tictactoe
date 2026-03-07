export class GameScreen {
  constructor({
    game,
    settings,
    aiPlayer,
    soundManager,
    score,
    stats,
    onRoundComplete,
    onNextRound,
    onRestartMatch,
    onOpenMenu,
  }) {
    this.game = game;
    this.settings = settings;
    this.aiPlayer = aiPlayer;
    this.soundManager = soundManager;
    this.score = score;
    this.stats = stats;
    this.onRoundComplete = onRoundComplete;
    this.onNextRound = onNextRound;
    this.onRestartMatch = onRestartMatch;
    this.onOpenMenu = onOpenMenu;
    this.roundFinished = false;
    this.aiMoveTimeout = null;
    this.isAiThinking = false;
    this.matchWinner = null;
  }

  render() {
    const screen = document.createElement("main");
    screen.className = "screen shell";
    screen.append(this.buildLayout(screen), this.buildRoundModal());
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
      <h2 data-field="matchup"></h2>
      <p class="mode-pill" data-field="mode"></p>
      <p class="match-target" data-field="target"></p>
      <p class="status-text" data-field="status"></p>
      <div class="action-stack">
        <button class="button button-primary" type="button" data-action="restart">New Match</button>
        <button class="button button-secondary" type="button" data-action="menu">Main Menu</button>
      </div>
    `;

    sidebar.querySelector('[data-field="matchup"]').textContent =
      `${this.game.getPlayerName("X")} vs ${this.game.getPlayerName("O")}`;
    sidebar.querySelector('[data-field="mode"]').textContent = this.getModeLabel();
    sidebar.querySelector('[data-field="target"]').textContent =
      `First to ${this.getWinsNeeded()} wins`;
    sidebar.querySelector('[data-field="status"]').textContent = this.game.getStatus();

    if (this.settings.showScoreboard) {
      const scoreCard = document.createElement("div");
      scoreCard.className = "score-card";
      scoreCard.innerHTML = `
        <p class="info-label">Match Score</p>
        <div class="score-row">
          <span data-score-label="X"></span>
          <strong data-score="X">${this.score.X}</strong>
        </div>
        <div class="score-row">
          <span data-score-label="O"></span>
          <strong data-score="O">${this.score.O}</strong>
        </div>
      `;
      scoreCard.querySelector('[data-score-label="X"]').textContent = this.game.getPlayerName("X");
      scoreCard.querySelector('[data-score-label="O"]').textContent = this.game.getPlayerName("O");
      sidebar.append(scoreCard);
    }

    const lifetimeCard = document.createElement("div");
    lifetimeCard.className = "score-card";
    lifetimeCard.innerHTML = `
      <p class="info-label">Lifetime Stats</p>
      <div class="score-row">
        <span>Rounds</span>
        <strong data-stat="rounds">${this.stats.totalRounds}</strong>
      </div>
      <div class="score-row">
        <span>Draws</span>
        <strong data-stat="draws">${this.stats.draws}</strong>
      </div>
      <div class="score-row">
        <span>X Wins</span>
        <strong data-stat="wins-X">${this.stats.wins.X}</strong>
      </div>
      <div class="score-row">
        <span>O Wins</span>
        <strong data-stat="wins-O">${this.stats.wins.O}</strong>
      </div>
    `;
    sidebar.append(lifetimeCard);

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
      button.dataset.symbol = cellValue || "";
      button.addEventListener("click", () => this.handleMove(index, screen));
      this.cells.push(button);
      board.append(button);
    });

    boardPanel.append(board);
    wrapper.append(sidebar, boardPanel);

    sidebar
      .querySelector('[data-action="restart"]')
      ?.addEventListener("click", this.onRestartMatch);
    sidebar
      .querySelector('[data-action="menu"]')
      ?.addEventListener("click", this.onOpenMenu);

    return wrapper;
  }

  buildRoundModal() {
    const overlay = document.createElement("section");
    overlay.className = "round-modal-overlay is-hidden";
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
      <div class="round-modal" role="dialog" aria-modal="true" aria-labelledby="round-modal-title">
        <p class="eyebrow">Round Complete</p>
        <h2 id="round-modal-title" data-modal-title></h2>
        <p class="modal-copy" data-modal-copy></p>
        <div class="modal-stats">
          <div>
            <span>Match Score</span>
            <strong data-modal-match-score></strong>
          </div>
          <div>
            <span>Lifetime Record</span>
            <strong data-modal-lifetime></strong>
          </div>
        </div>
        <div class="hero-actions">
          <button class="button button-primary" type="button" data-action="next-round">Next Round</button>
          <button class="button button-secondary" type="button" data-action="new-match">New Match</button>
          <button class="button button-ghost" type="button" data-action="modal-menu">Main Menu</button>
        </div>
      </div>
    `;

    overlay
      .querySelector('[data-action="next-round"]')
      ?.addEventListener("click", () => {
        if (this.matchWinner) {
          this.onRestartMatch();
          return;
        }

        this.onNextRound();
      });
    overlay
      .querySelector('[data-action="new-match"]')
      ?.addEventListener("click", this.onRestartMatch);
    overlay
      .querySelector('[data-action="modal-menu"]')
      ?.addEventListener("click", this.onOpenMenu);

    return overlay;
  }

  handleMove(index, screen) {
    if (this.isAiTurn()) {
      return;
    }

    const moved = this.game.makeMove(index);

    if (!moved) {
      return;
    }

      this.soundManager.playMove(this.game.board[index], this.settings.soundEnabled);
    this.refreshBoard(screen);
    this.completeRoundIfNeeded(screen);
    this.maybePlayAiTurn(screen);
  }

  refreshBoard(screen) {
    this.cells.forEach((cell, index) => {
      const symbol = this.game.board[index] || "";

      cell.textContent = symbol;
      cell.dataset.symbol = symbol;
      cell.disabled = Boolean(symbol) || this.game.isFinished() || this.isAiThinking;
      cell.classList.toggle("cell-filled", Boolean(symbol));
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

  refreshStats(screen) {
    const totalRounds = screen.querySelector('[data-stat="rounds"]');
    const draws = screen.querySelector('[data-stat="draws"]');
    const winsX = screen.querySelector('[data-stat="wins-X"]');
    const winsO = screen.querySelector('[data-stat="wins-O"]');

    if (totalRounds) {
      totalRounds.textContent = String(this.stats.totalRounds);
    }

    if (draws) {
      draws.textContent = String(this.stats.draws);
    }

    if (winsX) {
      winsX.textContent = String(this.stats.wins.X);
    }

    if (winsO) {
      winsO.textContent = String(this.stats.wins.O);
    }
  }

  completeRoundIfNeeded(screen) {
    if ((this.game.winner || this.game.isDraw()) && !this.roundFinished) {
      this.roundFinished = true;
      const roundResult = this.onRoundComplete(this.game.winner) || {};
      this.matchWinner = roundResult.matchWinner || null;

      if (this.game.winner) {
        this.refreshScore(screen, this.game.winner);
        this.soundManager.playWin(this.settings.soundEnabled);
      } else {
        this.soundManager.playDraw(this.settings.soundEnabled);
      }

      this.refreshStats(screen);
      this.showRoundModal(screen);
    }
  }

  showRoundModal(screen) {
    const overlay = screen.querySelector(".round-modal-overlay");
    if (!overlay) {
      return;
    }

    const title = screen.querySelector("[data-modal-title]");
    const copy = screen.querySelector("[data-modal-copy]");
    const matchScore = screen.querySelector("[data-modal-match-score]");
    const lifetime = screen.querySelector("[data-modal-lifetime]");
    const nextRoundButton = screen.querySelector('[data-action="next-round"]');

    if (this.matchWinner) {
      const championName = this.game.getPlayerName(this.matchWinner);
      title.textContent = `${championName} wins the match`;
      copy.textContent = `${championName} reached the target first and closes out the set. Start another match or head back to the menu.`;
    } else if (this.game.winner) {
      const winnerName = this.game.getPlayerName(this.game.winner);
      title.textContent = `${winnerName} takes the round`;
      copy.textContent = `${winnerName} closed the board cleanly. Keep the set going or reset for a fresh match.`;
    } else {
      title.textContent = "Draw round";
      copy.textContent = "No clean finish this time. Run another round or reset the full match.";
    }

    matchScore.textContent = `${this.score.X} - ${this.score.O}`;
    lifetime.textContent = `X: ${this.stats.wins.X} / Draws: ${this.stats.draws} / O: ${this.stats.wins.O}`;
    if (nextRoundButton) {
      nextRoundButton.textContent = this.matchWinner ? "Play New Match" : "Next Round";
    }

    overlay.classList.remove("is-hidden");
    overlay.setAttribute("aria-hidden", "false");
  }

  maybePlayAiTurn(screen) {
    if (!this.isAiTurn() || this.game.isFinished()) {
      return;
    }

    this.isAiThinking = true;
    this.refreshBoard(screen);
    this.updateStatusText(screen, "Computer is thinking...");

    this.aiMoveTimeout = window.setTimeout(() => {
      const move = this.aiPlayer.chooseMove(this.game, this.settings.aiDifficulty);
      this.isAiThinking = false;

      if (move !== null) {
        this.game.makeMove(move);
        this.soundManager.playMove(this.aiPlayer.symbol, this.settings.soundEnabled);
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
      return `Computer / ${this.settings.aiDifficulty} / ${this.aiPlayer.symbol}`;
    }

    return "Local Versus";
  }

  getWinsNeeded() {
    return Math.floor(Number(this.settings.bestOf || 1) / 2) + 1;
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
