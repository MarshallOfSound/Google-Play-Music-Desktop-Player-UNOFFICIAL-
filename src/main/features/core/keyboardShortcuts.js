import _ from 'lodash';
import { globalShortcut } from 'electron';

// ↓ Without the lambda it crashes - Electron bug ?
let keyRegisterFn = (...args) => globalShortcut.register(...args);
if (process.platform === 'win32') {
  keyRegisterFn = require('ll-keyboard-hook-win').on;
}

keyRegisterFn('MediaPreviousTrack', () => {
  Emitter.sendToGooglePlayMusic('playback:previousTrack');
});

keyRegisterFn('MediaPlayPause', () => {
  Emitter.sendToGooglePlayMusic('playback:playPause');
});

keyRegisterFn('MediaNextTrack', () => {
  Emitter.sendToGooglePlayMusic('playback:nextTrack');
});

keyRegisterFn('MediaStop', () => {
  Emitter.sendToGooglePlayMusic('playback:stop');
});

const customHotkeysTemplate = {
  playPause: null,
  stop: null,
  previousTrack: null,
  nextTrack: null,
  thumbsUp: null,
  thumbsDown: null,
  increaseVolume: null,
  decreaseVolume: null,
};

const userHotkeys = Settings.get('hotkeys', {});

const customHotkeys = _.extend(customHotkeysTemplate, userHotkeys);


_.forIn(customHotkeys, (value, key) => {
  if (value) {
    globalShortcut.register(value, () => {
      Emitter.sendToGooglePlayMusic(`playback:${key}`);
    });
  }
});

Emitter.on('hotkey:set', (event, details) => {
  const key = details.action;

  if (customHotkeys[key] || customHotkeys[key] === null) {
    if (customHotkeys[key] && globalShortcut.isRegistered(customHotkeys[key])) {
      globalShortcut.unregister(customHotkeys[key]);
    }
    customHotkeys[key] = details.accelerator;
    if (customHotkeys[key]) {
      globalShortcut.register(customHotkeys[key], () => {
        Emitter.sendToGooglePlayMusic(`playback:${key}`);
      });
    }
    Settings.set('hotkeys', customHotkeys);
  }
});
