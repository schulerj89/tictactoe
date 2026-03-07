import test from "node:test";
import assert from "node:assert/strict";

import { SoundManager } from "../src/core/SoundManager.js";

test("SoundManager resolves music assets relative to the configured base URL", () => {
  const manager = new SoundManager({ baseUrl: "/tictactoe/" });
  const track = manager.getTrack("ode-to-joy");

  assert.equal(track.source, "/tictactoe/audio/ode-to-joy-16bit.wav");
});

test("SoundManager falls back to a root-relative base URL", () => {
  const manager = new SoundManager({ baseUrl: "/" });
  const track = manager.getTrack("fur-elise");

  assert.equal(track.source, "/audio/fur-elise-16bit.wav");
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

    assert.equal(track.source, "/tictactoe/audio/ode-to-joy-16bit.wav");
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

    assert.equal(track.source, "/tictactoe/audio/minuet-in-g-16bit.wav");
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
});

test("SoundManager applies configured volume levels", () => {
  const originalAudio = globalThis.Audio;
  globalThis.Audio = class {
    constructor(source) {
      this.src = source;
      this.volume = 1;
      this.loop = false;
      this.preload = "none";
      this.dataset = {};
      this.currentTime = 0;
      this.paused = true;
    }
  };

  const manager = new SoundManager({ baseUrl: "/" });

  try {
    manager.applySettings({
      musicEnabled: false,
      soundEffectsEnabled: true,
      musicVolume: 12,
      soundEffectsVolume: 30,
    });

    const audio = manager.ensureMusicAudio("/audio/fur-elise-16bit.wav");

    assert.equal(audio.volume, 0.12);
    assert.equal(manager.soundEffectsVolume, 0.3);
  } finally {
    globalThis.Audio = originalAudio;
  }
});

test("SoundManager exposes all bundled music tracks", () => {
  const manager = new SoundManager({ baseUrl: "/" });
  const tracks = manager.getAvailableTracks();

  assert.deepEqual(
    tracks.map((track) => track.id),
    [
      "ode-to-joy",
      "fur-elise",
      "minuet-in-g",
      "twinkle-twinkle",
      "auld-lang-syne",
      "turkish-march",
    ],
  );
  assert.equal(manager.getTrack("turkish-march").source, "/audio/turkish-march-16bit.wav");
});
