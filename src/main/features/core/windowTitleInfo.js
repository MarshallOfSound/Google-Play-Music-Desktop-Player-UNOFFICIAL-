const windowTitle = WindowManager.get(global.mainWindowID).getTitle();

if (Settings.get('enableWindowTitleInfo')) {
  PlaybackAPI.on('change:song', (songInfo) => {
    WindowManager.get(global.mainWindowID).setTitle(
      `${(songInfo.title || 'Unknown Song')} - ${(songInfo.artist || 'Unknown Artist')}`
    );
  });
  PlaybackAPI.on('change:state', (state) => {
    const songInfo = PlaybackAPI.currentSong();
    WindowManager.get(global.mainWindowID).setTitle(
      (state)
      ? `${(songInfo.title || 'Unknown Song')} - ${(songInfo.artist || 'Unknown Artist')}`
      : windowTitle
    );
  });
}
