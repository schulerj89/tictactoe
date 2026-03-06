const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function findWinningLine(board) {
  return (
    WINNING_LINES.find(([a, b, c]) => {
      const cell = board[a];
      return cell && cell === board[b] && cell === board[c];
    }) || null
  );
}

export class Game {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = "X";
    this.winner = null;
    this.winningLine = [];
    this.moveCount = 0;
    this.players = {
      X: "Player X",
      O: "Player O",
    };
  }

  start(settings) {
    this.players = {
      X: settings.playerXName,
      O: settings.playerOName,
    };
    this.reset(settings.startingPlayer);
  }

  reset(startingPlayer = "X") {
    this.board = Array(9).fill(null);
    this.currentPlayer = startingPlayer;
    this.winner = null;
    this.winningLine = [];
    this.moveCount = 0;
  }

  makeMove(index) {
    if (this.board[index] || this.isFinished()) {
      return false;
    }

    this.board[index] = this.currentPlayer;
    this.moveCount += 1;

    const winData = this.findWinner();
    if (winData) {
      this.winner = this.currentPlayer;
      this.winningLine = winData;
      return true;
    }

    if (!this.isDraw()) {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }

    return true;
  }

  findWinner() {
    return findWinningLine(this.board);
  }

  isDraw() {
    return this.moveCount === 9 && !this.winner;
  }

  isFinished() {
    return Boolean(this.winner) || this.isDraw();
  }

  getAvailableMoves(board = this.board) {
    return board.flatMap((cell, index) => (cell ? [] : [index]));
  }

  static findWinningLine(board) {
    return findWinningLine(board);
  }

  getPlayerName(symbol) {
    return this.players[symbol];
  }

  getStatus() {
    if (this.winner) {
      return `${this.getPlayerName(this.winner)} wins`;
    }

    if (this.isDraw()) {
      return "Draw game";
    }

    return `${this.getPlayerName(this.currentPlayer)}'s turn`;
  }
}
