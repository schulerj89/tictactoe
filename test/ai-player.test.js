import test from "node:test";
import assert from "node:assert/strict";

import { AIPlayer } from "../src/core/AIPlayer.js";
import { Game } from "../src/core/Game.js";

function createGame(board, currentPlayer = "O") {
  const game = new Game();
  game.board = [...board];
  game.currentPlayer = currentPlayer;
  game.moveCount = board.filter(Boolean).length;
  return game;
}

test("Easy AI only selects open squares", () => {
  const game = createGame(["X", "O", "X", null, "O", null, null, "X", null]);
  const ai = new AIPlayer("O");
  const move = ai.chooseMove(game, "easy");

  assert.ok([3, 5, 6, 8].includes(move));
});

test("Medium AI takes an immediate winning move", () => {
  const game = createGame(["X", "X", null, "O", "O", null, null, null, null]);
  const ai = new AIPlayer("O");
  const move = ai.chooseMove(game, "medium");

  assert.equal(move, 5);
});

test("Hard AI blocks a forced loss", () => {
  const game = createGame(["X", "X", null, null, "O", null, null, null, null]);
  const ai = new AIPlayer("O");
  const move = ai.chooseMove(game, "hard");

  assert.equal(move, 2);
});
