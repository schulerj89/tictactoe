import test from "node:test";
import assert from "node:assert/strict";

import { Game } from "../src/core/Game.js";

test("Game detects a win and stops the round", () => {
  const game = new Game();
  game.start({
    playerXName: "Nova",
    playerOName: "CPU",
    startingPlayer: "X",
  });

  game.makeMove(0);
  game.makeMove(3);
  game.makeMove(1);
  game.makeMove(4);
  game.makeMove(2);

  assert.equal(game.winner, "X");
  assert.deepEqual(game.winningLine, [0, 1, 2]);
  assert.equal(game.isFinished(), true);
  assert.equal(game.makeMove(5), false);
});

test("Game detects a draw", () => {
  const game = new Game();
  game.start({
    playerXName: "Nova",
    playerOName: "CPU",
    startingPlayer: "X",
  });

  [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach((move) => game.makeMove(move));

  assert.equal(game.winner, null);
  assert.equal(game.isDraw(), true);
  assert.equal(game.getStatus(), "Draw game");
});

test("Game exposes available moves", () => {
  const game = new Game();
  game.start({
    playerXName: "Nova",
    playerOName: "CPU",
    startingPlayer: "X",
  });

  game.makeMove(0);
  game.makeMove(4);

  assert.deepEqual(game.getAvailableMoves(), [1, 2, 3, 5, 6, 7, 8]);
});

test("Game rejects out-of-range move indexes", () => {
  const game = new Game();
  game.start({
    playerXName: "Nova",
    playerOName: "CPU",
    startingPlayer: "X",
  });

  assert.equal(game.makeMove(-1), false);
  assert.equal(game.makeMove(9), false);
  assert.equal(game.makeMove(1.5), false);
  assert.deepEqual(game.board, Array(9).fill(null));
  assert.equal(game.moveCount, 0);
});
