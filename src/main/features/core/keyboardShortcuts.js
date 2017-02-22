import _ from 'lodash';
import { globalShortcut } from 'electron';

// ↓ Without the lambda it crashes - Electron bug ?
let keyRegisterFn = (...args) => globalShortcut.register(...args);
if (process.platform === 'win32') {
  const hook = require('ll-keyboard-hook-win');

  keyRegisterFn = (key, fn) => {
    hook.on('down', key, fn);
  };
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
  infoTrack: null,
};

const userHotkeys = Settings.get('hotkeys', {});

const customHotkeys = _.extend(customHotkeysTemplate, userHotkeys);

const _unregisterHotkey = (accelerator) => {
  try {
    if (accelerator && globalShortcut.isRegistered(accelerator)) {
      globalShortcut.unregister(accelerator);
    }
  } catch (e) {
    Logger.error('Exception unregistering hotkey.', { accelerator, e });
  }
};

const _registerHotkeyIfSet = (accelerator, action) => {
  if (accelerator) {
    try {
      const success = globalShortcut.register(accelerator, () => {
        Emitter.sendToGooglePlayMusic(`playback:${action}`);
      });
      if (!success) {
        Logger.error('Failed to register hotkey.', { accelerator, action });
      }
    } catch (e) {
      Logger.error('Exception registering hotkey.', { accelerator, action, e });
    }
  }
};

_.forIn(customHotkeys, _registerHotkeyIfSet);

Emitter.on('hotkey:set', (event, details) => {
  const key = details.action;

  if (customHotkeys[key] || customHotkeys[key] === null) {
    _unregisterHotkey(customHotkeys[key]);
    customHotkeys[key] = details.accelerator;
    _registerHotkeyIfSet(customHotkeys[key], key);
    Settings.set('hotkeys', customHotkeys);
  }
});
