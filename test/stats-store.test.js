import test from "node:test";
import assert from "node:assert/strict";

import { StatsStore } from "../src/core/StatsStore.js";

function createStorage(initialValue = null) {
  let value = initialValue;

  return {
    getItem(key) {
      return key === "tictactoe-stats" ? value : null;
    },
    setItem(key, nextValue) {
      if (key === "tictactoe-stats") {
        value = nextValue;
      }
    },
  };
}

test("StatsStore resets the persisted lifetime record", () => {
  const storage = createStorage(
    JSON.stringify({
      totalRounds: 12,
      draws: 3,
      wins: {
        X: 5,
        O: 4,
      },
    }),
  );
  global.window = { localStorage: storage };

  const stats = new StatsStore();
  const resetState = stats.reset();

  assert.deepEqual(resetState, {
    totalRounds: 0,
    draws: 0,
    wins: {
      X: 0,
      O: 0,
    },
  });
  assert.deepEqual(JSON.parse(storage.getItem("tictactoe-stats")), resetState);
});
