(<any>window).wait(() => {
  GPM.on('change:playback', (mode) => {
    switch (mode) {
      case (<any>window).GMusic.PlaybackStatus.STOPPED:
        Emitter.fire('playback:isStopped');
        break;
      case (<any>window).GMusic.PlaybackStatus.PAUSED:
        Emitter.fire('playback:isPaused');
        break;
      case (<any>window).GMusic.PlaybackStatus.PLAYING:
        Emitter.fire('playback:isPlaying');
        break;
      default:
        break;
    }
  });

  let lastScrobble = {};
  let lastScrobbleTime = 0;
  let currentSong;

  GPM.on('change:track', (song) => {
    currentSong = song;
    Emitter.fire('change:track', song);
    Emitter.fire('change:rating', GPM.rating.getRating());
  });

  GPM.on('change:rating', (rating) => {
    Emitter.fire('change:rating', rating);
  });

  GPM.on('change:shuffle', (mode) => {
    Emitter.fire('change:shuffle', mode);
  });
  // DEV: Set inital shuffle value
  setTimeout(() => {
    Emitter.fire('change:shuffle', GPM.playback.getShuffle());
  }, 100);

  GPM.on('change:repeat', (mode) => {
    Emitter.fire('change:repeat', mode);
  });
  // DEV: Set inital repeat value
  setTimeout(() => {
    Emitter.fire('change:repeat', GPM.playback.getRepeat());
  }, 100);

  GPM.on('change:playback-time', (playbackInfo) => {
    Emitter.fire('change:playback-time', playbackInfo);
    if (playbackInfo.current === 0) {
      lastScrobble = {};
      lastScrobbleTime = Date.now();
    }
    if (playbackInfo.current >= playbackInfo.total / 2
          && Date.now() - 10000 >= lastScrobbleTime && currentSong !== null
          && !currentSong.equals(lastScrobble)) {
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

  GPM.on('change:playlists', (playlists) => {
    Emitter.fire('change:playlists', playlists);
  });
  GPM.on('change:queue', (queue) => {
    Emitter.fire('change:queue', queue);
  });
  GPM.on('change:search-results', (results) => {
    Emitter.fire('change:search-results', results);
  });
  GPM.on('change:library', (library) => {
    Emitter.fire('change:library', library);
  });
  Emitter.fire('change:library', GPM.library.getLibrary());

  Emitter.on('execute:gmusic', (event, cmd) => {
    if ((<any>window).GPM && GPM[cmd.namespace] && GPM[cmd.namespace][cmd.method]
      && typeof GPM[cmd.namespace][cmd.method] === 'function') {
      let error;
      let result;
      try {
        result = GPM[cmd.namespace][cmd.method].apply(GPM, cmd.args || []);
      } catch (err) {
        error = err;
      }
      const sendResponse = (response, isError: boolean) => {
        Emitter.fire(`execute:gmusic:result_${cmd.requestID}`, {
          namespace: 'result',
          type: isError ? 'error' : 'return',
          value: response,
          requestID: cmd.requestID,
        });
      };
      if (error) {
        sendResponse(error, true);
      } else {
        (<any>window).Promise.resolve(result)
          .then((response) => sendResponse(response, false))
          .catch((err) => sendResponse(err, true));
      }
    }
  });
});
