import test from "node:test";
import assert from "node:assert/strict";

import { SoundManager } from "../src/core/SoundManager.js";

test("SoundManager resolves music assets relative to the configured base URL", () => {
  const manager = new SoundManager({ baseUrl: "/tictactoe/" });
  const track = manager.getTrack("ode-to-joy");

  assert.equal(track.source, "/tictactoe/audio/ode-to-joy-8bit.wav");
});

test("SoundManager falls back to a root-relative base URL", () => {
  const manager = new SoundManager({ baseUrl: "/" });
  const track = manager.getTrack("fur-elise");

  assert.equal(track.source, "/audio/fur-elise-8bit.wav");
});

test("SoundManager infers the repository base path on GitHub Pages", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  globalThis.window = {
    location: {
      hostname: "schulerj89.github.io",
      pathname: "/tictactoe/",
    },
  };

  try {
    const manager = new SoundManager({ baseUrl: "/" });
    const track = manager.getTrack("ode-to-joy");

    assert.equal(track.source, "/tictactoe/audio/ode-to-joy-8bit.wav");
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
});

test("SoundManager prefers document.baseURI when deriving the deployed base path", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  globalThis.window = {
    location: {
      hostname: "example.com",
      pathname: "/",
    },
  };

  globalThis.document = {
    baseURI: "https://schulerj89.github.io/tictactoe/",
  };

  try {
    const manager = new SoundManager({ baseUrl: "/" });
    const track = manager.getTrack("minuet-in-g");

    assert.equal(track.source, "/tictactoe/audio/minuet-in-g-8bit.wav");
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
});
