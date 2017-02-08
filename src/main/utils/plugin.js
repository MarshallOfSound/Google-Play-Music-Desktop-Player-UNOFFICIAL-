PlaybackAPI.on('change:state', (state) => {
  if (!state) {
    setTimeout(() => {
      PlaybackAPI.callGMusicJS('playback', 'playPause');
    }, 1000);
  }
})