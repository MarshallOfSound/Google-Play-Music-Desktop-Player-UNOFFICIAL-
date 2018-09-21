const windowTitle = 'Google Play Music Desktop Player';

let darwinTimer;
const updateDarwinTitle = (newTitle) => {
  clearTimeout(darwinTimer);
  darwinTimer = setTimeout(() => {
    Emitter.sendToWindowsOfName('main', 'window:updateTitle', newTitle);
  }, 200);
};

// fix display of ampersands on windows
const replaceAmpersands = string => (
  process.platform === 'win32' ? string.replace('&', '&&&') : string
);

PlaybackAPI.on('change:track', (songInfo) => {
  const newString = `${(songInfo.title || TranslationProvider.query('label-unknown-song'))} - ${(songInfo.artist || TranslationProvider.query('label-unknown-artist'))}`; // eslint-disable-line
  if (global.appIcon && !global.appIcon.isDestroyed()) global.appIcon.setToolTip(replaceAmpersands(newString));
  WindowManager.get(global.mainWindowID).setTitle(newString);
  updateDarwinTitle(newString);
});

const changeState = (stateVal) => {
  const songInfo = PlaybackAPI.currentSong(true);
  if (!songInfo) return;
  let newString = `${(songInfo.title || TranslationProvider.query('label-unknown-song'))} - ${(songInfo.artist || TranslationProvider.query('label-unknown-artist'))}`; // eslint-disable-line
  if (stateVal === 0) {
    newString = windowTitle;
  } else if (stateVal === 1) {
    newString = `(Paused) ${newString}`;
  }
  if (global.appIcon && !global.appIcon.isDestroyed()) global.appIcon.setToolTip(replaceAmpersands(newString));
  WindowManager.get(global.mainWindowID).setTitle(newString);
  updateDarwinTitle(newString);
};

Emitter.on('playback:isPlaying', changeState.bind(this, 2));
Emitter.on('playback:isPaused', changeState.bind(this, 1));
Emitter.on('playback:isStopped', changeState.bind(this, 0));
