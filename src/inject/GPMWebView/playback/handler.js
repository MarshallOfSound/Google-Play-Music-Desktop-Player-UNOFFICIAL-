window.wait(() => {
  window.GPM.on('change:playback', (mode) => {
    switch (mode) {
      case window.GMusic.PlaybackStatus.STOPPED:
        Emitter.fire('playback:isStopped');
        break;
      case window.GMusic.PlaybackStatus.PAUSED:
        Emitter.fire('playback:isPaused');
        break;
      case window.GMusic.PlaybackStatus.PLAYING:
        Emitter.fire('playback:isPlaying');
        break;
      default:
        break;
    }
  });

  let lastScrobble = {};
  let lastScrobbleTime = 0;
  let currentSong;

  window.GPM.on('change:track', (song) => {
    currentSong = song;
    Emitter.fire('change:track', song);
    Emitter.fire('change:rating', window.GPM.rating.getRating());
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
    if (playbackInfo.current === 0) {
      lastScrobble = {};
      lastScrobbleTime = Date.now();
    }
    if (playbackInfo.current >= playbackInfo.total / 2
          && Date.now() - 10000 >= lastScrobbleTime && currentSong !== null
          && JSON.stringify(lastScrobble) !== JSON.stringify(currentSong)) {
      Emitter.fire('change:track:scrobble', {
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
  window.GPM.on('change:search-results', (results) => {
    Emitter.fire('change:search-results', results);
  });
  window.GPM.on('change:library', (library) => {
    Emitter.fire('change:library', library);
  });
  Emitter.fire('change:library', window.GPM.library.getLibrary());

  Emitter.on('execute:gmusic', (event, cmd) => {
    if (window.GPM && GPM[cmd.namespace] && GPM[cmd.namespace][cmd.method]
      && typeof GPM[cmd.namespace][cmd.method] === 'function') {
      let error;
      let result;
      try {
        result = GPM[cmd.namespace][cmd.method].apply(GPM, cmd.args || []);
      } catch (err) {
        error = err;
      }
      Emitter.fire(`execute:gmusic:result_${cmd.requestID}`, {
        namespace: 'result',
        type: error ? 'error' : 'return',
        value: error || result,
        requestID: cmd.requestID,
      });
    }
  });
});
