import { Game } from "./Game.js";

export class AIPlayer {
  constructor(symbol = "O") {
    this.symbol = symbol;
  }

  chooseMove(game, difficulty) {
    const availableMoves = game.getAvailableMoves();

    if (availableMoves.length === 0) {
      return null;
    }

    if (difficulty === "easy") {
      return this.pickRandomMove(availableMoves);
    }

    if (difficulty === "medium") {
      return this.pickMediumMove(game, availableMoves);
    }

    return this.pickBestMove(game, availableMoves);
  }

  pickRandomMove(availableMoves) {
    const index = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[index];
  }

  pickMediumMove(game, availableMoves) {
    const winningMove = this.findImmediateMove(game.board, this.symbol, availableMoves);
    if (winningMove !== null) {
      return winningMove;
    }

    const humanSymbol = this.getOpponentSymbol();
    const blockingMove = this.findImmediateMove(game.board, humanSymbol, availableMoves);
    if (blockingMove !== null) {
      return blockingMove;
    }

    if (availableMoves.includes(4)) {
      return 4;
    }

    const corners = [0, 2, 6, 8].filter((move) => availableMoves.includes(move));
    if (corners.length > 0) {
      return this.pickRandomMove(corners);
    }

    return this.pickRandomMove(availableMoves);
  }

  pickBestMove(game, availableMoves) {
    const humanSymbol = this.getOpponentSymbol();
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      const nextBoard = [...game.board];
      nextBoard[move] = this.symbol;

      const score = this.minimax(nextBoard, humanSymbol, 0);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  minimax(board, currentSymbol, depth) {
    const winningLine = Game.findWinningLine(board);
    if (winningLine) {
      const winner = board[winningLine[0]];
      if (winner === this.symbol) {
        return 10 - depth;
      }

      return depth - 10;
    }

    const availableMoves = board.flatMap((cell, index) => (cell ? [] : [index]));
    if (availableMoves.length === 0) {
      return 0;
    }

    const isAiTurn = currentSymbol === this.symbol;
    let bestScore = isAiTurn ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    for (const move of availableMoves) {
      const nextBoard = [...board];
      nextBoard[move] = currentSymbol;

      const score = this.minimax(nextBoard, this.flipSymbol(currentSymbol), depth + 1);

      if (isAiTurn) {
        bestScore = Math.max(bestScore, score);
      } else {
        bestScore = Math.min(bestScore, score);
      }
    }

    return bestScore;
  }

  findImmediateMove(board, symbol, availableMoves) {
    for (const move of availableMoves) {
      const nextBoard = [...board];
      nextBoard[move] = symbol;
      if (Game.findWinningLine(nextBoard)) {
        return move;
      }
    }

    return null;
  }

  getOpponentSymbol() {
    return this.symbol === "X" ? "O" : "X";
  }

  flipSymbol(symbol) {
    return symbol === "X" ? "O" : "X";
  }
}
