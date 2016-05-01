const windowTitle = WindowManager.get(global.mainWindowID).getTitle();

if (Settings.get('enableWindowTitleInfo')) {
  PlaybackAPI.on('change:song', (songInfo) => {
    WindowManager.get(global.mainWindowID).setTitle(
      `${(songInfo.title || TranslationProvider.query('label-unknown-song'))} - ${(songInfo.artist || TranslationProvider.query('label-unknown-artist'))}` // eslint-disable-line
    );
  });
  PlaybackAPI.on('change:state', (state) => {
    const songInfo = PlaybackAPI.currentSong();
    WindowManager.get(global.mainWindowID).setTitle(
      (state)
      ? `${(songInfo.title || TranslationProvider.query('label-unknown-song'))} - ${(songInfo.artist || TranslationProvider.query('label-unknown-artist'))}` // eslint-disable-line
      : windowTitle
    );
  });
}
