window.wait(() => {
  window.GPM.on('change:playback', (mode) => {
    switch (mode) {
      case window.GMusic.Playback.STOPPED:
        Emitter.fire('playback:isStopped');
        break;
      case window.GMusic.Playback.PAUSED:
        Emitter.fire('playback:isPaused');
        break;
      case window.GMusic.Playback.PLAYING:
        Emitter.fire('playback:isPlaying');
        break;
      default:
        break;
    }
  });

  let lastScrobble = {};
  let lastScrobbleTime = 0;
  let currentSong;

  window.GPM.on('change:song', (song) => {
    currentSong = song;
    Emitter.fire('change:song', song);
  });

  window.GPM.on('change:playback-time', (playbackInfo) => {
    if (playbackInfo.current >= playbackInfo.total / 2
          && Date.now() - 10000 >= lastScrobbleTime && currentSong !== null
          && JSON.stringify(lastScrobble) !== JSON.stringify(currentSong)) {
      Emitter.fire('change:song:scrobble', {
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        timestamp: Math.round((Date.now() - playbackInfo.current) / 1000),
      });
      lastScrobbleTime = Date.now();
      lastScrobble = currentSong;
    }
  });
});
