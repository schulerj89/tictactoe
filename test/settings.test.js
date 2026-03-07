import test from "node:test";
import assert from "node:assert/strict";

import { Settings } from "../src/core/Settings.js";

function createStorage(initialValue = null) {
  let value = initialValue;

  return {
    getItem(key) {
      return key === "tictactoe-settings" ? value : null;
    },
    setItem(key, nextValue) {
      if (key === "tictactoe-settings") {
        value = nextValue;
      }
    },
  };
}

test("Settings migrates the legacy soundEnabled flag", () => {
  global.window = {
    localStorage: createStorage(JSON.stringify({ soundEnabled: false })),
  };

  const settings = new Settings().getState();

  assert.equal(settings.musicEnabled, false);
  assert.equal(settings.soundEffectsEnabled, false);
  assert.equal(settings.musicTrackId, "ode-to-joy");
});

test("Settings persists separate music and sound effect preferences", () => {
  const storage = createStorage();
  global.window = { localStorage: storage };

  const settings = new Settings();
  settings.update({
    musicEnabled: false,
    soundEffectsEnabled: true,
    musicTrackId: "fur-elise",
  });

  assert.deepEqual(JSON.parse(storage.getItem("tictactoe-settings")), {
    playerXName: "Nova",
    playerOName: "Pixel",
    startingPlayer: "X",
    showScoreboard: true,
    opponentType: "computer",
    aiSymbol: "O",
    aiDifficulty: "medium",
    bestOf: 3,
    musicEnabled: false,
    soundEffectsEnabled: true,
    musicTrackId: "fur-elise",
  });
});
