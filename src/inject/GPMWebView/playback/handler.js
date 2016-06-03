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
    const rating = window.GPM.rating.getRating();
    if (rating === '0') {
      // we have to emit this manually if the user hasn't rated the song
      Emitter.fire('change:rating', rating);
    }
  });

  window.GPM.on('change:rating', (rating) => {
    Emitter.fire('change:rating', rating);
  });

  window.GPM.on('change:shuffle', (mode) => {
    Emitter.fire('change:shuffle', mode);
  });
  // DEV: Set inital shuffle value
  setTimeout(() => {
    Emitter.fire('change:shuffle', window.GPM.playback.getShuffle());
  }, 100);

  window.GPM.on('change:repeat', (mode) => {
    Emitter.fire('change:repeat', mode);
  });
  // DEV: Set inital repeat value
  setTimeout(() => {
    Emitter.fire('change:repeat', window.GPM.playback.getRepeat());
  }, 100);

  window.GPM.on('change:playback-time', (playbackInfo) => {
    Emitter.fire('change:playback-time', playbackInfo);
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

  window.GPM.on('change:playlists', (playlists) => {
    Emitter.fire('change:playlists', playlists);
  });
  window.GPM.on('change:queue', (queue) => {
    Emitter.fire('change:queue', queue);
  });

  Emitter.on('execute:gmusic', (event, cmd) => {
    if (window.GPM && GPM[cmd.namespace] && GPM[cmd.namespace][cmd.method]
      && typeof GPM[cmd.namespace][cmd.method] === 'function') {
      GPM[cmd.namespace][cmd.method].apply(GPM, cmd.args || []);
    }
  });
});
