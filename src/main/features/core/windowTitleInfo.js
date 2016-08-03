const windowTitle = WindowManager.get(global.mainWindowID).getTitle();

PlaybackAPI.on('change:song', (songInfo) => {
  const newString = `${(songInfo.title || TranslationProvider.query('label-unknown-song'))} - ${(songInfo.artist || TranslationProvider.query('label-unknown-artist'))}`; // eslint-disable-line
  global.appIcon.setToolTip(newString);
  WindowManager.get(global.mainWindowID).setTitle(newString);
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
  global.appIcon.setToolTip(newString);
  WindowManager.get(global.mainWindowID).setTitle(newString);
};

Emitter.on('playback:isPlaying', changeState.bind(this, 2));
Emitter.on('playback:isPaused', changeState.bind(this, 1));
Emitter.on('playback:isStopped', changeState.bind(this, 0));
