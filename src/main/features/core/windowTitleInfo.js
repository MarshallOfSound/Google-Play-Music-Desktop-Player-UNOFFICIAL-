const windowTitle = WindowManager.get(global.mainWindowID).getTitle();

PlaybackAPI.on('change:song', (songInfo) => {
  const newString = `${(songInfo.title || TranslationProvider.query('label-unknown-song'))} - ${(songInfo.artist || TranslationProvider.query('label-unknown-artist'))}`; // eslint-disable-line
  global.appIcon.setToolTip(newString);
  WindowManager.get(global.mainWindowID).setTitle(newString);
});
PlaybackAPI.on('change:state', (state) => {
  const songInfo = PlaybackAPI.currentSong();
  const newString = (state)
  ? `${(songInfo.title || TranslationProvider.query('label-unknown-song'))} - ${(songInfo.artist || TranslationProvider.query('label-unknown-artist'))}` // eslint-disable-line
  : windowTitle;
  global.appIcon.setToolTip(newString);
  WindowManager.get(global.mainWindowID).setTitle(newString);
});
