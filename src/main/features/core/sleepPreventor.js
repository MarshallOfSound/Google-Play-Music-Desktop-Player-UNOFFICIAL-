import { powerSaveBlocker } from 'electron';

let currentBlocker = null;

const block = () => {
  if (currentBlocker !== null && powerSaveBlocker.isStarted(currentBlocker)) return;
  currentBlocker = powerSaveBlocker.start('prevent-display-sleep');
};

const unblock = () => {
  if (currentBlocker !== null && powerSaveBlocker.isStarted(currentBlocker)) {
    powerSaveBlocker.stop(currentBlocker);
  }
  currentBlocker = null;
};

Settings.onChange('preventDisplaySleep', (shouldPrevent) => {
  if (shouldPrevent) {
    block();
  } else {
    unblock();
  }
});

if (Settings.get('preventDisplaySleep')) block();
